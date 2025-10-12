import User from '../models/User.js';

/**
 * Servicio para manejar la lógica de negocio de los usuarios
 * Contiene toda la lógica de manipulación de datos y reglas de negocio
 */
class UserService {

  /**
   * Autenticar usuario con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Usuario autenticado con token
   */
  async authenticateUser(email, password) {
    try {
      // Validar que se proporcionen email y password
      if (!email || !password) {
        const error = new Error('Por favor proporciona email y contraseña');
        error.statusCode = 400;
        throw error;
      }

      // Buscar usuario y incluir password
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
      }

      // Verificar password
      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
      }

      // Actualizar último login (se eliminó la validación de isActive)
      user.lastLogin = new Date();
      await user.save();

      // Generar token
      const token = user.generateAuthToken();

      return {
        success: true,
        message: 'Login exitoso',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error en la autenticación: ${error.message}`);
    }
  }

  /**
   * Obtener perfil del usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Object} Perfil del usuario
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
  }

  /**
   * Cambiar contraseña del usuario
   * @param {string} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Object} Confirmación de cambio
   */
  async changeUserPassword(userId, currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) {
        const error = new Error('Por favor proporciona la contraseña actual y la nueva');
        error.statusCode = 400;
        throw error;
      }

      // Buscar usuario con password
      const user = await User.findById(userId).select('+password');

      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Verificar contraseña actual
      const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

      if (!isCurrentPasswordCorrect) {
        const error = new Error('Contraseña actual incorrecta');
        error.statusCode = 400;
        throw error;
      }

      // Actualizar contraseña
      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  /**
   * Crear usuario administrador (solo si no existe ninguno)
   * @param {Object} adminData - Datos del administrador
   * @returns {Object} Administrador creado con token
   */
  async createAdminUser(adminData) {
    try {
      // Verificar si ya existe un usuario
      const existingUser = await User.findOne();

      if (existingUser) {
        const error = new Error('Ya existe un usuario administrador');
        error.statusCode = 400;
        throw error;
      }

      const { name, email, password } = adminData;

      if (!name || !email || !password) {
        const error = new Error('Por favor proporciona nombre, email y contraseña');
        error.statusCode = 400;
        throw error;
      }

      const admin = await User.create({
        name,
        email,
        password
      });

      const token = admin.generateAuthToken();

      return {
        success: true,
        message: 'Administrador creado exitosamente',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      if (error.code === 11000) {
        const duplicateError = new Error('El email ya está registrado');
        duplicateError.statusCode = 400;
        throw duplicateError;
      }

      throw new Error(`Error al crear administrador: ${error.message}`);
    }
  }

  /**
   * Obtener todos los usuarios (admin)
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación
   * @returns {Object} Lista de usuarios
   */
  async getAllUsers(filters = {}, options = {}) {
    try {
      const { 
        isActive,
        limit = 10, 
        page = 1, 
        sort = '-createdAt' 
      } = { ...filters, ...options };
      
      // Construir filtros
      const filter = {};
      if (isActive !== undefined) filter.isActive = isActive;

      // Ejecutar consulta con paginación
      const users = await User.find(filter)
        .select('-password') // Excluir password
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(filter);

      return {
        success: true,
        data: users,
        count: users.length,
        total,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Crear nuevo usuario (admin)
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Usuario creado
   */
  async createUser(userData) {
    try {
      const user = await User.create(userData);

      return {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        message: 'Usuario creado exitosamente'
      };
    } catch (error) {
      if (error.code === 11000) {
        const duplicateError = new Error('El email ya está registrado');
        duplicateError.statusCode = 400;
        throw duplicateError;
      }

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.messages = messages;
        throw validationError;
      }

      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario (admin)
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Usuario actualizado
   */
  async updateUser(id, updateData) {
    try {
      // Si se está actualizando la contraseña, no incluirla en el update directo
      // La contraseña se debe cambiar usando changeUserPassword
      if (updateData.password) {
        delete updateData.password;
      }

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: user,
        message: 'Usuario actualizado exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.messages = messages;
        throw validationError;
      }

      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Eliminar usuario (admin)
   * @param {string} id - ID del usuario
   * @returns {Object} Confirmación de eliminación
   */
  async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        message: 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Procesar logout (principalmente para logging)
   * @param {string} userId - ID del usuario
   * @returns {Object} Confirmación de logout
   */
  async logoutUser(userId) {
    try {
      // En JWT, el logout se maneja del lado del cliente eliminando el token
      // Aquí podríamos registrar el logout si fuera necesario
      
      return {
        success: true,
        message: 'Logout exitoso'
      };
    } catch (error) {
      throw new Error(`Error en logout: ${error.message}`);
    }
  }
}

// Exportar una instancia del servicio
export default new UserService();
