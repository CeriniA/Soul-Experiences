/**
 * Módulo de conexión a MongoDB
 * Solo contiene la lógica de conexión a la base de datos
 */
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { config } from './index.js';

/**
 * Conectar a MongoDB usando la configuración centralizada
 * @returns {Promise<mongoose.Connection>} Conexión a MongoDB
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri);
    logger.info(`✅ MongoDB conectado: ${conn.connection.host}`);
    logger.info(`📊 Base de datos: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};
