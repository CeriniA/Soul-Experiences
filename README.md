# Soul Experiences - Plataforma de Retiros de Bienestar

## 📋 Descripción del Proyecto

Soul Experiences es una plataforma web completa para la gestión y promoción de retiros de transformación y autoconocimiento. El proyecto incluye:

- **Landing Page moderna** con navegación por scroll suave y secciones dinámicas
- **Panel de administración completo** para gestionar retiros, testimonios, leads y configuraciones
- **Sistema de gestión de imágenes** integrado con Cloudinary
- **Formularios públicos** para registro de interesados y envío de testimonios
- **Diseño responsive** optimizado para todos los dispositivos

## 🛠️ Stack Tecnológico

- **Frontend**: React + Vite + React Router + Bootstrap
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Autenticación**: JWT (JSON Web Tokens) + Context API
- **Encriptación**: bcrypt para contraseñas
- **Imágenes**: Cloudinary (upload y optimización automática)
- **UI/UX**: React Icons, Swiper, Animaciones CSS personalizadas
- **Tipografía**: Roca Two (títulos), Montserrat (cuerpo)
- **Seguridad**: CORS, Helmet, Variables de entorno, Protected Routes

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
soul-experiences/
├── frontend/                    # Aplicación React con Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── admin/         # Panel de administración
│   │   │   │   ├── leads/     # Gestión de leads
│   │   │   │   ├── retreats/  # Gestión de retiros
│   │   │   │   └── testimonials/ # Gestión de testimonios
│   │   │   └── sections/      # Secciones de la landing page
│   │   │       ├── HeroSection.jsx
│   │   │       ├── AboutSection.jsx
│   │   │       ├── RetreatsSection.jsx
│   │   │       ├── ServicesSection.jsx
│   │   │       ├── TestimonialsSection.jsx
│   │   │       ├── ContactSection.jsx
│   │   │       └── FaqSection.jsx
│   │   ├── pages/             # Páginas principales
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RetreatDetailPage.jsx
│   │   │   └── PublicTestimonialPage.jsx
│   │   ├── services/          # Servicios para API calls
│   │   │   ├── api.js         # Cliente Axios configurado
│   │   │   └── cloudinary.js  # Servicio de imágenes
│   │   ├── contexts/          # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilidades
│   │   ├── constants/         # Constantes y enums
│   │   └── assets/            # Recursos estáticos
│   │       ├── fonts/         # Tipografías personalizadas
│   │       ├── ILUSTRACIONES/ # Ilustraciones SVG
│   │       └── CLARISA/       # Fotos de Clarisa
│   └── public/                # Archivos públicos y videos
├── backend/                    # API REST con Express
│   ├── models/                # Modelos de MongoDB (Mongoose)
│   │   ├── Retreat.js         # Modelo de retiros
│   │   ├── Testimonial.js     # Modelo de testimonios
│   │   ├── Lead.js            # Modelo de leads
│   │   ├── User.js            # Modelo de usuarios
│   │   ├── Settings.js        # Configuraciones del sitio
│   │   └── TestimonialToken.js # Tokens para testimonios
│   ├── services/              # Capa de servicios (lógica de negocio)
│   │   ├── retreatService.js
│   │   ├── testimonialService.js
│   │   ├── leadService.js
│   │   └── userService.js
│   ├── controllers/           # Controladores HTTP
│   │   ├── retreatController.js
│   │   ├── testimonialController.js
│   │   ├── leadController.js
│   │   ├── authController.js
│   │   └── settingsController.js
│   ├── routes/                # Definición de rutas de la API
│   ├── middleware/            # Middlewares personalizados
│   │   └── auth.js            # Protección de rutas
│   ├── config/                # Configuraciones
│   │   └── db.js              # Conexión a MongoDB
│   └── scripts/               # Scripts utilitarios
└── README.md                  # Este archivo
```

### Separación de Responsabilidades (Patrón de Capas)

El proyecto implementa una **arquitectura de capas** que separa claramente las responsabilidades:

1. **Capa de Presentación** (Controllers): Maneja las solicitudes HTTP y respuestas
2. **Capa de Lógica de Negocio** (Services): Contiene toda la lógica de negocio y validaciones
3. **Capa de Acceso a Datos** (Models): Interactúa directamente con MongoDB

## 📊 Esquema de Base de Datos

### Entidades Principales

#### Retiros (Productos)
```javascript
{
  title: String,                    // Título del retiro
  description: String,              // Descripción detallada
  shortDescription: String,         // Descripción corta para cards
  startDate: Date,                  // Fecha de inicio
  endDate: Date,                    // Fecha de fin
  location: {                       // Ubicación completa
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  price: Number,                    // Precio base
  currency: String,                 // Moneda (ARS, USD, etc.)
  images: [String],                 // URLs de imágenes (Cloudinary)
  heroImageIndex: Number,           // Índice de imagen para hero (0-based)
  status: String,                   // active, draft, completed, cancelled
  showInHero: Boolean,              // Mostrar en hero de landing
  maxParticipants: Number,
  availableSpots: Number,
  
  // Información detallada
  whoIsItFor: [String],             // Para quién es el retiro
  experiences: [String],            // Actividades incluidas
  includes: [String],               // Qué incluye
  notIncludes: [String],            // Qué no incluye
  foodDetails: String,              // Detalles de alimentación
  accommodationDetails: String,     // Detalles de alojamiento
  
  // Políticas
  cancellationPolicy: String,
  
  // Estadísticas
  inquiryCount: Number,             // Contador de consultas
  viewCount: Number                 // Contador de vistas
}
```

#### Testimonios (Relación con Retiros)
```javascript
{
  participantName: String,
  participantEmail: String,
  retreat: ObjectId,      // Referencia a Retreat (populate)
  rating: Number,         // 1-5 estrellas
  comment: String,
  isApproved: Boolean,
  isFeatured: Boolean
}
```

#### Usuarios (Administradores)
```javascript
{
  name: String,
  email: String,
  password: String,       // Hasheado con bcrypt
  isActive: Boolean
}
```

#### Leads (Interesados)
```javascript
{
  name: String,
  email: String,
  phone: String,
  retreat: ObjectId,      // Referencia a Retreat
  message: String,
  status: String,         // new, contacted, converted, lost
  source: String,         // landing, facebook, instagram, etc.
  createdAt: Date
}
```

#### Settings (Configuración del Sitio)
```javascript
{
  aboutMe: {
    title: String,
    content: String,
    images: [String]
  },
  contact: {
    email: String,
    phone: String,
    whatsapp: String,
    instagram: String,
    facebook: String
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}
```

#### Testimonial Tokens (Tokens para Testimonios)
```javascript
{
  token: String,          // Token único
  retreat: ObjectId,      // Referencia a Retreat
  participantEmail: String,
  participantName: String,
  expiresAt: Date,
  used: Boolean
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)
- Cuenta de Cloudinary (para imágenes)
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd soul-experiences
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/soul_experiences

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Servidor
PORT=5000
NODE_ENV=development
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

### 4. Ejecutar el Proyecto

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🛣️ Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión
- `PUT /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/create-admin` - Crear administrador (solo si no existe)

### Retiros (CRUD Completo)
**Públicos:**
- `GET /api/retreats` - Obtener todos los retiros
- `GET /api/retreats/:id` - Obtener retiro por ID
- `GET /api/retreats/active/current` - Obtener retiro activo para hero
- `GET /api/retreats/past` - Obtener retiros pasados (máx 6)
- `GET /api/retreats/hero-data` - Obtener datos para hero
- `POST /api/retreats/:id/inquiry` - Incrementar contador de consultas

**Protegidos (Admin):**
- `POST /api/retreats` - Crear nuevo retiro
- `PUT /api/retreats/:id` - Actualizar retiro
- `DELETE /api/retreats/:id` - Eliminar retiro

### Testimonios (CRUD Completo con Relación)
**Públicos:**
- `GET /api/testimonials/featured/public` - Obtener testimonios destacados
- `POST /api/testimonials/submit/:token` - Enviar testimonio con token
- `GET /api/testimonials/validate/:token` - Validar token

**Protegidos (Admin):**
- `GET /api/testimonials` - Obtener todos los testimonios (con populate)
- `GET /api/testimonials/:id` - Obtener testimonio por ID
- `POST /api/testimonials` - Crear testimonio
- `PUT /api/testimonials/:id` - Actualizar testimonio
- `DELETE /api/testimonials/:id` - Eliminar testimonio

### Leads (Gestión de Interesados)
**Públicos:**
- `POST /api/leads` - Crear nuevo lead desde formulario

**Protegidos (Admin):**
- `GET /api/leads` - Obtener todos los leads
- `GET /api/leads/:id` - Obtener lead por ID
- `PUT /api/leads/:id` - Actualizar lead
- `DELETE /api/leads/:id` - Eliminar lead
- `GET /api/leads/stats` - Obtener estadísticas de leads

### Tokens de Testimonios
**Protegidos (Admin):**
- `POST /api/tokens/generate` - Generar token para testimonio
- `GET /api/tokens` - Obtener todos los tokens
- `DELETE /api/tokens/:id` - Eliminar token

### Settings (Configuración del Sitio)
**Públicos:**
- `GET /api/settings` - Obtener configuración pública

**Protegidos (Admin):**
- `PUT /api/settings` - Actualizar configuración

## 📝 Ejemplos de Datos Mock

### Crear Retiro (POST /api/retreats)
```json
{
  "title": "Retiro de Yoga y Meditación",
  "description": "Un retiro transformador en la naturaleza",
  "shortDescription": "Conecta con tu ser interior",
  "startDate": "2024-12-15T00:00:00.000Z",
  "endDate": "2024-12-20T00:00:00.000Z",
  "location": {
    "name": "Centro de Retiros Montaña Sagrada",
    "address": "Ruta Provincial 123, KM 45",
    "city": "Villa General Belgrano",
    "state": "Córdoba",
    "country": "Argentina"
  },
  "price": 150000,
  "currency": "ARS",
  "maxParticipants": 20,
  "images": [
    "https://res.cloudinary.com/tu-cloud/image/upload/v123/retiro1.jpg"
  ],
  "status": "active"
}
```

### Crear Testimonio (POST /api/testimonials)
```json
{
  "participantName": "María González",
  "participantEmail": "maria@email.com",
  "retreat": "64f8b2c1234567890abcdef1",
  "rating": 5,
  "comment": "Una experiencia transformadora que cambió mi vida",
  "isApproved": true,
  "isFeatured": true
}
```

## 🔐 Seguridad Implementada

- **Autenticación JWT**: Tokens seguros para sesiones
- **Encriptación bcrypt**: Contraseñas hasheadas con salt
- **Validación de entrada**: Mongoose validators y sanitización
- **CORS configurado**: Control de acceso entre dominios
- **Helmet**: Headers de seguridad HTTP
- **Variables de entorno**: Datos sensibles protegidos

## 🎯 Cumplimiento de Requisitos del TP

### ✅ Entidades y Relaciones

#### Entidad Principal: Retiros (Productos)
- **CRUD Completo**: Create, Read, Update, Delete
- **Campos extensos**: 20+ campos incluyendo información detallada
- **Validaciones**: Fechas, precios, disponibilidad, imágenes
- **Endpoints públicos y protegidos**
- **Estadísticas**: Contador de consultas y vistas

#### Entidad Relacionada: Testimonios (Categorías)
- **Relación con Retiros**: Referencia mediante ObjectId
- **Populate automático**: Carga información del retiro asociado
- **CRUD Completo** con aprobación manual
- **Sistema de tokens** para envío público
- **Destacados** para mostrar en landing page

#### Entidades Adicionales
- **Leads**: Gestión de interesados con relación a Retiros
- **Users**: Administradores con autenticación
- **Settings**: Configuración global del sitio
- **TestimonialTokens**: Tokens únicos para envío de testimonios

### ✅ Separación de Responsabilidades (Arquitectura de Capas)

#### 1. Capa de Servicios (`/backend/services/`)
- **retreatService.js**: Lógica de negocio de retiros
- **testimonialService.js**: Lógica de testimonios y tokens
- **leadService.js**: Gestión de leads y estadísticas
- **userService.js**: Autenticación y gestión de usuarios
- **Responsabilidad**: Validaciones, transformaciones, lógica de negocio

#### 2. Capa de Controladores (`/backend/controllers/`)
- **retreatController.js**: Manejo de requests HTTP de retiros
- **testimonialController.js**: Manejo de requests de testimonios
- **leadController.js**: Manejo de requests de leads
- **authController.js**: Manejo de autenticación
- **settingsController.js**: Manejo de configuración
- **Responsabilidad**: Parseo de requests, envío de responses, códigos HTTP

#### 3. Capa de Modelos (`/backend/models/`)
- **Retreat.js**: Esquema y validaciones de retiros
- **Testimonial.js**: Esquema y validaciones de testimonios
- **Lead.js**: Esquema de leads
- **User.js**: Esquema de usuarios con métodos de autenticación
- **Settings.js**: Esquema de configuración
- **TestimonialToken.js**: Esquema de tokens
- **Responsabilidad**: Definición de esquemas, validaciones de Mongoose, métodos de modelo

### ✅ Relaciones con Populate

#### Testimonios → Retiros
```javascript
// Obtener testimonios con información del retiro
const testimonials = await Testimonial.find({ isApproved: true })
  .populate('retreat', 'title startDate endDate location images')
  .sort({ createdAt: -1 });
```

#### Leads → Retiros
```javascript
// Obtener leads con información del retiro
const leads = await Lead.find()
  .populate('retreat', 'title startDate endDate price')
  .sort({ createdAt: -1 });
```

#### Tokens → Retiros
```javascript
// Validar token con información del retiro
const token = await TestimonialToken.findOne({ token: tokenString })
  .populate('retreat', 'title startDate endDate');
```

### ✅ Seguridad y Configuración

#### Autenticación y Autorización
- ✅ **JWT** con expiración de 7 días
- ✅ **bcrypt** con 10 salt rounds
- ✅ **Protected routes** en frontend (ProtectedRoute component)
- ✅ **Middleware de autenticación** en backend (protect, authorize)
- ✅ **Context API** para estado global de autenticación

#### Seguridad de Datos
- ✅ **Variables de entorno** (.env) para datos sensibles
- ✅ **CORS** configurado correctamente
- ✅ **Helmet** para headers de seguridad HTTP
- ✅ **Validación de inputs** en frontend y backend
- ✅ **Sanitización** de datos antes de guardar
- ✅ **Tokens únicos** con expiración para testimonios

#### Manejo de Errores
- ✅ **Try-catch** en todos los controladores
- ✅ **Mensajes descriptivos** de error
- ✅ **Códigos HTTP apropiados** (200, 201, 400, 401, 404, 500)
- ✅ **Logging** de errores en servidor
- ✅ **Feedback visual** de errores en frontend

## 🚀 Scripts Disponibles

### Backend
- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm start` - Ejecutar en producción

### Frontend
- `npm run dev` - Servidor de desarrollo con Vite
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build

## 📱 Funcionalidades Principales

### 🌐 Sitio Público (Landing Page)

#### Hero Section Dinámico
- **Carrusel automático** de retiros activos y pasados
- **Selector de imagen hero** personalizable por retiro
- **Información en tiempo real**: fechas, precios, disponibilidad
- **Palabras resaltadas** dinámicas según el retiro
- **Transiciones suaves** cada 5 segundos
- **Fallback inteligente** a fotos de Clarisa si no hay retiros

#### Sobre Mí (About Section)
- **Carrusel de fotos** de Clarisa con Swiper
- **Biografía completa** editable desde admin
- **Diseño elegante** con tipografía personalizada
- **CTA** que lleva a sección de retiros

#### Retiros (Descubre tu Brillo)
- **Fondo dinámico** con imágenes de retiros pasados
- **Cards de retiros activos** con toda la información
- **Filtrado automático** por estado
- **Contador de consultas** al hacer clic en "Reservar"
- **Vista detallada** de cada retiro en página separada

#### Qué Encontrarás (Services)
- **3 conceptos principales**: Autoconocimiento, Sanación Emocional, Renovación
- **8 actividades específicas** con iconos modernos (React Icons)
- **Efectos hover** interactivos
- **Grid responsive** adaptable a todos los dispositivos
- **Ilustraciones SVG** decorativas

#### Testimonios
- **Testimonios destacados** de la base de datos
- **Rating con estrellas** visual
- **Información del retiro** asociado (populate)
- **Sistema de tokens** para envío público de testimonios
- **Aprobación manual** desde el admin

#### Contacto
- **Información real** de contacto
- **Botones directos** a WhatsApp y Email
- **Formulario de registro** de leads
- **Integración con redes sociales**

#### FAQ Section
- **Preguntas frecuentes** con acordeón
- **Diseño limpio** y fácil de leer
- **Animaciones suaves** al expandir/colapsar

### 🔐 Panel de Administración

#### Dashboard
- **Estadísticas en tiempo real**: leads, retiros, testimonios
- **Gráficos visuales** de conversión
- **Accesos rápidos** a todas las secciones
- **Resumen de actividad** reciente

#### Gestión de Retiros
- **CRUD completo** con validaciones
- **Formulario extenso** con todas las secciones:
  - Información básica
  - Ubicación con coordenadas
  - Fechas y precios
  - Imágenes múltiples con Cloudinary
  - **Selector de imagen hero** específica
  - Para quién es el retiro
  - Experiencias/actividades
  - Qué incluye/no incluye
  - Detalles de alimentación y alojamiento
  - Políticas de cancelación
- **Vista previa** de cómo se verá en la landing
- **Guardado manual** con confirmación
- **Estados**: draft, active, completed, cancelled

#### Gestión de Testimonios
- **Lista completa** con filtros
- **Aprobación/rechazo** de testimonios
- **Marcar como destacados** para landing
- **Generación de tokens** para envío público
- **Populate automático** de información del retiro
- **Edición completa** de testimonios

#### Gestión de Leads
- **Lista de interesados** con toda la información
- **Estados**: new, contacted, converted, lost
- **Filtros** por retiro, estado, fecha
- **Estadísticas** de conversión
- **Guardado manual** para evitar actualizaciones accidentales
- **Información del retiro** asociado

#### Gestión de Tokens
- **Generar tokens únicos** para testimonios
- **Enviar por email** a participantes
- **Fecha de expiración** configurable
- **Control de uso** (usado/no usado)
- **Validación automática** en formulario público

#### Configuración del Sitio
- **Editar "Sobre Mí"**: título, contenido, imágenes
- **Información de contacto**: email, teléfono, WhatsApp, redes sociales
- **SEO**: título, descripción, keywords
- **Actualización en tiempo real** en la landing

### 🎨 Características de Diseño

#### Tipografía
- **Roca Two**: Títulos elegantes y distintivos
- **Montserrat**: Texto de cuerpo legible

#### Paleta de Colores
- **Background**: #f7f5ed (crema cálido)
- **Text**: #43304a (púrpura oscuro)
- **Primary**: #ebbe6f (ocre dorado)
- **Secondary**: #75a6a8 (verde azulado)
- **Accent**: #81536F (malva)

#### Efectos Visuales
- **Glassmorphism** en navbar
- **Animaciones CSS** personalizadas
- **Transiciones suaves** en todos los elementos
- **Hover effects** interactivos
- **Scroll suave** entre secciones
- **Detección de sección activa** en navbar

#### Responsive Design
- **Mobile first** approach
- **Breakpoints optimizados**: 576px, 768px, 992px, 1200px
- **Grid adaptable** en todas las secciones
- **Imágenes optimizadas** por tamaño de pantalla
- **Navbar responsive** con menú hamburguesa

## 🌟 Características Técnicas Destacadas

### Sistema de Imágenes con Cloudinary
- **Upload directo** desde el navegador con preset unsigned
- **Drag & drop** intuitivo con vista previa
- **Múltiples imágenes** por retiro
- **Selector de imagen hero** específica para cada retiro
- **Optimización automática** de calidad y formato
- **URLs permanentes** y CDN global
- **Validación** de formatos (JPG, PNG, WebP, GIF) y tamaños (máx 10MB)

### Navegación por Scroll Suave
- **Single Page Application** con scroll entre secciones
- **Detección automática** de sección activa en navbar
- **Offset inteligente** para navbar fijo (80px)
- **Transiciones suaves** con CSS scroll-behavior
- **Hash routing** para compartir enlaces a secciones específicas

### Sistema de Tokens para Testimonios
- **Tokens únicos** generados por retiro
- **Expiración configurable** para seguridad
- **Validación automática** antes de mostrar formulario
- **Control de uso** (un testimonio por token)
- **Envío por email** a participantes del retiro

### Gestión Inteligente de Estado
- **Context API** para autenticación global
- **Custom hooks** para lógica reutilizable
- **Guardado manual** en formularios para evitar peticiones innecesarias
- **Indicadores visuales** de cambios sin guardar
- **Optimistic updates** en algunas operaciones

### Validaciones Robustas
- **Frontend**: Validación en tiempo real con feedback visual
- **Backend**: Validaciones con Mongoose y lógica personalizada
- **Fechas**: Validación de que endDate >= startDate
- **Imágenes**: Validación de heroImageIndex dentro del rango
- **Emails**: Formato y unicidad validados
- **Tokens**: Verificación de expiración y uso

### Performance y Optimización
- **Lazy loading** de imágenes
- **Code splitting** con React Router
- **Vite** para builds ultra-rápidos
- **MongoDB indexes** en campos frecuentemente consultados
- **Populate selectivo** para reducir payload
- **Caché de configuración** del sitio

### Seguridad
- **JWT** con expiración configurable
- **bcrypt** con salt rounds para contraseñas
- **Protected routes** en frontend y backend
- **CORS** configurado correctamente
- **Helmet** para headers de seguridad
- **Variables de entorno** para datos sensibles
- **Sanitización** de inputs en formularios

## 🚀 Roadmap Futuro

### Funcionalidades Planeadas
- [ ] Sistema de pagos integrado (Mercado Pago / Stripe)
- [ ] Notificaciones por email automatizadas
- [ ] Chat en vivo para consultas
- [ ] Blog/Artículos sobre bienestar
- [ ] Galería de fotos de retiros pasados
- [ ] Sistema de reviews públicos
- [ ] Integración con Google Calendar
- [ ] Newsletter con Mailchimp
- [ ] Analytics dashboard mejorado
- [ ] PWA (Progressive Web App)

### Mejoras Técnicas
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Docker para desarrollo
- [ ] Monitoreo con Sentry
- [ ] Logs estructurados
- [ ] Rate limiting en API
- [ ] WebSockets para notificaciones en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

**Desarrollado con ❤️ para Soul Experiences**
