import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para migrar fotos de Clari desde frontend/assets a backend/uploads/profile
 * 
 * Uso:
 * node scripts/migrateClariPhotos.js
 */

const sourcePath = path.join(__dirname, '../../frontend/src/assets/FOTO CLARI');
const destPath = path.join(__dirname, '../uploads/profile');

// Crear directorio de destino si no existe
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

// Leer archivos del directorio de origen
const files = fs.readdirSync(sourcePath);
let copiedCount = 0;

console.log('🔄 Iniciando migración de fotos de Clari...\n');

files.forEach(file => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
    const sourceFile = path.join(sourcePath, file);
    const destFile = path.join(destPath, file);
    
    // Copiar archivo
    fs.copyFileSync(sourceFile, destFile);
    console.log(`✅ Copiado: ${file}`);
    copiedCount++;
  }
});

console.log(`\n✨ Migración completada: ${copiedCount} fotos copiadas`);
console.log(`📁 Ubicación: ${destPath}`);
console.log('\n💡 Las fotos ahora están disponibles en el servidor.');
console.log('   Puedes acceder a ellas desde: http://localhost:5001/uploads/profile/[nombre-archivo]');
