import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que las carpetas de uploads existan
const uploadsDir = path.join(__dirname, '../uploads');
const profileDir = path.join(uploadsDir, 'profile');
const placeholderDir = path.join(uploadsDir, 'placeholders');

[uploadsDir, profileDir, placeholderDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento para fotos de perfil de Clari
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'clari-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración de almacenamiento para imágenes placeholder de retiros
const placeholderStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, placeholderDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'placeholder-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
  }
};

// Límite de tamaño de archivo: 5MB
const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

// Middleware para fotos de perfil
export const uploadProfilePhoto = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: limits
}).single('photo');

// Middleware para múltiples fotos de perfil
export const uploadMultipleProfilePhotos = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: limits
}).array('photos', 10); // Máximo 10 fotos

// Middleware para imágenes placeholder
export const uploadPlaceholder = multer({
  storage: placeholderStorage,
  fileFilter: fileFilter,
  limits: limits
}).single('image');

// Middleware para múltiples placeholders
export const uploadMultiplePlaceholders = multer({
  storage: placeholderStorage,
  fileFilter: fileFilter,
  limits: limits
}).array('images', 20); // Máximo 20 imágenes

export default {
  uploadProfilePhoto,
  uploadMultipleProfilePhotos,
  uploadPlaceholder,
  uploadMultiplePlaceholders
};
