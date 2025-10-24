import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

/**
 * Extraer token JWT desde Authorization Bearer header o cookie
 * Requiere cookie-parser middleware configurado en server.js
 * @param {Request} req - Express request object
 * @returns {string|undefined} Token JWT o undefined si no existe
 */
function extractToken(req) {
  // 1) Authorization header: Bearer <token>
  const auth = req.headers.authorization || '';
  if (auth.toLowerCase().startsWith('bearer ')) {
    const parts = auth.split(' ');
    if (parts.length === 2 && parts[1]) {
      return parts[1].trim();
    }
  }

  // 2) Cookie 'token' (usando cookie-parser)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return undefined;
}

// Middleware para verificar token JWT
export const protect = async (req, res, next) => {
  try {
    logger.debug('🔐 PROTECT MIDDLEWARE - Método:', req.method, 'URL:', req.url);
    logger.debug('🔑 Authorization header:', req.headers.authorization);
    
    const token = extractToken(req);

    if (!token) {
      logger.debug('❌ No token found');
      return next(AppError.unauthorized('No autorizado, token requerido'));
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(AppError.unauthorized('No autorizado, usuario no encontrado'));
      }

      // Agregar usuario a la request
      req.user = user;
      next();
    } catch (error) {
      // Dejar que el error de JWT sea mapeado por el errorHandler (TokenExpiredError/JsonWebTokenError)
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware opcional - no falla si no hay token
 * Útil para rutas que pueden ser públicas o privadas
 * Si hay token válido, establece req.user, si no, continúa sin usuario
 */
export const optionalAuth = async (req, res, next) => {
  try {
    logger.debug('🔓 OPTIONAL AUTH - URL:', req.url);
    logger.debug('🔑 Authorization header:', req.headers.authorization);
    
    const token = extractToken(req);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          req.user = user;
          logger.debug('✅ Usuario establecido en optionalAuth:', user.email);
        } else {
          logger.debug('❌ Usuario no encontrado');
        }
      } catch (error) {
        logger.debug('❌ Error verificando token en optionalAuth:', error.message);
        // Si el token es inválido, simplemente continúa sin usuario
      }
    }

    logger.debug('👤 req.user después de optionalAuth:', req.user ? req.user.email : 'null');
    next();
  } catch (error) {
    logger.debug('❌ Error en optionalAuth:', error.message);
    next(error);
  }
};
