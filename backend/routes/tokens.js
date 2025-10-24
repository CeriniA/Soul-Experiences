import express from 'express';
import {
  generateTokensForRetreat,
  getTokens,
  getToken,
  deleteToken,
  regenerateToken,
  validateToken
} from '../controllers/tokenController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Ruta pública para validar token
router.get('/validate/:token', validateToken);

// Todas las demás rutas requieren autenticación
router.use(protect);

router.get('/', getTokens);
router.post('/generate/:retreatId', generateTokensForRetreat);
router.get('/:id', getToken);
router.delete('/:id', deleteToken);
router.post('/:id/regenerate', regenerateToken);

export default router;
