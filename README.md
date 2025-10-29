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

### Demo y Deployment

- **Backend (API)**: https://soul-experiences.onrender.com/api
- **Frontend**: https://clariweb.onrender.com

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
    │   ├── Setting.js          # Configuración (singleton)
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
  
  // Información básica
  title: String,                    // Nombre del retiro (requerido, max 100 chars)
  description: String,              // Descripción detallada (requerido, max 2000 chars)
  shortDescription: String,         // Descripción corta (max 300 chars)
  
  // Público objetivo y experiencias
  targetAudience: [String],         // Para quién es este retiro
  experiences: [String],            // Actividades/experiencias del retiro
  
  // Fechas
  startDate: Date,                  // Fecha de inicio (requerido)
  endDate: Date,                    // Fecha de fin (requerido, >= startDate)
  
  // Ubicación completa
  location: {
    name: String,                   // Nombre del lugar (requerido)
    address: String,                // Dirección (requerido)
    city: String,
    state: String,
    country: String,                // Default: 'Argentina'
    description: String,            // Descripción del lugar
    features: [String],             // Características (ej: "2 hectáreas", "piscina")
    accommodationType: String,      // Tipo de alojamiento
    howToGetThere: {
      byBus: String,
      byCar: String,
      additionalInfo: String
    }
  },
  
  // Precio
  price: Number,                    // Precio base (requerido, min 0)
  currency: String,                 // 'ARS' | 'USD' | 'EUR' (default: 'ARS')
  
  // Precios escalonados (descuentos por fecha)
  pricingTiers: [{
    name: String,                   // ej: "Descuento anticipado"
    price: Number,
    validUntil: Date,
    paymentOptions: [String]        // ej: ["Un pago", "3 cuotas de $X"]
  }],
  
  // Capacidad
  maxParticipants: Number,          // Cupos totales (requerido, 1-100)
  
  // Qué incluye
  includes: [String],               // ej: ["Alojamiento", "Comidas"]
  notIncludes: [String],            // ej: ["Traslados", "Extras"]
  
  // Alimentación
  foodInfo: {
    foodType: String,               // ej: "Crudivegana, 100% orgánica"
    description: String,
    restrictions: [String]          // ej: ["Sin gluten", "Sin lácteos"]
  },
  
  // Políticas
  policies: {
    substanceFree: Boolean,         // Default: false
    restrictions: [String],         // ej: ["Sin tabaco", "Sin alcohol"]
    cancellationPolicy: String,
    additionalPolicies: [String]
  },
  
  // Multimedia
  images: [String],                 // URLs de imágenes
  heroImageIndex: Number,           // Índice de imagen para hero (default: 0)
  highlightWords: [String],         // Palabras a resaltar en el título
  
  // Estado y visibilidad
  status: String,                   // 'draft' | 'active' | 'completed' | 'cancelled'
  showInHero: Boolean,              // Mostrar en hero (default: false)
  
  // Contacto
  whatsappNumber: String,           // WhatsApp específico del retiro
  
  // SEO
  slug: String,                     // URL-friendly (único, generado automáticamente)
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Campos Virtuales** (calculados, no en DB):
- `durationDays`: Duración en días (calculado de startDate - endDate)
- `isFull`: Si está lleno (currentParticipants >= maxParticipants)
- `availableSpots`: Cupos disponibles (maxParticipants - currentParticipants)
- `activePricingTier`: Tier de precio activo por fecha
- `effectivePrice`: Precio efectivo (tier activo o precio base)
- `computedStatus`: Estado calculado basado en fechas ('upcoming', 'in_progress', 'completed')

**Validaciones**:
- `title`: requerido, max 100 caracteres
- `description`: requerido, max 2000 caracteres
- `startDate` y `endDate`: requeridos, endDate >= startDate
- `price`: requerido, mínimo 0
- `maxParticipants`: requerido, entre 1 y 100
- `status`: enum ['draft', 'active', 'completed', 'cancelled']
- `currency`: enum ['ARS', 'USD', 'EUR']
- `heroImageIndex`: debe ser < images.length

---

#### 2. **Testimonials** (Entidad Relacionada - equivalente a "Categorías")

**Descripción**: Testimonios de participantes asociados a retiros específicos.

**Relación**: Cada testimonio referencia un `Retreat` mediante ObjectId.

```javascript
{
  _id: ObjectId,
  
  // Datos del participante
  participantName: String,          // Nombre (requerido, max 100 chars)
  participantEmail: String,         // Email (formato válido)
  participantPhoto: String,         // URL de foto (opcional)
  
  // Relación con retiro
  retreat: ObjectId,                // REFERENCIA a Retreat (requerido)
  
  // Calificación y comentario
  rating: Number,                   // 1-5 estrellas (requerido)
  comment: String,                  // Comentario (requerido, max 1000 chars)
  
  // Estado
  isApproved: Boolean,              // Aprobado por admin (default: false)
  isFeatured: Boolean,              // Destacado en landing (default: false)
  
  // Token usado (si aplica)
  token: String,                    // Token usado para crear (sparse index)
  
  // Fechas
  approvedAt: Date,                 // Fecha de aprobación
  createdAt: Date,
  updatedAt: Date,
  
  // Notas internas
  notes: String                     // Notas del admin (max 500 chars)
}
```

**Campos Virtuales**:
- `stars`: Representación visual de rating (ej: '⭐⭐⭐⭐⭐')

**Validaciones**:
- `participantName`: requerido, max 100 caracteres
- `participantEmail`: formato email válido
- `retreat`: requerido, debe existir en Retreats
- `rating`: requerido, entre 1 y 5
- `comment`: requerido, max 1000 caracteres
- `notes`: max 500 caracteres

**Populate**: Al consultar testimonios, se hace populate del campo `retreat` para incluir información completa del retiro.

**Middleware**: Actualiza `approvedAt` automáticamente cuando `isApproved` cambia a `true`.

---

#### 3. **Users** (Usuarios - Autenticación)

**Descripción**: Administradores del sistema con autenticación JWT.

```javascript
{
  _id: ObjectId,
  name: String,                     // Nombre completo (requerido, max 50 chars)
  email: String,                    // Email único (requerido, formato válido)
  password: String,                 // Contraseña hasheada (requerido, min 6 chars, select: false)
  lastLogin: Date,                  // Último inicio de sesión
  passwordChangedAt: Date,          // Fecha de último cambio de contraseña
  createdAt: Date,
  updatedAt: Date
}
```

**Métodos de Instancia**:
- `comparePassword(candidatePassword)`: Compara contraseña con bcrypt
- `generateAuthToken()`: Genera JWT con id y email (expiración configurable)

**Métodos Estáticos**:
- `createDefaultAdmin(adminData)`: Crea admin por defecto si no existe

**Seguridad**:
- Contraseña hasheada con bcrypt (12 salt rounds) mediante pre-save hook
- Campo `password` excluido por defecto en queries (select: false)
- JWT firmado con `JWT_SECRET` del .env
- Validación de email único

**Validaciones**:
- `name`: requerido, max 50 caracteres
- `email`: requerido, único, formato válido
- `password`: requerido, mínimo 6 caracteres

---

#### 4. **Leads** (Interesados)

**Descripción**: Registro de personas interesadas en los retiros.

**Relación**: Cada lead referencia un `Retreat` específico.

```javascript
{
  _id: ObjectId,
  
  // Datos básicos
  name: String,                     // Nombre completo (requerido, max 100 chars)
  email: String,                    // Email (requerido, formato válido)
  phone: String,                    // Teléfono (requerido)
  
  // Mensaje/consulta
  message: String,                  // Mensaje (max 500 chars)
  
  // Tipo de interés
  interest: String,                 // 'reservar' | 'info' | 'consulta' (default: 'consulta')
  
  // Estado del lead
  status: String,                   // 'nuevo' | 'contactado' | 'interesado' | 'confirmado' | 'descartado'
  
  // Estado del pago
  paymentStatus: String,            // 'pendiente' | 'seña' | 'completo' (default: 'pendiente')
  
  // Información de pago
  paymentAmount: Number,            // Monto pagado (default: 0, min: 0)
  paymentMethod: String,            // '' | 'transferencia' | 'mercadopago' | 'efectivo'
  
  // Retiro de interés
  retreat: ObjectId,                // REFERENCIA a Retreat (requerido)
  
  // Notas internas
  notes: String,                    // Notas del admin (max 1000 chars)
  
  // Fuente del lead
  source: String,                   // 'landing' | 'instagram' | 'facebook' | 'referido' | 'otro'
  
  // Fechas
  contactedAt: Date,                // Fecha de contacto
  confirmedAt: Date,                // Fecha de confirmación
  createdAt: Date,
  updatedAt: Date
}
```

**Campos Virtuales**:
- `isConfirmed`: true si status === 'confirmado' && paymentStatus === 'completo'

**Validaciones**:
- `name`: requerido, max 100 caracteres
- `email`: requerido, formato válido
- `phone`: requerido
- `retreat`: requerido
- `message`: max 500 caracteres
- `notes`: max 1000 caracteres
- `paymentAmount`: mínimo 0
- `status`: enum ['nuevo', 'contactado', 'interesado', 'confirmado', 'descartado']
- `paymentStatus`: enum ['pendiente', 'seña', 'completo']
- `paymentMethod`: enum ['', 'transferencia', 'mercadopago', 'efectivo']
- `interest`: enum ['reservar', 'info', 'consulta']
- `source`: enum ['landing', 'instagram', 'facebook', 'referido', 'otro']

**Índice Único**: Combinación de `email` + `retreat` (evita duplicados)

---

#### 5. **Settings** (Configuración del Sitio)

**Descripción**: Configuración global del sitio (singleton - solo una configuración activa).

```javascript
{
  _id: ObjectId,
  
  // Información del facilitador
  facilitatorName: String,          // Nombre (requerido, max 100 chars)
  facilitatorBio: String,           // Biografía (max 1000 chars)
  facilitatorPhoto: String,         // URL de foto
  
  // Información de contacto
  contactEmail: String,             // Email (requerido, formato válido)
  whatsappNumber: String,           // WhatsApp (requerido)
  
  // Redes sociales
  socialMedia: {
    instagram: String,
    facebook: String,
    youtube: String,
    website: String
  },
  
  // Configuración del sitio
  siteTitle: String,                // Título (default: 'Retiros Espirituales', max 100 chars)
  siteDescription: String,          // Descripción (max 200 chars)
  siteLogo: String,                 // URL del logo
  
  // Configuración de emails
  emailSettings: {
    fromName: String,               // Default: 'Retiros Espirituales'
    fromEmail: String,
    replyTo: String
  },
  
  // Textos personalizables
  customTexts: {
    heroTitle: String,              // Default: 'Transforma tu vida...'
    heroSubtitle: String,
    ctaButton: String,              // Default: 'Quiero Reservar Mi Plaza'
    thankYouMessage: String
  },
  
  // Tema de colores
  theme: {
    primaryColor: String,           // Default: '#2E8B57'
    secondaryColor: String,         // Default: '#F4A460'
    accentColor: String             // Default: '#8A2BE2'
  },
  
  // Configuración activa
  isActive: Boolean,                // Default: true (solo una puede ser true)
  
  createdAt: Date,
  updatedAt: Date
}
```

**Métodos Estáticos**:
- `getActive()`: Obtiene la configuración activa
- `createDefault(facilitatorData)`: Crea configuración por defecto

**Validaciones**:
- `facilitatorName`: requerido, max 100 caracteres
- `facilitatorBio`: max 1000 caracteres
- `contactEmail`: requerido, formato válido
- `whatsappNumber`: requerido
- `siteTitle`: max 100 caracteres
- `siteDescription`: max 200 caracteres

**Índice Único**: Solo puede haber una configuración con `isActive: true`

---

#### 6. **TestimonialTokens** (Tokens de Acceso)

**Descripción**: Tokens únicos para que participantes envíen testimonios.

**Relación**: Cada token referencia un `Retreat`.

```javascript
{
  _id: ObjectId,
  
  // Token único
  token: String,                    // Token único (generado con crypto, 32 bytes hex)
  
  // Datos del participante
  email: String,                    // Email (requerido, lowercase)
  participantName: String,          // Nombre (requerido)
  
  // Retiro asociado
  retreat: ObjectId,                // REFERENCIA a Retreat (requerido)
  
  // Estado del token
  isUsed: Boolean,                  // Si ya fue utilizado (default: false)
  usedAt: Date,                     // Fecha de uso
  
  // Expiración
  expiresAt: Date,                  // Fecha de expiración (default: +30 días)
  
  // Testimonio creado
  testimonial: ObjectId,            // REFERENCIA a Testimonial (si aplica)
  
  createdAt: Date,
  updatedAt: Date
}
```

**Campos Virtuales**:
- `isExpired`: true si la fecha actual > expiresAt
- `isValid`: true si !isUsed && !isExpired

**Métodos Estáticos**:
- `generateForRetreat(retreatId, participants)`: Genera tokens para múltiples participantes
- `validateToken(tokenString)`: Valida y obtiene token con populate de retreat

**Validaciones**:
- `token`: requerido, único
- `email`: requerido
- `participantName`: requerido
- `retreat`: requerido

**Middleware**: 
- Actualiza `usedAt` automáticamente cuando `isUsed` cambia a `true`
- MongoDB elimina automáticamente tokens expirados (TTL index)

**Índices**:
- Único en `token`
- Compuesto en `email` + `retreat`
- TTL index en `expiresAt` (auto-eliminación)

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

## 🛣️ Endpoints de la API

**Base URL**: `http://localhost:5001/api`

### 🔐 Autenticación (`/auth`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/login` | Iniciar sesión (retorna JWT en cookie) | ❌ |
| `POST` | `/create-admin` | Crear primer administrador | ❌ |
| `GET` | `/me` | Obtener perfil del usuario autenticado | 🔒 |
| `POST` | `/logout` | Cerrar sesión (limpia cookie) | 🔒 |
| `PUT` | `/change-password` | Cambiar contraseña | 🔒 |

### 🏞️ Retiros (`/retreats`) - **CRUD Completo**

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/` | Listar todos los retiros | ❌ |
| `GET` | `/:id` | Obtener retiro por ID o slug | ❌ |
| `GET` | `/active/current` | Obtener retiro activo para hero | ❌ |
| `GET` | `/past` | Obtener retiros pasados (máx 6) | ❌ |
| `GET` | `/hero-data` | Datos para hero de landing | ❌ |
| `POST` | `/` | **Crear** retiro | 🔒 |
| `PUT` | `/:id` | **Actualizar** retiro | 🔒 |
| `DELETE` | `/:id` | **Eliminar** retiro | 🔒 |

### ⭐ Testimonios (`/testimonials`) - **CRUD Completo**

> **Relación**: Cada testimonio referencia un `Retreat` (populate automático)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/featured/public` | Testimonios destacados | ❌ |
| `POST` | `/submit/:token` | Enviar testimonio con token | ❌ |
| `GET` | `/` | **Listar** todos (con populate) | 🔒 |
| `GET` | `/:id` | **Obtener** por ID | 🔒 |
| `POST` | `/` | **Crear** testimonio | 🔒 |
| `PUT` | `/:id` | **Actualizar** testimonio | 🔒 |
| `DELETE` | `/:id` | **Eliminar** testimonio | 🔒 |

### 📝 Leads (`/leads`)

> **Relación**: Cada lead referencia un `Retreat`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/` | Crear lead (formulario público) | ❌ |
| `GET` | `/` | Listar todos los leads | 🔒 |
| `GET` | `/:id` | Obtener lead por ID | 🔒 |
| `PUT` | `/:id` | Actualizar lead | 🔒 |
| `DELETE` | `/:id` | Eliminar lead | 🔒 |
| `GET` | `/stats/overview` | Estadísticas de leads | 🔒 |

### 🎫 Tokens (`/tokens`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/generate/:retreatId` | Generar token para retiro | 🔒 |
| `GET` | `/validate/:token` | Validar token de testimonio | ❌ |
| `GET` | `/` | Listar todos los tokens | 🔒 |
| `DELETE` | `/:id` | Eliminar token | 🔒 |
| `POST` | `/:id/regenerate` | Regenerar token expirado | 🔒 |

### ⚙️ Settings (`/settings`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/public` | Configuración pública | ❌ |
| `GET` | `/` | Configuración completa | 🔒 |
| `PUT` | `/` | Actualizar configuración | 🔒 |

**Leyenda**: ❌ = Público | 🔒 = Requiere JWT (cookie HttpOnly)

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
    "country": "Argentina",
    "description": "Un espacio sagrado en las sierras de Córdoba",
    "features": ["2 hectáreas de naturaleza", "Domos geodésicos", "Piscina natural"],
    "accommodationType": "Cabañas compartidas",
    "howToGetThere": {
      "byBus": "Desde terminal de Córdoba, línea X hasta Villa General Belgrano",
      "byCar": "Ruta 5 hasta KM 45, desvío a la derecha"
    }
  },
  "price": 150000,
  "currency": "ARS",
  "pricingTiers": [
    {
      "name": "Descuento anticipado",
      "price": 120000,
      "validUntil": "2025-02-15T00:00:00.000Z",
      "paymentOptions": ["Un pago", "3 cuotas de $40.000"]
    }
  ],
  "maxParticipants": 20,
  "status": "active",
  "targetAudience": [
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
  ],
  "foodInfo": {
    "foodType": "Crudivegana, 100% orgánica",
    "description": "Alimentación consciente preparada con amor",
    "restrictions": ["Sin gluten", "Sin lácteos", "Sin azúcar refinada"]
  },
  "policies": {
    "substanceFree": true,
    "restrictions": ["Sin tabaco", "Sin alcohol", "Sin drogas"],
    "cancellationPolicy": "Reembolso del 50% hasta 15 días antes del retiro"
  },
  "highlightWords": ["Yoga", "Meditación", "Sierras"],
  "showInHero": true,
  "whatsappNumber": "+54 9 351 123-4567"
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
  "interest": "reservar",
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
    "email": "juan.perez@email.com",
    "phone": "+54 9 11 1234-5678",
    "status": "nuevo",
    "paymentStatus": "pendiente",
    "interest": "reservar",
    "source": "landing",
    "retreat": "64f8b2c1234567890abcdef1",
    "createdAt": "2025-01-28T20:00:00.000Z",
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
- **Campos extensos**: 30+ campos incluyendo:
  - Información básica (title, description, shortDescription)
  - Público objetivo (targetAudience) y experiencias
  - Ubicación completa con características y cómo llegar
  - Precios escalonados (pricingTiers) con descuentos por fecha
  - Alimentación detallada (foodInfo)
  - Políticas y restricciones (policies)
  - Multimedia (images, heroImageIndex, highlightWords)
  - SEO (slug auto-generado)
- **Campos virtuales**: durationDays, availableSpots, computedStatus, effectivePrice, activePricingTier
- **Validaciones**: Fechas, precios, capacidad, heroImageIndex, enums
- **Endpoints públicos y protegidos**

#### Entidad Relacionada: Testimonios (Categorías)
- **Relación con Retiros**: Referencia mediante ObjectId
- **Populate automático**: Carga información del retiro asociado
- **CRUD Completo** con aprobación manual
- **Sistema de tokens** para envío público seguro
- **Campos adicionales**: participantPhoto, token, approvedAt, notes
- **Campo virtual**: stars (representación visual del rating)
- **Middleware**: Auto-actualización de approvedAt
- **Destacados** para mostrar en landing page

#### Entidades Adicionales
- **Leads**: Gestión completa de interesados con:
  - Relación a Retiros
  - Estados de lead (nuevo, contactado, interesado, confirmado, descartado)
  - Estados de pago (pendiente, seña, completo)
  - Métodos de pago (transferencia, mercadopago, efectivo)
  - Tipos de interés (reservar, info, consulta)
  - Fuentes (landing, instagram, facebook, referido, otro)
  - Campo virtual isConfirmed
  - Índice único email+retreat
- **Users**: Administradores con autenticación JWT
  - Bcrypt con 12 salt rounds
  - Métodos comparePassword y generateAuthToken
  - Campo password con select: false
- **Settings**: Configuración global del sitio (singleton)
  - Información del facilitador
  - Redes sociales
  - Textos personalizables
  - Tema de colores
  - Configuración de emails
- **TestimonialTokens**: Tokens únicos con:
  - Generación automática con crypto
  - Expiración de 30 días
  - TTL index para auto-eliminación
  - Campos virtuales isExpired e isValid
  - Métodos estáticos generateForRetreat y validateToken

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

#### Manejo de Errores Centralizado
- ✅ **AppError**: Clase personalizada de errores con statusCode, code, details, isOperational
- ✅ **errorHandler**: Middleware centralizado que:
  - Mapea errores de Mongoose (CastError, ValidationError, E11000)
  - Mapea errores de JWT (TokenExpiredError, JsonWebTokenError)
  - Transforma todos los errores a formato uniforme
  - Oculta detalles sensibles en producción
- ✅ **Factory methods**: `AppError.badRequest()`, `AppError.unauthorized()`, `AppError.notFound()`, etc.
- ✅ **Códigos HTTP apropiados**: 200, 201, 400, 401, 404, 409, 422, 500
- ✅ **Logging condicional**: Verbose en desarrollo, solo errores no operacionales en producción

---

## 📚 Recursos Adicionales

### Frontend (Cliente React)
El proyecto incluye un cliente frontend completo que consume la API:
- Landing page con scroll suave
- Panel de administración (CRUD completo)
- Integración con Cloudinary
- Autenticación con Context API
- Diseño responsive con Bootstrap

### Demo y Deployment
- **Backend (API)**: https://soul-experiences.onrender.com/api
- **Frontend**: https://clariweb.onrender.com

---

## 📄 Licencia y Contacto

**Desarrollado por**: Adrián Cerini  
**Repositorio**: [GitHub - Soul Experiences](https://github.com/CeriniA/Soul-Experiences)  
**Año**: 2024-2025

Este proyecto fue desarrollado como parte del Trabajo Práctico de Desarrollo de Aplicaciones Web.

