import mongoose from 'mongoose';
import crypto from 'crypto';

const testimonialTokenSchema = new mongoose.Schema({
  // Token único
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  
  // Email del participante
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true
  },
  
  // Nombre del participante
  participantName: {
    type: String,
    required: [true, 'El nombre del participante es requerido'],
    trim: true
  },
  
  // Retiro al que hace referencia
  retreat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retreat',
    required: [true, 'El retiro es requerido']
  },
  
  // Estado del token
  isUsed: {
    type: Boolean,
    default: false
  },
  
  // Fecha de uso
  usedAt: Date,
  
  // Fecha de expiración (30 días por defecto)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    index: { expireAfterSeconds: 0 } // MongoDB eliminará automáticamente documentos expirados
  },
  
  // Testimonio creado (si aplica)
  testimonial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Testimonial'
  }
}, {
  timestamps: true
});

// Índices
testimonialTokenSchema.index({ token: 1 });
testimonialTokenSchema.index({ email: 1, retreat: 1 });
testimonialTokenSchema.index({ retreat: 1 });
testimonialTokenSchema.index({ isUsed: 1 });

// Middleware para marcar como usado
testimonialTokenSchema.pre('save', function(next) {
  if (this.isModified('isUsed') && this.isUsed && !this.usedAt) {
    this.usedAt = new Date();
  }
  next();
});

// Virtual para verificar si está expirado
testimonialTokenSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Virtual para verificar si es válido
testimonialTokenSchema.virtual('isValid').get(function() {
  return !this.isUsed && !this.isExpired;
});

// Método estático para generar tokens para un retiro
testimonialTokenSchema.statics.generateForRetreat = async function(retreatId, participants) {
  const tokens = [];
  
  for (const participant of participants) {
    try {
      const token = await this.create({
        email: participant.email,
        participantName: participant.name,
        retreat: retreatId
      });
      tokens.push(token);
    } catch (error) {
      // Si ya existe un token para este email/retiro, lo omitimos
      if (error.code !== 11000) {
        throw error;
      }
    }
  }
  
  return tokens;
};

// Método para validar y obtener token
testimonialTokenSchema.statics.validateToken = function(tokenString) {
  return this.findOne({
    token: tokenString,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).populate('retreat');
};

// Configurar virtuals en JSON
testimonialTokenSchema.set('toJSON', { virtuals: true });
testimonialTokenSchema.set('toObject', { virtuals: true });

const TestimonialToken = mongoose.model('TestimonialToken', testimonialTokenSchema);

export default TestimonialToken;
