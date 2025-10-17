import tokenService from '../services/tokenService.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Generar tokens para TODOS los participantes confirmados de un retiro completado
// @route   POST /api/tokens/generate/:retreatId
// @access  Private (Admin)
export const generateTokensForRetreat = asyncHandler(async (req, res) => {
  // Se eliminó el parámetro quantity - siempre genera para todos los participantes
  const result = await tokenService.generateTokensForRetreat(req.params.retreatId);
  res.json(result);
});

// @desc    Obtener todos los tokens
// @route   GET /api/tokens
// @access  Private (Admin)
export const getTokens = asyncHandler(async (req, res) => {
  const result = await tokenService.getAllTokens(req.query, req.query);
  res.json(result);
});

// @desc    Obtener token por ID
// @route   GET /api/tokens/:id
// @access  Private (Admin)
export const getToken = asyncHandler(async (req, res) => {
  const result = await tokenService.getTokenById(req.params.id);
  res.json(result);
});

// @desc    Eliminar token
// @route   DELETE /api/tokens/:id
// @access  Private (Admin)
export const deleteToken = asyncHandler(async (req, res) => {
  const result = await tokenService.deleteToken(req.params.id);
  res.json(result);
});

// @desc    Regenerar token expirado
// @route   POST /api/tokens/:id/regenerate
// @access  Private (Admin)
export const regenerateToken = asyncHandler(async (req, res) => {
  const result = await tokenService.regenerateToken(req.params.id);
  res.json(result);
});

// @desc    Validar token para testimonio público
// @route   GET /api/tokens/validate/:token
// @access  Public
export const validateToken = asyncHandler(async (req, res) => {
  const result = await tokenService.validatePublicToken(req.params.token);
  res.json(result);
});
