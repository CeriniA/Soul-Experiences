import retreatService from '../services/retreatService.js';

// @desc    Obtener todos los retiros
// @route   GET /api/retreats
// @access  Public (para landing) / Private (para admin con más detalles)
export const getRetreats = async (req, res) => {
  try {
    const result = await retreatService.getAllRetreats(req.query, req.query, req.user);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener retiros',
      message: error.message
    });
  }
};

// @desc    Obtener retiro por ID o slug
// @route   GET /api/retreats/:id
// @access  Public
export const getRetreat = async (req, res) => {
  try {
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
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Retiro no encontrado' : 'Error al obtener retiro',
      message: error.message
    });
  }
};

// @desc    Crear nuevo retiro
// @route   POST /api/retreats
// @access  Private (Admin)
export const createRetreat = async (req, res) => {
  try {
    const result = await retreatService.createRetreat(req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 400 ? (error.messages ? 'Error de validación' : error.message) : 'Error al crear retiro',
      message: error.message
    };
    
    if (error.messages) {
      response.messages = error.messages;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Actualizar retiro
// @route   PUT /api/retreats/:id
// @access  Private (Admin)
export const updateRetreat = async (req, res) => {
  try {
    console.log('🔄 UPDATE RETREAT - ID:', req.params.id);
    console.log('📤 Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    const result = await retreatService.updateRetreat(req.params.id, req.body);
    console.log('✅ Retiro actualizado exitosamente');
    res.json(result);
  } catch (error) {
    console.error('❌ Error actualizando retiro:', error);
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 404 ? 'Retiro no encontrado' : 
             statusCode === 400 ? (error.messages ? 'Error de validación' : 'Error de formato de datos') : 
             'Error al actualizar retiro',
      message: error.message
    };
    
    if (error.messages) {
      response.messages = error.messages;
    }
    if (error.details) {
      response.details = error.details;
    }
    if (error.path && error.value) {
      response.path = error.path;
      response.value = error.value;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Eliminar retiro
// @route   DELETE /api/retreats/:id
// @access  Private (Admin)
export const deleteRetreat = async (req, res) => {
  try {
    const result = await retreatService.deleteRetreat(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Retiro no encontrado' : 'Error al eliminar retiro',
      message: error.message
    });
  }
};

// @desc    Obtener retiro activo para hero (para landing)
// @route   GET /api/retreats/active/current
// @access  Public
export const getActiveRetreat = async (req, res) => {
  try {
    const result = await retreatService.getActiveRetreat();
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'No hay retiros activos disponibles' : 'Error al obtener retiro activo',
      message: error.message
    });
  }
};

// @desc    Obtener retiros pasados (para hero alternativo)
// @route   GET /api/retreats/past
// @access  Public
export const getPastRetreats = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const result = await retreatService.getPastRetreats(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener retiros pasados',
      message: error.message
    });
  }
};

// @desc    Obtener datos para hero (retiros activos, pasados y testimonios)
// @route   GET /api/retreats/hero-data
// @access  Public
export const getHeroData = async (req, res) => {
  try {
    const result = await retreatService.getHeroData();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos del hero',
      message: error.message
    });
  }
};

// @desc    Incrementar contador de consultas
// @route   POST /api/retreats/:id/inquiry
// @access  Public
export const incrementInquiry = async (req, res) => {
  try {
    const result = await retreatService.incrementInquiry(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Retiro no encontrado' : 'Error al registrar consulta',
      message: error.message
    });
  }
};
