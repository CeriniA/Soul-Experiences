import express from 'express';
import {
  getRetreats,
  getRetreat,
  createRetreat,
  updateRetreat,
  deleteRetreat,
  getActiveRetreat,
  getPastRetreats,
  getHeroData,
  incrementInquiry
} from '../controllers/retreatController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para landing page)
router.get('/', optionalAuth, getRetreats);
router.get('/active/current', getActiveRetreat);
router.get('/past', getPastRetreats);
router.get('/hero-data', getHeroData);
router.get('/:id', getRetreat);
router.post('/:id/inquiry', incrementInquiry);

// RUTA TEMPORAL DE PRUEBA (SIN AUTENTICACIÓN)
router.put('/test/:id', (req, res, next) => {
  console.log('🧪 RUTA DE PRUEBA ALCANZADA - ID:', req.params.id);
  next();
}, updateRetreat);

// Rutas protegidas (admin dashboard)
router.use(protect); // Todas las rutas siguientes requieren autenticación
router.use(authorize()); // Usuario autenticado

router.post('/', createRetreat);
router.put('/:id', (req, res, next) => {
  console.log('🚀 RUTA PUT ALCANZADA - ID:', req.params.id);
  next();
}, updateRetreat);
router.delete('/:id', deleteRetreat);

export default router;
