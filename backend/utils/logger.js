/**
 * Logger condicional para evitar logs de debug en producción
 * - debug: Solo en desarrollo
 * - info: Siempre
 * - warn: Siempre
 * - error: Siempre
 */
const logger = {
  debug: (...args) => {
    // Solo mostrar logs de debug en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args)
};

export default logger;
