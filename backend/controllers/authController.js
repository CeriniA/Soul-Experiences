import userService from '../services/userService.js';
import { APP_CONFIG } from '../config/database.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) throw AppError.badRequest('Datos requeridos');
  const result = await userService.authenticateUser(email, password);
  // Establecer cookie HttpOnly de primer partido con el token
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  // Opciones de cookie parametrizadas por variables de entorno
  const cookieOptions = {
    httpOnly: true,
    secure: APP_CONFIG.COOKIE_SECURE,
    sameSite: APP_CONFIG.COOKIE_SAMESITE,
    path: '/',
    maxAge: thirtyDaysMs,
  };
  res.cookie('token', result.token, cookieOptions);
  // Devolver también el body previo para compatibilidad con el frontend actual
  res.json(result);
});

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const result = await userService.getUserProfile(req.user.id);
  res.json(result);
});

// @desc    Logout (invalidar token del lado del cliente)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  const result = await userService.logoutUser(req.user.id);
  // Limpiar la cookie usando las mismas opciones relevantes
  res.clearCookie('token', {
    httpOnly: true,
    secure: APP_CONFIG.COOKIE_SECURE,
    sameSite: APP_CONFIG.COOKIE_SAMESITE,
    path: '/',
  });
  res.json(result);
});

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) throw AppError.badRequest('Datos requeridos');
  const result = await userService.changeUserPassword(req.user.id, currentPassword, newPassword);
  res.json(result);
});

// @desc    Crear usuario admin (solo para desarrollo/setup inicial)
// @route   POST /api/auth/create-admin
// @access  Public (solo si no hay admins)
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) throw AppError.badRequest('Datos requeridos');
  const result = await userService.createAdminUser({ name, email, password });
  res.status(201).json(result);
});
