import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  lastLogin: {
    type: Date
  },
  passwordChangedAt: Date
}, {
  timestamps: true
});

// Middleware para hashear password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) return next();
  
  // Hashear password con salt de 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para generar JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
};

// Método estático para crear el usuario administrador
userSchema.statics.createDefaultAdmin = async function(adminData = {}) {
  const existingAdmin = await this.findOne();
  
  if (!existingAdmin) {
    return await this.create({
      name: adminData.name || 'Admin',
      email: adminData.email || 'admin@retiros.com',
      password: adminData.password || 'admin123'
    });
  }
  
  return existingAdmin;
};

// Índices para mejorar rendimiento
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;
