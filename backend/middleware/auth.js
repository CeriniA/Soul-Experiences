import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar token JWT
export const protect = async (req, res, next) => {
  try {
    console.log('🔐 PROTECT MIDDLEWARE - Método:', req.method, 'URL:', req.url);
    console.log('🔑 Authorization header:', req.headers.authorization);
    
    let token;

    // Verificar si el token existe en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token encontrado');
    }

    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({
        success: false,
        error: 'No autorizado, token requerido'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado, usuario no encontrado'
        });
      }

      // Agregar usuario a la request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado, token inválido'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

// Middleware para verificar que el usuario esté autenticado (ya no necesitamos verificar roles)
export const authorize = () => {
  return (req, res, next) => {
    console.log('👤 AUTHORIZE MIDDLEWARE - Usuario autenticado:', req.user?.email);
    
    // Si llegamos aquí, el usuario ya pasó por el middleware protect
    // Por lo tanto, está autenticado y es administrador por defecto
    console.log('✅ Autorización exitosa');
    next();
  };
};

// Middleware opcional - no falla si no hay token
export const optionalAuth = async (req, res, next) => {
  try {
    console.log('🔓 OPTIONAL AUTH - URL:', req.url);
    console.log('🔑 Authorization header:', req.headers.authorization);
    
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token encontrado en optionalAuth');
    } else {
      console.log('❌ No hay token en optionalAuth');
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          req.user = user;
          console.log('✅ Usuario establecido en optionalAuth:', user.email);
        } else {
          console.log('❌ Usuario no encontrado');
        }
      } catch (error) {
        console.log('❌ Error verificando token en optionalAuth:', error.message);
        // Si el token es inválido, simplemente continúa sin usuario
      }
    }

    console.log('👤 req.user después de optionalAuth:', req.user ? req.user.email : 'null');
    next();
  } catch (error) {
    console.log('❌ Error en optionalAuth:', error.message);
    next();
  }
};
