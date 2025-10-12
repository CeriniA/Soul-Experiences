// Archivo de configuración centralizada
export { DATABASE_CONFIG, CLOUDINARY_CONFIG, AUTH_CONFIG, validateConfig } from './database.js';

// Configuraciones adicionales que puedas necesitar
export const APP_CONFIG = {
  // Configuración de CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Configuración de archivos
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10MB',
  
  // Configuración de email (si usas)
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@soulexperiences.com',
  
  // URLs del frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Función para obtener configuración completa
export const getConfig = () => ({
  database: DATABASE_CONFIG,
  cloudinary: CLOUDINARY_CONFIG,
  auth: AUTH_CONFIG,
  app: APP_CONFIG
});
