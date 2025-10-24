import mongoose from 'mongoose';
import { RETREAT_STATUS_ARRAY, CURRENCY_ARRAY } from '../constants/enums.js';

const retreatSchema = new mongoose.Schema({
  // Información básica
  title: {
    type: String,
    required: [true, 'El título del retiro es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'La descripción corta no puede exceder 300 caracteres']
  },
  
  // Para quién es este retiro
  targetAudience: [String], // Array de puntos sobre el perfil ideal
  
  // Experiencias y actividades
  experiences: [String], // Array de actividades/experiencias del retiro
  
  // Fechas
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es requerida'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio'
    }
  },
  
  // Ubicación
  location: {
    name: {
      type: String,
      required: [true, 'El nombre del lugar es requerido']
    },
    address: {
      type: String,
      required: [true, 'La dirección es requerida']
    },
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Argentina'
    },
    description: String, // Descripción detallada del lugar
    features: [String], // Características del lugar (ej: "2 hectáreas", "domos", "piscina")
    accommodationType: String, // Tipo de alojamiento (ej: "cabañas compartidas")
    howToGetThere: {
      byBus: String,
      byCar: String,
      additionalInfo: String
    }
  },
  
  // Precio
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  currency: {
    type: String,
    default: 'ARS',
    enum: CURRENCY_ARRAY
  },
  
  // Precios escalonados (para descuentos por fecha)
  pricingTiers: [{
    name: String, // ej: "Descuento anticipado"
    price: Number,
    validUntil: Date,
    paymentOptions: [String] // ej: ["Un pago", "3 cuotas de $X"]
  }],
  
  // Capacidad
  maxParticipants: {
    type: Number,
    required: [true, 'El número máximo de participantes es requerido'],
    min: [1, 'Debe haber al menos 1 participante'],
    max: [100, 'No puede haber más de 100 participantes']
  },
  
  // Qué incluye y no incluye
  includes: [String], // ej: ["Alojamiento", "Comidas", "Materiales"]
  notIncludes: [String], // ej: ["Traslados", "Extras"]
  
  // Alimentación
  foodInfo: {
    foodType: String, // ej: "Crudivegana, 100% orgánica"
    description: String, // Descripción detallada de la alimentación
    restrictions: [String] // ej: ["Sin gluten", "Sin lácteos"]
  },
  
  // Políticas y restricciones
  policies: {
    substanceFree: {
      type: Boolean,
      default: false
    },
    restrictions: [String], // ej: ["Sin tabaco", "Sin alcohol"]
    cancellationPolicy: String,
    additionalPolicies: [String]
  },
  
  // Imágenes
  images: [String], // URLs de las imágenes
  
  // Índice de la imagen para mostrar en el Hero (0-based)
  heroImageIndex: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        // Solo validar si hay imágenes
        if (this.images && this.images.length > 0) {
          return value < this.images.length;
        }
        return true;
      },
      message: 'El índice de imagen del hero debe ser menor que el número total de imágenes'
    }
  },
  
  // Palabras a resaltar en el título (para el hero)
  highlightWords: {
    type: [String], // Array de palabras/frases a resaltar
    default: []
  },
  
  // Estado
  status: {
    type: String,
    enum: RETREAT_STATUS_ARRAY,
    default: 'draft'
  },
  
  // Mostrar en hero de la página principal
  showInHero: {
    type: Boolean,
    default: false
  },
  
  // WhatsApp para contacto
  whatsappNumber: {
    type: String,
    trim: true
  },
  
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Middleware para generar slug automáticamente
retreatSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual para calcular duración en días
retreatSchema.virtual('durationDays').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual para verificar si está lleno
retreatSchema.virtual('isFull').get(function() {
  return (this.currentParticipants || 0) >= this.maxParticipants;
});

// Virtual para calcular espacios disponibles
retreatSchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.maxParticipants - (this.currentParticipants || 0));
});

// Virtual para obtener el tier de precio activo (por fecha)
retreatSchema.virtual('activePricingTier').get(function() {
  const tiers = Array.isArray(this.pricingTiers) ? this.pricingTiers : [];
  if (!tiers.length) return null;
  const now = new Date();
  const valid = tiers
    .filter(t => t && t.validUntil && typeof t.price === 'number' && new Date(t.validUntil) >= now)
    .sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));
  return valid[0] || null;
});

// Virtual para obtener el precio efectivo (tier activo o precio base)
retreatSchema.virtual('effectivePrice').get(function() {
  const tier = this.activePricingTier;
  if (tier && typeof tier.price === 'number') return tier.price;
  return this.price;
});

// Virtual para calcular el estado real del retiro basado en fechas
retreatSchema.virtual('computedStatus').get(function() {
  const now = new Date();
  
  // Respetar status manual para draft y cancelled
  if (this.status === 'draft' || this.status === 'cancelled') {
    return this.status;
  }
  
  // Calcular automáticamente basado en fechas
  if (!this.startDate || !this.endDate) {
    return this.status; // Fallback al status manual si no hay fechas
  }
  
  if (this.endDate < now) {
    return 'completed'; // Retiro terminó
  } else if (this.startDate <= now && now <= this.endDate) {
    return 'in_progress'; // Retiro en curso
  } else if (this.startDate > now) {
    return 'upcoming'; // Retiro próximo
  }
  
  return this.status; // Fallback
});

// Método helper para verificar si está disponible para reservar
retreatSchema.methods.isAvailableForBooking = function() {
  return this.computedStatus === 'upcoming' && this.availableSpots > 0;
};

// Índices para mejorar rendimiento
retreatSchema.index({ status: 1, startDate: 1 });
retreatSchema.index({ slug: 1 });
retreatSchema.index({ createdAt: -1 });

// Configurar virtuals en JSON
retreatSchema.set('toJSON', { virtuals: true });
retreatSchema.set('toObject', { virtuals: true });

const Retreat = mongoose.model('Retreat', retreatSchema);

export default Retreat;
