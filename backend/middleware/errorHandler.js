import AppError from '../utils/AppError.js';

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function buildResponse(err, req) {
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const code = err.code || AppError.mapStatusToCode?.(status) || 'internal_error';

  // Expose message if error indicates it, or if not production
  const exposeMessage = err.expose !== undefined ? err.expose : status < 500;
  const message = exposeMessage || !isProd() ? (err.message || 'Error') : 'Algo salió mal';

  const body = {
    success: false,
    error: status >= 500 ? 'Error interno del servidor' : 'Error en la solicitud',
    message,
    code,
    path: req?.originalUrl,
    method: req?.method,
    timestamp: new Date().toISOString(),
  };

  if (err.details) body.details = err.details;

  return { status, body };
}

// Specific mappers for common libraries
function mapMongooseError(err) {
  // CastError: invalid ObjectId
  if (err?.name === 'CastError') {
    return AppError.badRequest('Identificador inválido', { path: err.path, value: err.value });
  }

  // ValidationError: schema validation errors
  if (err?.name === 'ValidationError' && err?.errors) {
    const fieldErrors = Object.values(err.errors).map(e => ({
      path: e.path || e.properties?.path,
      message: e.message,
      kind: e.kind,
      value: e.value,
    }));
    return AppError.validationError('Error de validación', { errors: fieldErrors });
  }

  // Mongo duplicate key (E11000)
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return AppError.conflict('Registro duplicado', { fields, keyValue: err.keyValue });
  }

  return null;
}

function mapJwtError(err) {
  if (err?.name === 'TokenExpiredError') {
    return new AppError('Token expirado', 401, { code: 'token_expired' });
  }
  if (err?.name === 'JsonWebTokenError') {
    return new AppError('Token inválido', 401, { code: 'invalid_token' });
  }
  return null;
}

// Central error middleware
export default function errorHandler(err, req, res, next) {
  try {
    // Log server-side
    if (!isProd()) {
      console.error('Error handler:', err); // dev verbose
    } else if (!err.isOperational) {
      console.error('Unexpected error:', err); // production: log unexpected
    }

    let mapped = null;

    // If already an AppError, use it
    if (err instanceof AppError) {
      mapped = err;
    }

    // Try to map known external errors
    if (!mapped) mapped = mapMongooseError(err);
    if (!mapped) mapped = mapJwtError(err);

    // Fallback: wrap unknown error
    if (!mapped) {
      const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
      mapped = new AppError(err.message || 'Error interno del servidor', status, {
        code: status >= 500 ? 'internal_error' : AppError.mapStatusToCode(status),
        isOperational: status < 500,
        expose: status < 500,
      });
    }

    const { status, body } = buildResponse(mapped, req);

    // Attach a minimal error id if desired (future improvement)
    res.status(status).json(body);
  } catch (handlerError) {
    // If something goes wrong inside the handler, ensure we respond 500
    console.error('Error in errorHandler:', handlerError);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: isProd() ? 'Algo salió mal' : handlerError.message,
      code: 'internal_error',
      timestamp: new Date().toISOString(),
    });
  }
}
