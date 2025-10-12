import Lead from '../models/Lead.js';
import Retreat from '../models/Retreat.js';
import leadService from '../services/leadService.js';

// @desc    Obtener todos los leads
// @route   GET /api/leads
// @access  Private (Admin)
export const getLeads = async (req, res) => {
  try {
    const result = await leadService.getAllLeads(req.query, req.query);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error al obtener leads',
      messages: error.messages
    });
  }
};

// @desc    Obtener lead por ID
// @route   GET /api/leads/:id
// @access  Private (Admin)
export const getLead = async (req, res) => {
  try {
    const result = await leadService.getLeadById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error al obtener lead',
      messages: error.messages
    });
  }
};

// @desc    Crear nuevo lead (desde landing page)
// @route   POST /api/leads
// @access  Public
export const createLead = async (req, res) => {
  try {
    const result = await leadService.createLead(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error al crear lead',
      messages: error.messages
    });
  }
};

// @desc    Actualizar lead
// @route   PUT /api/leads/:id
// @access  Private (Admin)
export const updateLead = async (req, res) => {
  try {
    const result = await leadService.updateLead(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error al actualizar lead',
      messages: error.messages
    });
  }
};

// @desc    Eliminar lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
export const deleteLead = async (req, res) => {
  try {
    const result = await leadService.deleteLead(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error al eliminar lead',
      messages: error.messages
    });
  }
};

// @desc    Obtener estadísticas de leads
// @route   GET /api/leads/stats/overview
// @access  Private (Admin)
export const getLeadStats = async (req, res) => {
  try {
    const result = await leadService.getLeadStats();
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error al obtener estadísticas',
      messages: error.messages
    });
  }
};
