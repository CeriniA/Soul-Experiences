import userService from '../services/userService.js';
import { APP_CONFIG } from '../config/database.js';

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 400 ? 'Datos requeridos' : 
             statusCode === 401 ? error.message : 
             'Error en el servidor',
      message: error.message
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.user.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Usuario no encontrado' : 'Error en el servidor',
      message: error.message
    });
  }
};

// @desc    Logout (invalidar token del lado del cliente)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    const result = await userService.logoutUser(req.user.id);
    // Limpiar la cookie usando las mismas opciones relevantes
    res.clearCookie('token', {
      httpOnly: true,
      secure: APP_CONFIG.COOKIE_SECURE,
      sameSite: APP_CONFIG.COOKIE_SAMESITE,
      path: '/',
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changeUserPassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 400 ? error.message : 'Error en el servidor',
      message: error.message
    });
  }
};

// @desc    Crear usuario admin (solo para desarrollo/setup inicial)
// @route   POST /api/auth/create-admin
// @access  Public (solo si no hay admins)
export const createAdmin = async (req, res) => {
  try {
    const result = await userService.createAdminUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 400 ? error.message : 'Error en el servidor',
      message: error.message
    });
  }
};
