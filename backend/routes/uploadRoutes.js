import express from 'express';
import {
  uploadProfilePhoto,
  uploadMultipleProfilePhotos,
  listProfilePhotos,
  deleteProfilePhoto,
  uploadPlaceholder,
  uploadMultiplePlaceholders,
  listPlaceholders,
  deletePlaceholder,
  getRandomPlaceholder
} from '../controllers/uploadController.js';
import {
  uploadProfilePhoto as uploadProfileMiddleware,
  uploadMultipleProfilePhotos as uploadMultipleProfileMiddleware,
  uploadPlaceholder as uploadPlaceholderMiddleware,
  uploadMultiplePlaceholders as uploadMultiplePlaceholdersMiddleware
} from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// RUTAS PARA FOTOS DE PERFIL DE CLARI
// ============================================

// Subir una foto de perfil (requiere autenticación de admin)
router.post(
  '/profile',
  protect,
  adminOnly,
  uploadProfileMiddleware,
  uploadProfilePhoto
);

// Subir múltiples fotos de perfil (requiere autenticación de admin)
router.post(
  '/profile/multiple',
  protect,
  adminOnly,
  uploadMultipleProfileMiddleware,
  uploadMultipleProfilePhotos
);

// Listar todas las fotos de perfil (público)
router.get('/profile', listProfilePhotos);

// Eliminar una foto de perfil (requiere autenticación de admin)
router.delete('/profile/:filename', protect, adminOnly, deleteProfilePhoto);

// ============================================
// RUTAS PARA PLACEHOLDERS DE RETIROS
// ============================================

// Subir un placeholder (requiere autenticación de admin)
router.post(
  '/placeholders',
  protect,
  adminOnly,
  uploadPlaceholderMiddleware,
  uploadPlaceholder
);

// Subir múltiples placeholders (requiere autenticación de admin)
router.post(
  '/placeholders/multiple',
  protect,
  adminOnly,
  uploadMultiplePlaceholdersMiddleware,
  uploadMultiplePlaceholders
);

// Listar todos los placeholders (público)
router.get('/placeholders', listPlaceholders);

// Obtener un placeholder aleatorio (público)
router.get('/placeholders/random', getRandomPlaceholder);

// Eliminar un placeholder (requiere autenticación de admin)
router.delete('/placeholders/:filename', protect, adminOnly, deletePlaceholder);

export default router;
