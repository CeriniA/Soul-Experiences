import userService from '../services/userService.js';

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticateUser(email, password);
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
