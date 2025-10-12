import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno desde la raíz del backend
dotenv.config();

// Importar modelos
import User from '../models/User.js';
import Retreat from '../models/Retreat.js';
import Lead from '../models/Lead.js';
import Testimonial from '../models/Testimonial.js';
import TestimonialToken from '../models/TestimonialToken.js';
import Setting from '../models/Setting.js';

const cleanDatabase = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    console.log('🗑️  LIMPIANDO BASE DE DATOS...\n');

    // Eliminar todas las colecciones (excepto users)
    const collections = [
      { model: Retreat, name: 'Retiros' },
      { model: Lead, name: 'Leads' },
      { model: Testimonial, name: 'Testimonios' },
      { model: TestimonialToken, name: 'Tokens de Testimonio' },
      { model: Setting, name: 'Configuración' }
    ];

    for (const { model, name } of collections) {
      const count = await model.countDocuments();
      if (count > 0) {
        await model.deleteMany({});
        console.log(`✅ ${name}: ${count} documento(s) eliminado(s)`);
      } else {
        console.log(`ℹ️  ${name}: Ya estaba vacío`);
      }
    }

    // Verificar usuario admin
    const userCount = await User.countDocuments();
    console.log(`\nℹ️  Usuarios: ${userCount} (no se eliminan)`);

    console.log('\n✅ BASE DE DATOS LIMPIADA EXITOSAMENTE\n');
    console.log('📊 Estado actual:');
    console.log('   • Retiros: 0');
    console.log('   • Leads: 0');
    console.log('   • Testimonios: 0');
    console.log('   • Tokens: 0');
    console.log('   • Configuración: 0');
    console.log(`   • Usuarios: ${userCount} (preservados)\n`);

  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

cleanDatabase();
