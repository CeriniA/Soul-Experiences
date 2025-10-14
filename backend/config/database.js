import dotenv from 'dotenv';

// Cargar variables de entorno una sola vez
dotenv.config();

// Configuración de base de datos
export const DATABASE_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/clari-retiros',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001
};

// Configuración de Cloudinary (si la usas en backend)
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET
};

// Configuración de JWT (si la usas)
export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'tu-jwt-secret-por-defecto',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d'
};

export const APP_CONFIG = {
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'https://clariweb.onrender.com',
  BACKEND_ORIGIN: process.env.BACKEND_ORIGIN || 'https://soul-experiences.onrender.com',
  COOKIE_SAMESITE: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  COOKIE_SECURE: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : process.env.NODE_ENV === 'production'
};

// Función para validar configuración crítica
export const validateConfig = () => {
  const requiredVars = ['MONGODB_URI'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Variables de entorno faltantes:', missing);
    console.log('📝 Usando valores por defecto para desarrollo');
  }
  
  console.log('🔧 Configuración cargada:');
  console.log(`   - Base de datos: ${DATABASE_CONFIG.MONGODB_URI}`);
  console.log(`   - Puerto: ${DATABASE_CONFIG.PORT}`);
  console.log(`   - Entorno: ${DATABASE_CONFIG.NODE_ENV}`);
};
