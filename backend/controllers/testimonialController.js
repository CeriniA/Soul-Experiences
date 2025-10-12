import testimonialService from '../services/testimonialService.js';

// @desc    Obtener testimonios
// @route   GET /api/testimonials
// @access  Public (aprobados) / Private (todos para admin)
export const getTestimonials = async (req, res) => {
  try {
    const result = await testimonialService.getAllTestimonials(req.query, req.query, req.user);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener testimonios',
      message: error.message
    });
  }
};

// @desc    Obtener testimonio por ID
// @route   GET /api/testimonials/:id
// @access  Private (Admin)
export const getTestimonial = async (req, res) => {
  try {
    const result = await testimonialService.getTestimonialById(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Testimonio no encontrado' : 'Error al obtener testimonio',
      message: error.message
    });
  }
};

// @desc    Crear testimonio con token
// @route   POST /api/testimonials/submit/:token
// @access  Public (con token válido)
export const submitTestimonial = async (req, res) => {
  try {
    const result = await testimonialService.submitTestimonialWithToken(req.params.token, req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 400 ? (error.messages ? 'Error de validación' : error.message) : 'Error al enviar testimonio',
      message: error.message
    };
    
    if (error.messages) {
      response.messages = error.messages;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Validar token de testimonio
// @route   GET /api/testimonials/validate/:token
// @access  Public
export const validateToken = async (req, res) => {
  try {
    const result = await testimonialService.validateTestimonialToken(req.params.token);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 400 ? 'Token inválido o expirado' : 'Error al validar token',
      message: error.message
    });
  }
};

// @desc    Crear testimonio público con token
// @route   POST /api/testimonials/public
// @access  Public (con token válido)
export const createPublicTestimonial = async (req, res) => {
  try {
    const result = await testimonialService.createPublicTestimonial(req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 400 ? (error.messages ? 'Error de validación' : error.message) : 'Error al enviar testimonio',
      message: error.message
    };
    
    if (error.messages) {
      response.messages = error.messages;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Crear testimonio (admin)
// @route   POST /api/testimonials
// @access  Private (Admin)
export const createTestimonial = async (req, res) => {
  try {
    const result = await testimonialService.createTestimonial(req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 400 ? 'Error de validación' : 'Error al crear testimonio',
      message: error.message
    };
    
    if (error.messages) {
      response.messages = error.messages;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Actualizar testimonio
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
export const updateTestimonial = async (req, res) => {
  try {
    const result = await testimonialService.updateTestimonial(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 404 ? 'Testimonio no encontrado' : 
             statusCode === 400 ? 'Error de validación' : 
             'Error al actualizar testimonio',
      message: error.message
    };
    
    if (error.messages) {
      response.messages = error.messages;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Eliminar testimonio
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
export const deleteTestimonial = async (req, res) => {
  try {
    const result = await testimonialService.deleteTestimonial(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Testimonio no encontrado' : 'Error al eliminar testimonio',
      message: error.message
    });
  }
};

// @desc    Obtener testimonios destacados (para landing)
// @route   GET /api/testimonials/featured/public
// @access  Public
export const getFeaturedTestimonials = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;
    const result = await testimonialService.getFeaturedTestimonials(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener testimonios destacados',
      message: error.message
    });
  }
};
