import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  // Datos del participante
  participantName: {
    type: String,
    required: [true, 'El nombre del participante es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  participantEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  participantPhoto: {
    type: String, // URL de la foto (opcional)
  },
  
  // Retiro al que hace referencia
  retreat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retreat',
    required: [true, 'El retiro es requerido']
  },
  
  // Calificación
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  
  // Comentario
  comment: {
    type: String,
    required: [true, 'El comentario es requerido'],
    maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  
  // Estado de aprobación
  isApproved: {
    type: Boolean,
    default: false
  },
  
  // Destacado en landing
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Token usado para crear el testimonio (si aplica)
  token: {
    type: String,
    sparse: true // permite múltiples documentos con token null
  },
  
  // Fecha de aprobación
  approvedAt: Date,
  
  // Notas internas
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
testimonialSchema.index({ retreat: 1 });
testimonialSchema.index({ isApproved: 1, isFeatured: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ token: 1 }, { sparse: true });

// Middleware para actualizar fecha de aprobación
testimonialSchema.pre('save', function(next) {
  if (this.isModified('isApproved') && this.isApproved && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  next();
});

// Virtual para mostrar estrellas
testimonialSchema.virtual('stars').get(function() {
  return '⭐'.repeat(this.rating);
});

// Configurar virtuals en JSON
testimonialSchema.set('toJSON', { virtuals: true });
testimonialSchema.set('toObject', { virtuals: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
