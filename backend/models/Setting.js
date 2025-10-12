import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  // Información del facilitador
  facilitatorName: {
    type: String,
    required: [true, 'El nombre del facilitador es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  facilitatorBio: {
    type: String,
    maxlength: [1000, 'La biografía no puede exceder 1000 caracteres']
  },
  facilitatorPhoto: {
    type: String // URL de la foto
  },
  
  // Información de contacto
  contactEmail: {
    type: String,
    required: [true, 'El email de contacto es requerido'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  whatsappNumber: {
    type: String,
    required: [true, 'El número de WhatsApp es requerido'],
    trim: true
  },
  
  // Redes sociales
  socialMedia: {
    instagram: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  
  // Configuración del sitio
  siteTitle: {
    type: String,
    default: 'Retiros Espirituales',
    maxlength: [100, 'El título del sitio no puede exceder 100 caracteres']
  },
  siteDescription: {
    type: String,
    default: 'Transformación y crecimiento personal a través de retiros espirituales',
    maxlength: [200, 'La descripción del sitio no puede exceder 200 caracteres']
  },
  siteLogo: {
    type: String // URL del logo
  },
  
  // Configuración de emails
  emailSettings: {
    fromName: {
      type: String,
      default: 'Retiros Espirituales'
    },
    fromEmail: {
      type: String
    },
    replyTo: {
      type: String
    }
  },
  
  // Textos personalizables
  customTexts: {
    heroTitle: {
      type: String,
      default: 'Transforma tu vida en nuestro retiro espiritual'
    },
    heroSubtitle: {
      type: String,
      default: 'Una experiencia única de crecimiento personal y conexión espiritual'
    },
    ctaButton: {
      type: String,
      default: 'Quiero Reservar Mi Plaza'
    },
    thankYouMessage: {
      type: String,
      default: 'Gracias por tu interés. Te contactaremos pronto para confirmar tu reserva.'
    }
  },
  
  // Configuración de colores (opcional)
  theme: {
    primaryColor: {
      type: String,
      default: '#2E8B57' // Verde espiritual
    },
    secondaryColor: {
      type: String,
      default: '#F4A460' // Dorado cálido
    },
    accentColor: {
      type: String,
      default: '#8A2BE2' // Púrpura místico
    }
  },
  
  // Configuración activa (solo debe haber una)
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Solo puede haber una configuración activa
settingSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

// Método estático para obtener la configuración activa
settingSchema.statics.getActive = function() {
  return this.findOne({ isActive: true });
};

// Método estático para crear configuración por defecto
settingSchema.statics.createDefault = function(facilitatorData = {}) {
  return this.create({
    facilitatorName: facilitatorData.name || 'Facilitador',
    contactEmail: facilitatorData.email || 'contacto@retiros.com',
    whatsappNumber: facilitatorData.whatsapp || '+54911234567',
    isActive: true
  });
};

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
