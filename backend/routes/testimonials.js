import express from 'express';
import {
  getTestimonials,
  getTestimonial,
  submitTestimonial,
  validateToken,
  createTestimonial,
  createPublicTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials
} from '../controllers/testimonialController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/featured/public', getFeaturedTestimonials);
router.get('/validate/:token', validateToken);
router.post('/submit/:token', submitTestimonial);
router.post('/public', createPublicTestimonial); // Nueva ruta pública con token
router.get('/', optionalAuth, getTestimonials); // Debe estar después de las rutas específicas

// Rutas protegidas (admin dashboard)
router.use(protect); // Todas las rutas siguientes requieren autenticación

router.post('/', createTestimonial);
router.get('/:id', getTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
