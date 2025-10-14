import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Importar configuración
import { DATABASE_CONFIG, validateConfig } from './config/database.js';

// Importar rutas
import testRoutes from './routes/test.js';
import authRoutes from './routes/auth.js';
import retreatRoutes from './routes/retreats.js';
import leadRoutes from './routes/leads.js';
import testimonialRoutes from './routes/testimonials.js';
import settingRoutes from './routes/settings.js';
import tokenRoutes from './routes/tokens.js';

//Borrar esto - Prueba de email
import emailService from './services/emailService.js';

// Validar configuración al inicio
validateConfig();

const app = express();
const PORT = DATABASE_CONFIG.PORT;

// Configuración de CSP
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https: http:"],
    connectSrc: ["'self'", "https://*.tiles.mapbox.com", "https://api.mapbox.com"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

// Middlewares
app.use(helmet({
  contentSecurityPolicy: cspConfig,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true,
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DATABASE_CONFIG.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Rutas
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/retreats', retreatRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/tokens', tokenRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint temporal para probar envío de email
app.get('/api/test-email', async (req, res) => {
  try {
    await emailService.sendTestimonialToken({
      email: 'adriancerini@gmail.com', // Tu email para probar
      participantName: 'Adrian (Prueba)',
      retreatTitle: 'Retiro de Prueba',
      token: 'test-token-123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    res.json({ success: true, message: 'Email de prueba enviado. Revisa tu bandeja de entrada.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  
  // Verificar configuración de email después de conectar
  emailService.verifyConnection().then(isValid => {
    if (isValid) {
      console.log('✅ Configuración de email correcta');
    } else {
      console.log('❌ Error en configuración de email');
    }
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${DATABASE_CONFIG.NODE_ENV}`);
  });
};

startServer();
