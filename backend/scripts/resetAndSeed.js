import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Retreat from '../models/Retreat.js';
import Lead from '../models/Lead.js';
import Testimonial from '../models/Testimonial.js';
import TestimonialToken from '../models/TestimonialToken.js';
import Setting from '../models/Setting.js';

// Cargar variables de entorno
dotenv.config();

// Usar la variable correcta del .env
const MONGO_URI = process.env.MONGODB_URI;

const resetAndSeed = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    console.log('URI:', MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@')); // Ocultar credenciales
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // PASO 1: LIMPIAR
    console.log('🗑️  LIMPIANDO BASE DE DATOS...\n');

    const deleteResults = await Promise.all([
      Retreat.deleteMany({}),
      Lead.deleteMany({}),
      Testimonial.deleteMany({}),
      TestimonialToken.deleteMany({}),
      Setting.deleteMany({})
    ]);

    console.log('✅ Retiros eliminados:', deleteResults[0].deletedCount);
    console.log('✅ Leads eliminados:', deleteResults[1].deletedCount);
    console.log('✅ Testimonios eliminados:', deleteResults[2].deletedCount);
    console.log('✅ Tokens eliminados:', deleteResults[3].deletedCount);
    console.log('✅ Configuración eliminada:', deleteResults[4].deletedCount);
    console.log('');

    // PASO 2: CREAR CONFIGURACIÓN
    console.log('📝 Creando configuración del sitio...');
    const setting = await Setting.create({
      facilitatorName: 'Clarisa Soul',
      facilitatorBio: 'Facilitadora de retiros de transformación personal y autoconocimiento. Con más de 10 años de experiencia guiando procesos de sanación emocional y crecimiento espiritual.',
      facilitatorPhoto: 'https://res.cloudinary.com/damnyicqx/image/upload/v1234567890/clarisa-profile.jpg',
      contactEmail: 'holasoul.experiences@gmail.com',
      whatsappNumber: '+5493512345678',
      socialMedia: {
        instagram: 'https://instagram.com/soul.experiences',
        facebook: 'https://facebook.com/soulexperiences',
        youtube: '',
        website: ''
      },
      siteTitle: 'Soul Experiences - Retiros de Transformación',
      siteDescription: 'Retiros espirituales en la naturaleza para tu transformación personal',
      siteLogo: '',
      emailSettings: {
        fromName: 'Soul Experiences',
        fromEmail: 'holasoul.experiences@gmail.com',
        replyTo: 'holasoul.experiences@gmail.com'
      },
      customTexts: {
        heroTitle: 'Transforma tu vida en la naturaleza',
        heroSubtitle: 'Una experiencia única de autoconocimiento y sanación',
        ctaButton: 'Quiero Reservar Mi Plaza',
        thankYouMessage: 'Gracias por tu interés. Te contactaremos pronto.'
      },
      theme: {
        primaryColor: '#ebbe6f',
        secondaryColor: '#75a6a8',
        accentColor: '#81536F'
      },
      isActive: true
    });
    console.log('✅ Configuración creada\n');

    // PASO 3: CREAR RETIRO
    console.log('🎉 Creando retiro "AÑO NUEVO 2026"...');
    const retreat = await Retreat.create({
      title: 'Retiro de Año Nuevo 2026 - Celebración Consciente',
      description: `Durante 5 días y 4 noches, en plena naturaleza, compartiremos prácticas y rituales ancestrales que nos guiarán en el cierre de un ciclo y en la siembra fértil de lo que comienza.

Este retiro es una invitación a conectar con tu esencia, soltar lo que ya no sirve y dar la bienvenida al nuevo año desde un lugar de consciencia, gratitud y renovación.

Viviremos una experiencia transformadora en la montaña, rodeados de naturaleza, con ceremonias sagradas, meditaciones profundas, yoga, círculos de palabra, música en vivo, danzas y mucho amor.`,

      shortDescription: 'Cierra el año y da la bienvenida al 2026 desde la consciencia, en plena naturaleza de Traslasierra.',

      startDate: new Date('2025-12-29T14:00:00'),
      endDate: new Date('2026-01-02T14:00:00'),

      location: {
        name: 'Ecoposada Madreverde',
        address: 'Camino a Los Molles, Traslasierra',
        city: 'Los Molles',
        state: 'Córdoba',
        country: 'Argentina',
        description: 'Un espacio sagrado en las sierras de Córdoba, rodeado de naturaleza virgen. La ecoposada cuenta con domos y cabañas ecológicas, piscina natural, altares ceremoniales y 2 hectáreas de bosque para conectar con la tierra.',
        features: [
          'Domos y cabañas compartidas',
          'Piscina natural',
          'Altares ceremoniales',
          'Fogón comunitario',
          'Sala de yoga',
          'Cocina orgánica',
          '2 hectáreas de bosque'
        ],
        accommodationType: 'Cabañas compartidas (4-6 personas por cabaña)',
        howToGetThere: {
          byBus: 'Desde Córdoba Capital: Tomar bus a Villa Dolores (3hs aprox). Desde Villa Dolores: Transfer privado a Los Molles (30 min). Coordinaremos transfers grupales.',
          byCar: 'Desde Córdoba Capital: Ruta Provincial 20 hasta Villa Dolores, luego RP 14 hacia Los Molles. 3.5 horas aproximadamente. Hay estacionamiento disponible.',
          additionalInfo: 'Coordinaremos grupos de WhatsApp para organizar viajes compartidos desde diferentes ciudades.'
        }
      },

      price: 1111111,
      currency: 'ARS',
      pricingTiers: [
        {
          name: 'Descuento Anticipado (hasta 30/11)',
          price: 888888,
          validUntil: new Date('2025-11-30T23:59:59'),
          paymentOptions: ['Un solo pago', '3 cuotas de $296.296']
        },
        {
          name: 'Precio Intermedio (hasta 15/12)',
          price: 999999,
          validUntil: new Date('2025-12-15T23:59:59'),
          paymentOptions: ['Un solo pago', '2 cuotas de $499.999']
        },
        {
          name: 'Precio Final',
          price: 1111111,
          validUntil: new Date('2025-12-29T00:00:00'),
          paymentOptions: ['Un solo pago']
        }
      ],

      maxParticipants: 24,

      targetAudience: [
        'Personas que buscan cerrar ciclos y comenzar el año desde la consciencia',
        'Quienes desean conectar con su esencia en un espacio sagrado',
        'Buscadores espirituales que quieren vivir una celebración diferente',
        'Personas abiertas a experiencias transformadoras en comunidad',
        'Quienes necesitan un reset profundo antes de comenzar un nuevo ciclo'
      ],

      experiences: [
        'Caminatas conscientes en la montaña',
        'Yoga y elongación diaria',
        'Círculos de palabra y reflexión',
        'Cena consciente de fin de año',
        'Meditaciones guiadas',
        'Baños de sonido con cuencos tibetanos',
        'Fogón bajo las estrellas',
        'Kirtan devocional (cantos sagrados)',
        'Ceremonia de cacao',
        'Espacios de descanso y pileta',
        'Temazcal de renacimiento',
        'Celebración y danzas de año nuevo',
        'Rituales de cierre y apertura de ciclo'
      ],

      includes: [
        '4 noches de alojamiento en cabañas compartidas',
        'Todas las comidas (desayuno, almuerzo, merienda, cena)',
        'Todas las actividades y ceremonias',
        'Materiales para rituales',
        'Facilitadores y músicos',
        'Seguro de accidentes personales',
        'Kit de bienvenida'
      ],

      notIncludes: [
        'Traslados hasta el lugar',
        'Bebidas alcohólicas',
        'Gastos personales extras',
        'Propinas (opcionales)'
      ],

      foodInfo: {
        foodType: 'Crudivegana y Orgánica',
        description: 'Alimentación 100% vegetal, orgánica y consciente. Preparada con amor por cocineras especializadas en nutrición holística. Incluye jugos verdes, ensaladas creativas, bowls nutritivos y postres saludables.',
        restrictions: [
          'Sin carnes',
          'Sin lácteos',
          'Sin gluten',
          'Sin azúcar refinada',
          'Sin alimentos procesados'
        ]
      },

      policies: {
        substanceFree: true,
        restrictions: [
          'Espacio libre de alcohol, tabaco y drogas',
          'No se permiten mascotas',
          'Respetar los horarios de silencio (23hs a 7hs)',
          'Cuidar el espacio y la naturaleza'
        ],
        cancellationPolicy: 'Cancelación hasta 30 días antes: devolución del 80%. Cancelación entre 30-15 días: devolución del 50%. Menos de 15 días: sin devolución. Se puede transferir la plaza a otra persona.',
        additionalPolicies: [
          'Se requiere seña del 30% para reservar la plaza',
          'El saldo restante debe abonarse antes del 20/12/2025',
          'Cupos limitados: 24 personas'
        ]
      },

      images: [
        'https://res.cloudinary.com/damnyicqx/image/upload/v1234567890/retiro-anio-nuevo-hero.jpg',
        'https://res.cloudinary.com/damnyicqx/image/upload/v1234567890/retiro-anio-nuevo-yoga.jpg',
        'https://res.cloudinary.com/damnyicqx/image/upload/v1234567890/retiro-anio-nuevo-ceremonia.jpg',
        'https://res.cloudinary.com/damnyicqx/image/upload/v1234567890/retiro-anio-nuevo-lugar.jpg'
      ],

      heroImageIndex: 0,
      highlightWords: ['AÑO NUEVO', '2026', 'CELEBRACIÓN CONSCIENTE'],
      status: 'active',
      showInHero: true,
      whatsappNumber: '+5493512345678',
      inquiryCount: 0
    });

    console.log('✅ Retiro creado exitosamente\n');

    // RESUMEN
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 RESUMEN DE DATOS CREADOS');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('✅ Configuración del sitio');
    console.log(`✅ Retiro: "${retreat.title}"`);
    console.log(`   • Fechas: ${retreat.startDate.toLocaleDateString('es-AR')} - ${retreat.endDate.toLocaleDateString('es-AR')}`);
    console.log(`   • Precio: $${retreat.price.toLocaleString('es-AR')} ${retreat.currency}`);
    console.log(`   • Capacidad: ${retreat.maxParticipants} personas`);
    console.log(`   • Estado: ${retreat.status}`);
    console.log(`   • Slug: ${retreat.slug}`);
    console.log(`   • ID: ${retreat._id}\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 PRÓXIMOS PASOS');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('1. Inicia el servidor backend:');
    console.log('   cd backend && npm run dev\n');
    console.log('2. Inicia el frontend:');
    console.log('   cd frontend && npm run dev\n');
    console.log('3. Abre el navegador:');
    console.log('   http://localhost:5173\n');
    console.log('4. Verifica que el retiro aparezca en el Hero\n');
    console.log('5. Prueba el formulario de contacto como lead\n');
    console.log('6. Ingresa al admin panel para gestionar el lead\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('📝 DATOS DE PRUEBA');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('Retiro ID:', retreat._id.toString());
    console.log('Email:', setting.contactEmail);
    console.log('WhatsApp:', setting.whatsappNumber);
    console.log('\n✨ ¡Base de datos lista para pruebas!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

resetAndSeed();
