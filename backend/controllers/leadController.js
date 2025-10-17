import Lead from '../models/Lead.js';
import Retreat from '../models/Retreat.js';
import leadService from '../services/leadService.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Obtener todos los leads
// @route   GET /api/leads
// @access  Private (Admin)
export const getLeads = asyncHandler(async (req, res) => {
  const result = await leadService.getAllLeads(req.query, req.query);
  res.json(result);
});

// @desc    Obtener lead por ID
// @route   GET /api/leads/:id
// @access  Private (Admin)
export const getLead = asyncHandler(async (req, res) => {
  const result = await leadService.getLeadById(req.params.id);
  res.json(result);
});

// @desc    Crear nuevo lead (desde landing page)
// @route   POST /api/leads
// @access  Public
export const createLead = asyncHandler(async (req, res) => {
  const result = await leadService.createLead(req.body);
  res.status(201).json(result);
});

// @desc    Actualizar lead
// @route   PUT /api/leads/:id
// @access  Private (Admin)
export const updateLead = asyncHandler(async (req, res) => {
  const result = await leadService.updateLead(req.params.id, req.body);
  res.json(result);
});

// @desc    Eliminar lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
export const deleteLead = asyncHandler(async (req, res) => {
  const result = await leadService.deleteLead(req.params.id);
  res.json(result);
});

// @desc    Obtener estadísticas de leads
// @route   GET /api/leads/stats/overview
// @access  Private (Admin)
export const getLeadStats = asyncHandler(async (req, res) => {
  const result = await leadService.getLeadStats();
  res.json(result);
});
