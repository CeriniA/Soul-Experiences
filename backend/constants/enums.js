/**
 * Constantes y enums centralizados para toda la aplicación
 * Mantener estos valores sincronizados entre frontend y backend
 */

// Estados del Lead
export const LEAD_STATUS = {
  NUEVO: 'nuevo',
  CONTACTADO: 'contactado',
  INTERESADO: 'interesado',
  CONFIRMADO: 'confirmado',
  DESCARTADO: 'descartado'
};

export const LEAD_STATUS_ARRAY = Object.values(LEAD_STATUS);

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.NUEVO]: 'Nuevo',
  [LEAD_STATUS.CONTACTADO]: 'Contactado',
  [LEAD_STATUS.INTERESADO]: 'Interesado',
  [LEAD_STATUS.CONFIRMADO]: 'Confirmado',
  [LEAD_STATUS.DESCARTADO]: 'Descartado'
};

// Estados de Pago
export const PAYMENT_STATUS = {
  PENDIENTE: 'pendiente',
  SEÑA: 'seña',
  COMPLETO: 'completo'
};

export const PAYMENT_STATUS_ARRAY = Object.values(PAYMENT_STATUS);

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDIENTE]: 'Pendiente',
  [PAYMENT_STATUS.SEÑA]: 'Seña',
  [PAYMENT_STATUS.COMPLETO]: 'Completo'
};

// Métodos de Pago
export const PAYMENT_METHOD = {
  TRANSFERENCIA: 'transferencia',
  MERCADOPAGO: 'mercadopago',
  EFECTIVO: 'efectivo'
};

export const PAYMENT_METHOD_ARRAY = ['', ...Object.values(PAYMENT_METHOD)];

export const PAYMENT_METHOD_LABELS = {
  '': 'Seleccionar...',
  [PAYMENT_METHOD.TRANSFERENCIA]: 'Transferencia',
  [PAYMENT_METHOD.MERCADOPAGO]: 'MercadoPago',
  [PAYMENT_METHOD.EFECTIVO]: 'Efectivo'
};

// Tipos de Interés
export const INTEREST_TYPE = {
  RESERVAR: 'reservar',
  INFO: 'info',
  CONSULTA: 'consulta'
};

export const INTEREST_TYPE_ARRAY = Object.values(INTEREST_TYPE);

export const INTEREST_TYPE_LABELS = {
  [INTEREST_TYPE.RESERVAR]: 'Reservar',
  [INTEREST_TYPE.INFO]: 'Información',
  [INTEREST_TYPE.CONSULTA]: 'Consulta'
};

// Fuentes de Lead
export const LEAD_SOURCE = {
  LANDING: 'landing',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  REFERIDO: 'referido',
  OTRO: 'otro'
};

export const LEAD_SOURCE_ARRAY = Object.values(LEAD_SOURCE);

export const LEAD_SOURCE_LABELS = {
  [LEAD_SOURCE.LANDING]: 'Landing Page',
  [LEAD_SOURCE.INSTAGRAM]: 'Instagram',
  [LEAD_SOURCE.FACEBOOK]: 'Facebook',
  [LEAD_SOURCE.REFERIDO]: 'Referido',
  [LEAD_SOURCE.OTRO]: 'Otro'
};

// Estados de Retiro
export const RETREAT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const RETREAT_STATUS_ARRAY = Object.values(RETREAT_STATUS);

export const RETREAT_STATUS_LABELS = {
  [RETREAT_STATUS.DRAFT]: 'Borrador',
  [RETREAT_STATUS.ACTIVE]: 'Activo',
  [RETREAT_STATUS.COMPLETED]: 'Completado',
  [RETREAT_STATUS.CANCELLED]: 'Cancelado'
};

// Monedas
export const CURRENCY = {
  ARS: 'ARS',
  USD: 'USD',
  EUR: 'EUR'
};

export const CURRENCY_ARRAY = Object.values(CURRENCY);

export const CURRENCY_LABELS = {
  [CURRENCY.ARS]: 'Pesos Argentinos (ARS)',
  [CURRENCY.USD]: 'Dólares (USD)',
  [CURRENCY.EUR]: 'Euros (EUR)'
};

/**
 * Verifica si un lead está completamente confirmado
 * Un lead confirmado debe tener estado 'confirmado' Y pago 'completo'
 */
export const isLeadFullyConfirmed = (status, paymentStatus) => {
  return status === LEAD_STATUS.CONFIRMADO && paymentStatus === PAYMENT_STATUS.COMPLETO;
};

/**
 * Verifica si un lead cuenta como participante confirmado
 * (para calcular disponibilidad de retiros)
 */
export const countsAsConfirmedParticipant = (status, paymentStatus) => {
  return isLeadFullyConfirmed(status, paymentStatus);
};
