import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controlador para gestión de uploads de imágenes
 */

// Subir foto de perfil de Clari
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`;
    
    logger.info(`✅ Foto de perfil subida: ${req.file.filename}`);
    
    res.status(201).json({
      success: true,
      message: 'Foto de perfil subida exitosamente',
      data: {
        filename: req.file.filename,
        url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    logger.error('❌ Error subiendo foto de perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir la foto de perfil',
      error: error.message
    });
  }
};

// Subir múltiples fotos de perfil
export const uploadMultipleProfilePhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron imágenes'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/profile/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    logger.info(`✅ ${req.files.length} fotos de perfil subidas`);

    res.status(201).json({
      success: true,
      message: `${req.files.length} fotos subidas exitosamente`,
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('❌ Error subiendo fotos de perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir las fotos de perfil',
      error: error.message
    });
  }
};

// Listar todas las fotos de perfil
export const listProfilePhotos = async (req, res) => {
  try {
    const profileDir = path.join(__dirname, '../uploads/profile');
    
    if (!fs.existsSync(profileDir)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(profileDir);
    const photos = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const stats = fs.statSync(path.join(profileDir, file));
        return {
          filename: file,
          url: `/uploads/profile/${file}`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      success: true,
      data: photos
    });
  } catch (error) {
    logger.error('❌ Error listando fotos de perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar las fotos de perfil',
      error: error.message
    });
  }
};

// Eliminar foto de perfil
export const deleteProfilePhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/profile', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Foto no encontrada'
      });
    }

    fs.unlinkSync(filePath);
    logger.info(`✅ Foto de perfil eliminada: ${filename}`);

    res.json({
      success: true,
      message: 'Foto eliminada exitosamente'
    });
  } catch (error) {
    logger.error('❌ Error eliminando foto de perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la foto',
      error: error.message
    });
  }
};

// Subir imagen placeholder
export const uploadPlaceholder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    const imageUrl = `/uploads/placeholders/${req.file.filename}`;
    
    logger.info(`✅ Placeholder subido: ${req.file.filename}`);
    
    res.status(201).json({
      success: true,
      message: 'Placeholder subido exitosamente',
      data: {
        filename: req.file.filename,
        url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    logger.error('❌ Error subiendo placeholder:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir el placeholder',
      error: error.message
    });
  }
};

// Subir múltiples placeholders
export const uploadMultiplePlaceholders = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron imágenes'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/placeholders/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    logger.info(`✅ ${req.files.length} placeholders subidos`);

    res.status(201).json({
      success: true,
      message: `${req.files.length} placeholders subidos exitosamente`,
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('❌ Error subiendo placeholders:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir los placeholders',
      error: error.message
    });
  }
};

// Listar todos los placeholders
export const listPlaceholders = async (req, res) => {
  try {
    const placeholderDir = path.join(__dirname, '../uploads/placeholders');
    
    if (!fs.existsSync(placeholderDir)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(placeholderDir);
    const placeholders = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const stats = fs.statSync(path.join(placeholderDir, file));
        return {
          filename: file,
          url: `/uploads/placeholders/${file}`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      success: true,
      data: placeholders
    });
  } catch (error) {
    logger.error('❌ Error listando placeholders:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar los placeholders',
      error: error.message
    });
  }
};

// Eliminar placeholder
export const deletePlaceholder = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/placeholders', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Placeholder no encontrado'
      });
    }

    fs.unlinkSync(filePath);
    logger.info(`✅ Placeholder eliminado: ${filename}`);

    res.json({
      success: true,
      message: 'Placeholder eliminado exitosamente'
    });
  } catch (error) {
    logger.error('❌ Error eliminando placeholder:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el placeholder',
      error: error.message
    });
  }
};

// Obtener un placeholder aleatorio
export const getRandomPlaceholder = async (req, res) => {
  try {
    const placeholderDir = path.join(__dirname, '../uploads/placeholders');
    
    if (!fs.existsSync(placeholderDir)) {
      return res.status(404).json({
        success: false,
        message: 'No hay placeholders disponibles'
      });
    }

    const files = fs.readdirSync(placeholderDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay placeholders disponibles'
      });
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const stats = fs.statSync(path.join(placeholderDir, randomFile));

    res.json({
      success: true,
      data: {
        filename: randomFile,
        url: `/uploads/placeholders/${randomFile}`,
        size: stats.size
      }
    });
  } catch (error) {
    logger.error('❌ Error obteniendo placeholder aleatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener placeholder',
      error: error.message
    });
  }
};
