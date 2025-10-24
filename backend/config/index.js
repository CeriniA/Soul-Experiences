/**
 * Configuración centralizada de la aplicación
 * Punto de entrada único para todas las variables de entorno
 */
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Objeto de configuración centralizado
 * Agrupa toda la configuración por dominio
 */
export const config = {
  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT, 10) || 5001,
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    isDev: process.env.NODE_ENV === 'development'
  },

  // Configuración de base de datos
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/clari-retiros'
  },

  // Configuración de autenticación
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30d'
  },

  // URLs de la aplicación
  app: {
    frontendOrigin: process.env.FRONTEND_ORIGIN || 'https://clariweb.onrender.com',
    backendOrigin: process.env.BACKEND_ORIGIN || 'https://soul-experiences.onrender.com'
  },

  // Configuración de cookies
  cookies: {
    secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax')
  },

  // Configuración de email
  email: {
    from: process.env.EMAIL_FROM || 'noreply@soulexperiences.com',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

  // Nota: Cloudinary se maneja desde el frontend
  // El backend solo recibe URLs de imágenes ya subidas
};

/**
 * Validar configuración crítica al inicio
 * Falla rápido si faltan variables requeridas
 */
export const validateConfig = () => {
  const errors = [];

  // Variables críticas
  if (!config.auth.jwtSecret) {
    errors.push('JWT_SECRET es requerido para la autenticación');
  }
  if (!config.database.uri) {
    errors.push('MONGODB_URI es requerido para la base de datos');
  }

  // Si hay errores críticos, fallar inmediatamente
  if (errors.length > 0) {
    logger.error('❌ Errores de configuración críticos:');
    errors.forEach(err => logger.error(`   - ${err}`));
    logger.error('\n💡 Asegúrate de tener un archivo .env con las variables requeridas');
    process.exit(1);
  }

  // Warnings para variables opcionales
  const warnings = [];
  if (!config.app.frontendOrigin) warnings.push('FRONTEND_ORIGIN');
  if (!config.app.backendOrigin) warnings.push('BACKEND_ORIGIN');
  if (!config.email.host) warnings.push('EMAIL_HOST');

  if (warnings.length > 0) {
    logger.warn('⚠️ Variables opcionales faltantes (usando defaults):', warnings.join(', '));
  }

  // Log de configuración cargada
  logger.info('🔧 Configuración cargada exitosamente:');
  logger.info(`   - Entorno: ${config.server.env}`);
  logger.info(`   - Puerto: ${config.server.port}`);
  logger.info(`   - Base de datos: ${config.database.uri}`);
  logger.info(`   - Frontend: ${config.app.frontendOrigin}`);
  logger.info(`   - Backend: ${config.app.backendOrigin}`);
};
