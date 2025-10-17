import testimonialService from '../services/testimonialService.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Obtener testimonios
// @route   GET /api/testimonials
// @access  Public (aprobados) / Private (todos para admin)
export const getTestimonials = asyncHandler(async (req, res) => {
  const result = await testimonialService.getAllTestimonials(req.query, req.query, req.user);
  res.json(result);
});

// @desc    Obtener testimonio por ID
// @route   GET /api/testimonials/:id
// @access  Private (Admin)
export const getTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.getTestimonialById(req.params.id);
  res.json(result);
});

// @desc    Crear testimonio con token
// @route   POST /api/testimonials/submit/:token
// @access  Public (con token válido)
export const submitTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.submitTestimonialWithToken(req.params.token, req.body);
  res.status(201).json(result);
});

// @desc    Validar token de testimonio
// @route   GET /api/testimonials/validate/:token
// @access  Public
export const validateToken = asyncHandler(async (req, res) => {
  const result = await testimonialService.validateTestimonialToken(req.params.token);
  res.json(result);
});

// @desc    Crear testimonio público con token
// @route   POST /api/testimonials/public
// @access  Public (con token válido)
export const createPublicTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.createPublicTestimonial(req.body);
  res.status(201).json(result);
});

// @desc    Crear testimonio (admin)
// @route   POST /api/testimonials
// @access  Private (Admin)
export const createTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.createTestimonial(req.body);
  res.status(201).json(result);
});

// @desc    Actualizar testimonio
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
export const updateTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.updateTestimonial(req.params.id, req.body);
  res.json(result);
});

// @desc    Eliminar testimonio
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.deleteTestimonial(req.params.id);
  res.json(result);
});

// @desc    Obtener testimonios destacados (para landing)
// @route   GET /api/testimonials/featured/public
// @access  Public
export const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const limitRaw = req.query.limit;
  const limit = limitRaw ? parseInt(limitRaw, 10) : 6;
  if (Number.isNaN(limit) || limit <= 0) throw AppError.badRequest('Parámetro limit inválido');
  const result = await testimonialService.getFeaturedTestimonials(limit);
  res.json(result);
});
