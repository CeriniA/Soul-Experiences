import express from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para landing page)
router.post('/', createLead);

// Rutas protegidas (admin dashboard)
router.use(protect); // Todas las rutas siguientes requieren autenticación

router.get('/', getLeads);
router.get('/stats/overview', getLeadStats);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
