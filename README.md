# Soul Experiences - API RESTful con CRUD y Capa de Servicios

## 📋 Descripción del Proyecto

Soul Experiences es una API RESTful completa desarrollada con Node.js, Express y MongoDB que implementa un sistema de gestión de retiros de bienestar. El proyecto aplica el patrón de **separación de responsabilidades** mediante una arquitectura de capas (Modelos, Servicios, Controladores) y cumple con todos los requisitos del trabajo práctico.

### Características Principales
- **API RESTful** con operaciones CRUD completas
- **Arquitectura de capas** con separación clara de responsabilidades
- **Relaciones entre entidades** usando referencias de MongoDB y populate
- **Autenticación JWT** con cookies HttpOnly
- **Encriptación bcrypt** para contraseñas
- **Variables de entorno** para configuración sensible
- **Frontend React** como cliente de la API

## 🛠️ Tecnologías Utilizadas

### Backend (API)
- **Node.js** v18+ - Runtime de JavaScript
- **Express** v4.18+ - Framework web
- **MongoDB** v6+ - Base de datos NoSQL
- **Mongoose** v7+ - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcrypt** - Encriptación de contraseñas
- **dotenv** - Gestión de variables de entorno
- **cors** - Manejo de CORS
- **helmet** - Seguridad HTTP headers
- **cookie-parser** - Parseo de cookies

### Frontend (Cliente)
- **React** v18+ - Librería UI
- **Vite** - Build tool
- **React Router** v6 - Enrutamiento
- **Axios** - Cliente HTTP
- **Bootstrap** v5 - Framework CSS

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios (Backend)

El proyecto sigue la estructura requerida por el TP con separación clara de responsabilidades:

```
backend/
├── server.js                   # Punto de entrada de la aplicación
├── .env                        # Variables de entorno
├── package.json
└── src/
    ├── models/                 # Modelos de MongoDB (Mongoose)
    │   ├── Retreat.js          # Entidad principal (Productos)
    │   ├── Testimonial.js      # Entidad relacionada (Categorías)
    │   ├── Lead.js             # Entidad adicional
    │   ├── User.js             # Usuarios y autenticación
    │   ├── Settings.js         # Configuraciones
    │   └── TestimonialToken.js # Tokens de acceso
    │
    ├── services/               # Capa de Servicios (Lógica de Negocio)
    │   ├── retreatService.js   # Lógica de retiros
    │   ├── testimonialService.js # Lógica de testimonios
    │   ├── leadService.js      # Lógica de leads
    │   └── userService.js      # Lógica de autenticación
    │
    ├── controllers/            # Controladores (Manejo HTTP)
    │   ├── retreatController.js
    │   ├── testimonialController.js
    │   ├── leadController.js
    │   ├── authController.js
    │   └── settingsController.js
    │
    ├── routes/                 # Definición de rutas
    │   ├── retreats.js
    │   ├── testimonials.js
    │   ├── leads.js
    │   ├── auth.js
    │   ├── settings.js
    │   └── tokens.js
    │
    ├── middleware/             # Middlewares personalizados
    │   ├── auth.js             # Verificación JWT
    │   └── errorHandler.js     # Manejo de errores
    │
    ├── config/                 # Configuraciones
    │   ├── db.js               # Conexión a MongoDB
    │   └── index.js            # Configuración centralizada
    │
    └── utils/                  # Utilidades
        ├── AppError.js         # Clase de errores
        ├── asyncHandler.js     # Wrapper async
        └── logger.js           # Logger condicional
```

### Separación de Responsabilidades (Patrón de Capas)

El proyecto implementa una **arquitectura de capas** que separa claramente las responsabilidades según los requisitos del TP:

#### 1. **Capa de Modelos** (`models/`)
- Define los esquemas de MongoDB con Mongoose
- Implementa validaciones a nivel de base de datos
- Contiene métodos de instancia (ej: `comparePassword`, `generateAuthToken`)
- Hooks de Mongoose (ej: `pre('save')` para hashear contraseñas con bcrypt)

#### 2. **Capa de Servicios** (`services/`) - **OBLIGATORIA**
- **Contiene TODA la lógica de negocio**
- Realiza las llamadas directas a Mongoose/MongoDB
- Implementa validaciones complejas
- Maneja transformaciones de datos
- Lanza errores personalizados (AppError)
- **Los controladores NUNCA acceden directamente a los modelos**

#### 3. **Capa de Controladores** (`controllers/`)
- **Ligeros y sin lógica de negocio**
- Manejan la solicitud HTTP (Request)
- Delegan toda la lógica al Servicio correspondiente
- Gestionan la respuesta HTTP (Response)
- Manejan códigos de estado HTTP apropiados (200, 201, 400, 404, 500)
- Implementan try/catch para manejo de errores

## 📊 Esquema de Base de Datos

### Colecciones de MongoDB

La base de datos `clari-retiros` contiene las siguientes colecciones:

#### 1. **Retreats** (Entidad Principal - equivalente a "Productos")

**Descripción**: Representa los retiros de bienestar ofrecidos.

```javascript
{
  _id: ObjectId,
  title: String,                    // Nombre del retiro (requerido)
  description: String,              // Descripción detallada (requerido)
  shortDescription: String,         // Descripción corta
  
  // Fechas y ubicación
  startDate: Date,                  // Fecha de inicio (requerido)
  endDate: Date,                    // Fecha de fin (requerido)
  location: {                       // Ubicación completa
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  // Precio e inventario
  price: Number,                    // Precio base (requerido)
  currency: String,                 // Moneda (default: 'ARS')
  maxParticipants: Number,          // Cupos totales
  availableSpots: Number,           // Cupos disponibles
  
  // Estado y visibilidad
  status: String,                   // 'active', 'draft', 'completed', 'cancelled'
  showInHero: Boolean,              // Mostrar en hero de landing
  
  // Multimedia
  images: [String],                 // URLs de imágenes
  heroImageIndex: Number,           // Índice de imagen principal
  
  // Información detallada
  whoIsItFor: [String],             // Para quién es el retiro
  experiences: [String],            // Actividades incluidas
  includes: [String],               // Qué incluye
  notIncludes: [String],            // Qué no incluye
  foodDetails: String,              // Detalles de alimentación
  accommodationDetails: String,     // Detalles de alojamiento
  cancellationPolicy: String,       // Políticas de cancelación
  
  // Campos virtuales (calculados)
  computedStatus: String,           // Estado calculado dinámicamente
  slug: String,                     // URL-friendly identifier
  
  // Timestamps automáticos
  createdAt: Date,
  updatedAt: Date
}
```

**Validaciones**:
- `title`: requerido, mínimo 3 caracteres
- `description`: requerido
- `startDate` y `endDate`: requeridos, endDate debe ser >= startDate
- `price`: requerido, mínimo 0
- `status`: enum ['draft', 'active', 'completed', 'cancelled']

---

#### 2. **Testimonials** (Entidad Relacionada - equivalente a "Categorías")

**Descripción**: Testimonios de participantes asociados a retiros específicos.

**Relación**: Cada testimonio referencia un `Retreat` mediante ObjectId.

```javascript
{
  _id: ObjectId,
  participantName: String,          // Nombre del participante (requerido)
  participantEmail: String,         // Email del participante (requerido)
  retreat: ObjectId,                // REFERENCIA a Retreat (requerido)
  rating: Number,                   // Calificación 1-5 estrellas (requerido)
  comment: String,                  // Comentario del testimonio (requerido)
  isApproved: Boolean,              // Aprobado por admin (default: false)
  isFeatured: Boolean,              // Destacado en landing (default: false)
  createdAt: Date,
  updatedAt: Date
}
```

**Validaciones**:
- `participantName`: requerido
- `participantEmail`: requerido, formato email válido
- `retreat`: requerido, debe existir en la colección Retreats
- `rating`: requerido, entre 1 y 5
- `comment`: requerido, mínimo 10 caracteres

**Populate**: Al consultar testimonios, se hace populate del campo `retreat` para incluir información completa del retiro.

---

#### 3. **Users** (Usuarios - Autenticación)

**Descripción**: Administradores del sistema con autenticación JWT.

```javascript
{
  _id: ObjectId,
  name: String,                     // Nombre completo (requerido)
  email: String,                    // Email único (requerido)
  password: String,                 // Contraseña hasheada con bcrypt (requerido)
  lastLogin: Date,                  // Último inicio de sesión
  createdAt: Date,
  updatedAt: Date
}
```

**Seguridad**:
- Contraseña hasheada con bcrypt (10 salt rounds) mediante pre-save hook
- Método `comparePassword(password)` para validar credenciales
- Método `generateAuthToken()` para crear JWT
- Campo `password` excluido por defecto en queries (select: false)

---

#### 4. **Leads** (Interesados)

**Descripción**: Registro de personas interesadas en los retiros.

**Relación**: Cada lead puede referenciar un `Retreat` específico.

```javascript
{
  _id: ObjectId,
  name: String,                     // Nombre completo (requerido)
  email: String,                    // Email (requerido)
  phone: String,                    // Teléfono
  retreat: ObjectId,                // REFERENCIA a Retreat (opcional)
  message: String,                  // Mensaje del interesado
  status: String,                   // 'new', 'contacted', 'converted', 'lost'
  source: String,                   // Origen del lead
  createdAt: Date,
  updatedAt: Date
}
```

---

#### 5. **Settings** (Configuración del Sitio)

**Descripción**: Configuración global del sitio (singleton).

```javascript
{
  _id: ObjectId,
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
  },
  updatedAt: Date
}
```

---

#### 6. **TestimonialTokens** (Tokens de Acceso)

**Descripción**: Tokens únicos para que participantes envíen testimonios.

**Relación**: Cada token referencia un `Retreat`.

```javascript
{
  _id: ObjectId,
  token: String,                    // Token único (UUID)
  email: String,                    // Email del participante
  participantName: String,          // Nombre del participante
  retreat: ObjectId,                // REFERENCIA a Retreat
  isUsed: Boolean,                  // Si ya fue utilizado
  usedAt: Date,                     // Fecha de uso
  expiresAt: Date,                  // Fecha de expiración (30 días)
  createdAt: Date
}
```

---

### Relaciones entre Entidades

```
Retreats (1) ──────< (N) Testimonials
   │
   │
   └──────< (N) Leads
   │
   └──────< (N) TestimonialTokens
```

**Uso de Populate**:
- `Testimonial.find().populate('retreat')` - Incluye datos del retiro
- `Lead.find().populate('retreat')` - Incluye datos del retiro
- `TestimonialToken.findOne().populate('retreat')` - Incluye datos del retiro

## 🚀 Cómo Correr el Proyecto

### Prerrequisitos

- **Node.js** v18 o superior
- **MongoDB** (local o MongoDB Atlas)
- **npm** o **yarn**
- **Git**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/soul-experiences.git
cd soul-experiences
```

### Paso 2: Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017/clari-retiros
# O usar MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/clari-retiros

# JWT Secret (cambiar por una clave segura)
JWT_SECRET=mi_clave_secreta_super_segura_123456
JWT_EXPIRE=30d

# Puerto del servidor
PORT=5001

# Entorno
NODE_ENV=development

# CORS - Origen del frontend
FRONTEND_ORIGIN=http://localhost:3000

# Cookies (desarrollo)
COOKIE_SAMESITE=lax
COOKIE_SECURE=false

# Email (opcional - para notificaciones)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_app_password
```

### Paso 3: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### Paso 4: Ejecutar el Backend

```bash
# Modo desarrollo (con nodemon)
npm run dev

# O modo producción
npm start
```

El servidor estará corriendo en `http://localhost:5001`

### Paso 5: Instalar y Ejecutar el Frontend (Opcional)

El frontend es un cliente React para consumir la API.

```bash
cd ../frontend
npm install

# Crear .env en frontend/
echo "VITE_API_URL=http://localhost:5001/api" > .env

# Ejecutar
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Paso 6: Crear Usuario Administrador

Para acceder al panel de administración, crear un usuario admin:

```bash
# Hacer POST a /api/auth/create-admin
curl -X POST http://localhost:5001/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@soulexperiences.com",
    "password": "admin123"
  }'
```

O usar Postman/Insomnia para hacer la petición.

## 🛟️ Listado de Endpoints (Rutas)

Base URL: `http://localhost:5001/api`

### 🔐 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/create-admin` | Crear administrador (solo si no existe) | No |
| GET | `/auth/me` | Obtener perfil del usuario | Sí (JWT) |
| POST | `/auth/logout` | Cerrar sesión | Sí (JWT) |
| PUT | `/auth/change-password` | Cambiar contraseña | Sí (JWT) |

---

### 🏞️ Retiros (Entidad Principal - CRUD Completo)

#### Rutas Públicas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/retreats` | Listar todos los retiros | No |
| GET | `/retreats/:id` | Obtener retiro por ID o slug | No |
| GET | `/retreats/active/current` | Obtener retiro activo para hero | No |
| GET | `/retreats/past` | Obtener retiros pasados (máx 6) | No |
| GET | `/retreats/hero-data` | Obtener datos para hero de landing | No |

#### Rutas Protegidas (Admin)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/retreats` | **Crear** nuevo retiro | Sí (JWT) |
| PUT | `/retreats/:id` | **Actualizar** retiro | Sí (JWT) |
| DELETE | `/retreats/:id` | **Eliminar** retiro | Sí (JWT) |

---

### ⭐ Testimonios (Entidad Relacionada - CRUD Completo)

**Relación**: Cada testimonio referencia un `Retreat` (populate automático)

#### Rutas Públicas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/testimonials/featured/public` | Obtener testimonios destacados | No |
| POST | `/testimonials/submit/:token` | Enviar testimonio con token | No |
| GET | `/tokens/validate/:token` | Validar token de testimonio | No |

#### Rutas Protegidas (Admin)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/testimonials` | **Listar** todos los testimonios (con populate) | Sí (JWT) |
| GET | `/testimonials/:id` | **Obtener** testimonio por ID | Sí (JWT) |
| POST | `/testimonials` | **Crear** testimonio | Sí (JWT) |
| PUT | `/testimonials/:id` | **Actualizar** testimonio | Sí (JWT) |
| DELETE | `/testimonials/:id` | **Eliminar** testimonio | Sí (JWT) |

---

### 📝 Leads (Interesados)

**Relación**: Cada lead puede referenciar un `Retreat`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/leads` | Crear nuevo lead (formulario público) | No |
| GET | `/leads` | Listar todos los leads | Sí (JWT) |
| GET | `/leads/:id` | Obtener lead por ID | Sí (JWT) |
| PUT | `/leads/:id` | Actualizar lead | Sí (JWT) |
| DELETE | `/leads/:id` | Eliminar lead | Sí (JWT) |
| GET | `/leads/stats/overview` | Obtener estadísticas | Sí (JWT) |

---

### 🎫 Tokens de Testimonios

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/tokens/generate/:retreatId` | Generar token para retiro | Sí (JWT) |
| GET | `/tokens` | Listar todos los tokens | Sí (JWT) |
| DELETE | `/tokens/:id` | Eliminar token | Sí (JWT) |
| POST | `/tokens/:id/regenerate` | Regenerar token expirado | Sí (JWT) |

---

### ⚙️ Settings (Configuración)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/settings/public` | Obtener configuración pública | No |
| GET | `/settings` | Obtener configuración completa | Sí (JWT) |
| PUT | `/settings` | Actualizar configuración | Sí (JWT) |

## 📝 Ejemplos de Datos Mock (JSON)

### 1. Login (POST /api/auth/login)

```json
{
  "email": "admin@soulexperiences.com",
  "password": "admin123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b2c1234567890abcdef0",
    "name": "Admin",
    "email": "admin@soulexperiences.com"
  }
}
```

---

### 2. Crear Retiro (POST /api/retreats) 🔒

**Headers requeridos:**
```
Content-Type: application/json
Cookie: token=<JWT_TOKEN>
```

**Body:**
```json
{
  "title": "Retiro de Yoga y Meditación en las Sierras",
  "description": "Un retiro transformador de 5 días en la naturaleza, donde conectarás con tu ser interior a través de prácticas de yoga, meditación y actividades de autoconocimiento.",
  "shortDescription": "Conecta con tu ser interior en las sierras",
  "startDate": "2025-03-15T00:00:00.000Z",
  "endDate": "2025-03-20T00:00:00.000Z",
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
  "availableSpots": 20,
  "status": "active",
  "whoIsItFor": [
    "Personas que buscan reconectar con su esencia",
    "Quienes desean iniciar un camino de autoconocimiento"
  ],
  "experiences": [
    "Yoga matutino",
    "Meditación guiada",
    "Caminatas conscientes",
    "Círculos de palabra"
  ],
  "includes": [
    "Alojamiento compartido",
    "Todas las comidas",
    "Materiales de yoga"
  ],
  "notIncludes": [
    "Transporte al retiro",
    "Seguro de viaje"
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Retiro creado exitosamente",
  "data": {
    "_id": "64f8b2c1234567890abcdef1",
    "title": "Retiro de Yoga y Meditación en las Sierras",
    "slug": "retiro-de-yoga-y-meditacion-en-las-sierras",
    "computedStatus": "upcoming",
    ...
  }
}
```

---

### 3. Crear Testimonio (POST /api/testimonials) 🔒

**Body:**
```json
{
  "participantName": "María González",
  "participantEmail": "maria@email.com",
  "retreat": "64f8b2c1234567890abcdef1",
  "rating": 5,
  "comment": "Una experiencia transformadora que cambió mi vida. El entorno natural, las prácticas de yoga y la conexión con el grupo fueron increíbles.",
  "isApproved": true,
  "isFeatured": true
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Testimonio creado exitosamente",
  "data": {
    "_id": "64f8b2c1234567890abcdef2",
    "participantName": "María González",
    "retreat": {
      "_id": "64f8b2c1234567890abcdef1",
      "title": "Retiro de Yoga y Meditación en las Sierras",
      "startDate": "2025-03-15T00:00:00.000Z"
    },
    "rating": 5,
    ...
  }
}
```

---

### 4. Crear Lead (POST /api/leads)

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "phone": "+54 9 11 1234-5678",
  "retreat": "64f8b2c1234567890abcdef1",
  "message": "Hola, me interesa reservar una plaza para el próximo retiro. ¿Tienen disponibilidad?",
  "source": "landing"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Lead creado exitosamente",
  "data": {
    "_id": "64f8b2c1234567890abcdef3",
    "name": "Juan Pérez",
    "status": "new",
    ...
  }
}
```

---

### 5. Listar Testimonios con Populate (GET /api/testimonials) 🔒

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f8b2c1234567890abcdef2",
      "participantName": "María González",
      "retreat": {
        "_id": "64f8b2c1234567890abcdef1",
        "title": "Retiro de Yoga y Meditación",
        "startDate": "2025-03-15T00:00:00.000Z",
        "location": {
          "name": "Centro de Retiros Montaña Sagrada"
        }
      },
      "rating": 5,
      "comment": "Una experiencia transformadora...",
      "isApproved": true
    }
  ]
}
```

**Nota**: El campo `retreat` se expande automáticamente con `populate()` para incluir información completa del retiro asociado.

## 🔐 Seguridad Implementada

- **Autenticación JWT + Cookies HttpOnly**: sesión en cookie HttpOnly (no `localStorage`, no header `Authorization`)
- **Encriptación bcrypt**: Contraseñas hasheadas con salt
- **Validación de entrada**: Mongoose validators y sanitización
- **CORS configurado**: Control de acceso entre dominios, con `credentials: true`
- **Helmet**: Headers de seguridad HTTP
- **Variables de entorno**: Datos sensibles protegidos

## 🎯 Cumplimiento de Requisitos del TP

### ✅ Entidades y Relaciones

#### Entidad Principal: Retiros (Productos)
- **CRUD Completo**: Create, Read, Update, Delete
- **Campos extensos**: 20+ campos incluyendo información detallada
- **Validaciones**: Fechas, precios, disponibilidad, imágenes
- **Endpoints públicos y protegidos**

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

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del Trabajo Práctico de la materia de Desarrollo de Aplicaciones Web.

---

**Desarrollado por**: Adrián Cerini  
**Repositorio**: [GitHub - Soul Experiences](https://github.com/tu-usuario/soul-experiences)  
**Año**: 2024-2025

---

## 📚 Recursos Adicionales

El proyecto incluye un **cliente frontend en React** que consume la API. Para más información sobre las funcionalidades del frontend, consultar la documentación en la carpeta `frontend/`.

### Características del Frontend:
- Landing page con scroll suave entre secciones
- Panel de administración completo
- Integración con Cloudinary para gestión de imágenes
- Diseño responsive con Bootstrap
- Autenticación con Context API

---

## 🌐 Demo y Deployment

**Backend (API)**: https://soul-experiences.onrender.com/api  
**Frontend**: https://clariweb.onrender.com

---

## 📞 Contacto

Para consultas sobre el proyecto:
- **Email**: adriancerini@example.com
- **GitHub**: [@CeriniA](https://github.com/tu-usuario)

---

### 🌐 Funcionalidades del Sitio Público (Landing Page)

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
- **Selección por botón** con vista previa
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

