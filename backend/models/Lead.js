import mongoose from 'mongoose';
import { 
  LEAD_STATUS_ARRAY, 
  PAYMENT_STATUS_ARRAY, 
  PAYMENT_METHOD_ARRAY, 
  INTEREST_TYPE_ARRAY, 
  LEAD_SOURCE_ARRAY,
  LEAD_STATUS,
  PAYMENT_STATUS
} from '../constants/enums.js';

const leadSchema = new mongoose.Schema({
  // Datos básicos
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  
  // Mensaje/consulta
  message: {
    type: String,
    maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
  },
  
  // Tipo de interés
  interest: {
    type: String,
    enum: INTEREST_TYPE_ARRAY,
    default: 'consulta'
  },
  
  // Estado del lead
  status: {
    type: String,
    enum: LEAD_STATUS_ARRAY,
    default: LEAD_STATUS.NUEVO
  },
  
  // Estado del pago
  paymentStatus: {
    type: String,
    enum: PAYMENT_STATUS_ARRAY,
    default: PAYMENT_STATUS.PENDIENTE
  },
  
  // Información de pago
  paymentAmount: {
    type: Number,
    default: 0,
    min: [0, 'El monto no puede ser negativo']
  },
  
  paymentMethod: {
    type: String,
    enum: PAYMENT_METHOD_ARRAY,
    default: ''
  },
  
  // Retiro de interés
  retreat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retreat',
    required: [true, 'El retiro es requerido']
  },
  
  // Notas internas
  notes: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  
  // Fuente del lead
  source: {
    type: String,
    enum: LEAD_SOURCE_ARRAY,
    default: 'landing'
  },
  
  // Fecha de contacto
  contactedAt: Date,
  
  // Fecha de confirmación
  confirmedAt: Date
}, {
  timestamps: true
});

// Índice para evitar duplicados de email por retiro
leadSchema.index({ email: 1, retreat: 1 }, { unique: true });

// Índices para mejorar rendimiento
leadSchema.index({ status: 1 });
leadSchema.index({ paymentStatus: 1 });
leadSchema.index({ retreat: 1 });
leadSchema.index({ createdAt: -1 });

// Virtual para verificar si está confirmado
leadSchema.virtual('isConfirmed').get(function() {
  return this.status === LEAD_STATUS.CONFIRMADO && this.paymentStatus === PAYMENT_STATUS.COMPLETO;
});

// Configurar virtuals en JSON
leadSchema.set('toJSON', { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
