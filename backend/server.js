import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Importar configuración
import { config, validateConfig } from './config/index.js';
import { connectDB } from './config/database.js';

// Importar rutas
import testRoutes from './routes/test.js';
import authRoutes from './routes/auth.js';
import retreatRoutes from './routes/retreats.js';
import leadRoutes from './routes/leads.js';
import testimonialRoutes from './routes/testimonials.js';
import settingRoutes from './routes/settings.js';
import tokenRoutes from './routes/tokens.js';

// Manejo de errores centralizado
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';
import logger from './utils/logger.js';

//Borrar esto - Prueba de email
import emailService from './services/emailService.js';

// Validar configuración al inicio
validateConfig();

const app = express();
const PORT = config.server.port;

// Necesario detrás de proxies (Render/Heroku) para que req.secure sea correcto y cookies Secure funcionen
app.set('trust proxy', 1);

// Configuración de CSP
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'"
    ],
    // Configuración de Trusted Types
    requireTrustedTypesFor: ["'script'"],
    trustedTypes: [
      'default',
      { 
        'policy-1': 'require-trusted-types-for "script";',
        'policy-2': 'trusted-types default'
      }
    ],
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
  crossOriginEmbedderPolicy: { policy: 'require-corp' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  // Configuración mejorada de frameguard
  frameguard: { 
    action: 'deny',
    domain: 'none'  // Previte que la página sea embebida en cualquier sitio
  },
  // Configuración adicional de seguridad para iframes
  contentSecurityPolicy: {
    ...cspConfig,
    frameAncestors: ["'none'"],  // Previte que la página sea embebida en iframes
  },
  hidePoweredBy: true,
  hsts: { maxAge: 15552000, includeSubDomains: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true,
}));
// Configurar CORS para cookies (parametrizado)
app.use(cors({
  origin: config.app.frontendOrigin,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(cookieParser()); // Parse cookies antes de las rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// La función connectDB ahora se importa de config/database.js

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

// Manejo de rutas no encontradas (404) a través del handler central
app.use((req, res, next) => {
  next(AppError.notFound(`La ruta ${req.originalUrl} no existe`));
});

// Manejo de errores global centralizado
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  
  // Verificar configuración de email después de conectar
  emailService.verifyConnection().then(isValid => {
    if (isValid) {
      logger.info('✅ Configuración de email correcta');
    } else {
      logger.info('❌ Error en configuración de email');
    }
  });
  
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    logger.info(`📍 URL: http://localhost:${PORT}`);
    logger.info(`🌍 Entorno: ${config.server.env}`);
  });
};

startServer();
