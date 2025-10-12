import express from 'express';
import {
  login,
  getMe,
  logout,
  changePassword,
  createAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/create-admin', createAdmin); // Solo funciona si no hay admins

// Rutas protegidas
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

export default router;
