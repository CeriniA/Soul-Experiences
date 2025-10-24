import express from 'express';
import {
  getRetreats,
  getRetreat,
  createRetreat,
  updateRetreat,
  deleteRetreat,
  getActiveRetreat,
  getPastRetreats,
  getHeroData
} from '../controllers/retreatController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Rutas públicas (para landing page)
router.get('/', optionalAuth, getRetreats);
router.get('/active/current', getActiveRetreat);
router.get('/past', getPastRetreats);
router.get('/hero-data', getHeroData);
router.get('/:id', getRetreat);

// // RUTA TEMPORAL DE PRUEBA (SIN AUTENTICACIÓN)
// router.put('/test/:id', (req, res, next) => {
//   logger.debug('🧪 RUTA DE PRUEBA ALCANZADA - ID:', req.params.id);
//   next();
// }, updateRetreat);

// Rutas protegidas (admin dashboard)
router.use(protect); // Todas las rutas siguientes requieren autenticación

router.post('/', createRetreat);
router.put('/:id', updateRetreat);
router.delete('/:id', deleteRetreat);

export default router;
