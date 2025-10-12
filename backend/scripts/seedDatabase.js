import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno desde la raíz del backend
dotenv.config();

// Importar modelos
import Retreat from '../models/Retreat.js';
import Setting from '../models/Setting.js';

const seedDatabase = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    console.log('🌱 POBLANDO BASE DE DATOS...\n');

    // 1. Crear Configuración del Sitio
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

    // 2. Crear Retiro Completo: AÑO NUEVO 2026
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

      whatsappNumber: '+5493512345678'
    });

    console.log('✅ Retiro creado exitosamente\n');

    // Resumen
    console.log('📊 RESUMEN DE DATOS CREADOS:\n');
    console.log('✅ Configuración del sitio');
    console.log(`✅ Retiro: "${retreat.title}"`);
    console.log(`   • Fechas: ${retreat.startDate.toLocaleDateString()} - ${retreat.endDate.toLocaleDateString()}`);
    console.log(`   • Precio: $${retreat.price.toLocaleString()} ${retreat.currency}`);
    console.log(`   • Capacidad: ${retreat.maxParticipants} personas`);
    console.log(`   • Estado: ${retreat.status}`);
    console.log(`   • Slug: ${retreat.slug}`);
    console.log(`   • ID: ${retreat._id}\n`);

    console.log('🎯 PRÓXIMOS PASOS:\n');
    console.log('1. Inicia el servidor: npm run dev');
    console.log('2. Abre el frontend: http://localhost:5173');
    console.log('3. Verifica que el retiro aparezca en el Hero');
    console.log('4. Prueba el formulario de contacto como lead');
    console.log('5. Ingresa al admin panel para gestionar el lead\n');

    console.log('📝 DATOS DE PRUEBA:\n');
    console.log('Retiro ID:', retreat._id.toString());
    console.log('Email de contacto:', setting.contactEmail);
    console.log('WhatsApp:', setting.whatsappNumber);
    console.log('\n✨ ¡Base de datos lista para pruebas!\n');

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

seedDatabase();
