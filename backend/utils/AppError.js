class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = 'AppError';

    // HTTP status code
    this.statusCode = Number.isInteger(statusCode) ? statusCode : 500;

    // Stable error code for clients (e.g. 'validation_error', 'unauthorized')
    this.code = options.code || AppError.mapStatusToCode(this.statusCode);

    // Arbitrary extra info (e.g. field errors)
    this.details = options.details;

    // Whether this error is expected/operational
    this.isOperational = options.isOperational !== undefined ? options.isOperational : true;

    // Whether to expose raw message in production responses
    this.expose = options.expose !== undefined ? options.expose : this.statusCode < 500;

    // Capture stack without including this constructor in it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static mapStatusToCode(status) {
    switch (status) {
      case 400: return 'bad_request';
      case 401: return 'unauthorized';
      case 403: return 'forbidden';
      case 404: return 'not_found';
      case 409: return 'conflict';
      case 422: return 'unprocessable_entity';
      default:
        if (status >= 500) return 'internal_error';
        return 'error';
    }
  }

  // Factory helpers
  static badRequest(message = 'Solicitud inválida', details) {
    return new AppError(message, 400, { code: 'bad_request', details });
  }

  static unauthorized(message = 'No autorizado', details) {
    return new AppError(message, 401, { code: 'unauthorized', details });
  }

  static forbidden(message = 'Prohibido', details) {
    return new AppError(message, 403, { code: 'forbidden', details });
  }

  static notFound(message = 'Recurso no encontrado', details) {
    return new AppError(message, 404, { code: 'not_found', details });
  }

  static conflict(message = 'Conflicto', details) {
    return new AppError(message, 409, { code: 'conflict', details });
  }

  static validationError(message = 'Error de validación', details) {
    return new AppError(message, 400, { code: 'validation_error', details });
  }

  static unprocessable(message = 'Entidad no procesable', details) {
    return new AppError(message, 422, { code: 'unprocessable_entity', details });
  }

  static internal(message = 'Error interno del servidor', details) {
    return new AppError(message, 500, { code: 'internal_error', details, expose: false, isOperational: false });
  }
}

export default AppError;
