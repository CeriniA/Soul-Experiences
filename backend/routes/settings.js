import express from 'express';
import {
  getSettings,
  updateSettings,
  getPublicSettings,
  resetSettings
} from '../controllers/settingController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para landing page)
router.get('/public', getPublicSettings);
router.get('/', optionalAuth, getSettings);

// Rutas protegidas (admin dashboard)
router.use(protect); // Todas las rutas siguientes requieren autenticación
router.use(authorize()); // Usuario autenticado

router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;
