import retreatService from '../services/retreatService.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// @desc    Obtener todos los retiros
// @route   GET /api/retreats
// @access  Public (para landing) / Private (para admin con más detalles)
export const getRetreats = asyncHandler(async (req, res) => {
  const result = await retreatService.getAllRetreats(req.query, req.query, req.user);
  res.json(result);
});

// @desc    Obtener retiro por ID o slug
// @route   GET /api/retreats/:id
// @access  Public
export const getRetreat = asyncHandler(async (req, res) => {
  const result = await retreatService.getRetreatById(req.params.id);
  
  // Si hay usuario autenticado (admin), agregar sugerencia de estado
  if (req.user && result.data) {
    const statusCheck = retreatService.validateRetreatStatus(result.data);
    if (statusCheck.needsChange) {
      result.statusWarning = {
        needsChange: true,
        current: statusCheck.current,
        suggested: statusCheck.suggested,
        reason: statusCheck.reason
      };
    }
  }
  
  res.json(result);
});

// @desc    Crear nuevo retiro
// @route   POST /api/retreats
// @access  Private (Admin)
export const createRetreat = asyncHandler(async (req, res) => {
  const result = await retreatService.createRetreat(req.body);
  res.status(201).json(result);
});

// @desc    Actualizar retiro
// @route   PUT /api/retreats/:id
// @access  Private (Admin)
export const updateRetreat = asyncHandler(async (req, res) => {
  logger.debug('🔄 UPDATE RETREAT - ID:', req.params.id);
  logger.debug('📤 Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  const result = await retreatService.updateRetreat(req.params.id, req.body);
  logger.debug('✅ Retiro actualizado exitosamente');
  res.json(result);
});

// @desc    Eliminar retiro
// @route   DELETE /api/retreats/:id
// @access  Private (Admin)
export const deleteRetreat = asyncHandler(async (req, res) => {
  const result = await retreatService.deleteRetreat(req.params.id);
  res.json(result);
});

// @desc    Obtener retiro activo para hero (para landing)
// @route   GET /api/retreats/active/current
// @access  Public
export const getActiveRetreat = asyncHandler(async (req, res) => {
  const result = await retreatService.getActiveRetreat();
  res.json(result);
});

// @desc    Obtener retiros pasados (para hero alternativo)
// @route   GET /api/retreats/past
// @access  Public
export const getPastRetreats = asyncHandler(async (req, res) => {
  const limitRaw = req.query.limit;
  const limit = limitRaw ? parseInt(limitRaw, 10) : 5;
  if (Number.isNaN(limit) || limit <= 0) throw AppError.badRequest('Parámetro limit inválido');
  const result = await retreatService.getPastRetreats(limit);
  res.json(result);
});

// @desc    Obtener datos para hero (retiros activos, pasados y testimonios)
// @route   GET /api/retreats/hero-data
// @access  Public
export const getHeroData = asyncHandler(async (req, res) => {
  const result = await retreatService.getHeroData();
  res.json(result);
});

