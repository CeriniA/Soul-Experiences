import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/test - Ruta de prueba
router.get('/', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
    
    res.json({
      message: '¡Hola desde el backend! 🎉',
      status: 'OK',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      tech: ['Node.js', 'Express', 'MongoDB']
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
});

// POST /api/test - Ruta de prueba POST
router.post('/', (req, res) => {
  const { name, message } = req.body;
  
  res.json({
    message: `¡Hola ${name || 'Usuario'}!`,
    receivedMessage: message || 'Sin mensaje',
    timestamp: new Date().toISOString()
  });
});

export default router;
