import tokenService from '../services/tokenService.js';

// @desc    Generar tokens para participantes de un retiro
// @route   POST /api/tokens/generate/:retreatId
// @access  Private (Admin)
export const generateTokensForRetreat = async (req, res) => {
  try {
    const result = await tokenService.generateTokensForRetreat(
      req.params.retreatId,
      req.body.quantity
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: error.message
    };
    
    if (error.info) {
      response.info = error.info;
    }
    
    res.status(statusCode).json(response);
  }
};

// @desc    Obtener todos los tokens
// @route   GET /api/tokens
// @access  Private (Admin)
export const getTokens = async (req, res) => {
  try {
    const result = await tokenService.getAllTokens(req.query, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener tokens',
      message: error.message
    });
  }
};

// @desc    Obtener token por ID
// @route   GET /api/tokens/:id
// @access  Private (Admin)
export const getToken = async (req, res) => {
  try {
    const result = await tokenService.getTokenById(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Token no encontrado' : 'Error al obtener token',
      message: error.message
    });
  }
};

// @desc    Eliminar token
// @route   DELETE /api/tokens/:id
// @access  Private (Admin)
export const deleteToken = async (req, res) => {
  try {
    const result = await tokenService.deleteToken(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Token no encontrado' : 'Error al eliminar token',
      message: error.message
    });
  }
};

// @desc    Regenerar token expirado
// @route   POST /api/tokens/:id/regenerate
// @access  Private (Admin)
export const regenerateToken = async (req, res) => {
  try {
    const result = await tokenService.regenerateToken(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: error.message
    });
  }
};

// @desc    Validar token para testimonio público
// @route   GET /api/tokens/validate/:token
// @access  Public
export const validateToken = async (req, res) => {
  try {
    const result = await tokenService.validatePublicToken(req.params.token);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Token inválido, expirado o ya utilizado' : 'Error al validar token',
      message: error.message
    });
  }
};
