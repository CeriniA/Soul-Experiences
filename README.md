# Soul Experiences - Plataforma de Retiros de Bienestar

## 📋 Descripción del Proyecto

Soul Experiences es una plataforma web completa para la gestión y promoción de retiros de transformación y autoconocimiento. El proyecto incluye un sitio web público para mostrar los retiros y un panel de administración completo para gestionar contenido, testimonios y configuraciones.

## 🛠️ Stack Tecnológico

- **Frontend**: React + Vite + Bootstrap
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: bcrypt para contraseñas
- **Imágenes**: Cloudinary para gestión de imágenes
- **Seguridad**: CORS, Helmet, Variables de entorno

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
soul-experiences/
├── frontend/                    # Aplicación React con Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── admin/         # Componentes del panel de admin
│   │   │   └── common/        # Componentes comunes
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Servicios para API calls
│   │   ├── contexts/          # Context API (AuthContext)
│   │   └── assets/            # Recursos estáticos
│   └── public/                # Archivos públicos
├── backend/                    # API REST con Express
│   ├── models/                # Modelos de MongoDB (Mongoose)
│   ├── services/              # Capa de servicios (lógica de negocio)
│   ├── controllers/           # Controladores HTTP (manejo de requests)
│   ├── routes/                # Definición de rutas de la API
│   ├── middleware/            # Middlewares personalizados
│   ├── config/                # Configuraciones
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
  title: String,           // Título del retiro
  description: String,     // Descripción detallada
  startDate: Date,         // Fecha de inicio
  endDate: Date,          // Fecha de fin
  location: {             // Ubicación completa
    name: String,
    address: String,
    city: String,
    country: String
  },
  price: Number,          // Precio base
  images: [String],       // URLs de imágenes (Cloudinary)
  status: String,         // active, draft, completed, cancelled
  maxParticipants: Number
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

#### Usuarios
```javascript
{
  name: String,
  email: String,
  password: String,       // Hasheado con bcrypt
  role: String,          // admin, user
  isActive: Boolean
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
- `GET /api/retreats` - Obtener todos los retiros
- `GET /api/retreats/:id` - Obtener retiro por ID
- `POST /api/retreats` - Crear nuevo retiro (Admin)
- `PUT /api/retreats/:id` - Actualizar retiro (Admin)
- `DELETE /api/retreats/:id` - Eliminar retiro (Admin)
- `GET /api/retreats/active/current` - Obtener retiro activo para hero
- `GET /api/retreats/past` - Obtener retiros pasados
- `GET /api/retreats/hero-data` - Obtener datos para hero
- `POST /api/retreats/:id/inquiry` - Incrementar contador de consultas

### Testimonios (CRUD Completo con Relación)
- `GET /api/testimonials` - Obtener testimonios (con populate de retiros)
- `GET /api/testimonials/:id` - Obtener testimonio por ID
- `POST /api/testimonials` - Crear testimonio (Admin)
- `PUT /api/testimonials/:id` - Actualizar testimonio (Admin)
- `DELETE /api/testimonials/:id` - Eliminar testimonio (Admin)
- `POST /api/testimonials/submit/:token` - Enviar testimonio con token
- `GET /api/testimonials/validate/:token` - Validar token
- `GET /api/testimonials/featured/public` - Obtener testimonios destacados

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
- **Productos** → **Retiros**: Entidad principal con CRUD completo
- **Categorías** → **Testimonios**: Entidad relacionada con referencia a Retiros
- **Usuarios**: Sistema de autenticación completo

### ✅ Separación de Responsabilidades
- **Servicios** (`/services/`): Toda la lógica de negocio
- **Controladores** (`/controllers/`): Manejo de HTTP únicamente
- **Modelos** (`/models/`): Definición de esquemas y validaciones

### ✅ Relaciones con Populate
```javascript
// Ejemplo de populate en testimonios
const testimonials = await Testimonial.find()
  .populate('retreat', 'title startDate endDate');
```

### ✅ Seguridad y Configuración
- ✅ Encriptación con bcrypt
- ✅ Autenticación JWT
- ✅ Variables de entorno (.env)
- ✅ CORS habilitado
- ✅ Manejo de errores robusto

## 🚀 Scripts Disponibles

### Backend
- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm start` - Ejecutar en producción

### Frontend
- `npm run dev` - Servidor de desarrollo con Vite
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build

## 📱 Funcionalidades Principales

### Sitio Público
- Landing page con hero dinámico
- Información de retiros activos
- Testimonios de participantes
- Formulario de contacto
- Diseño responsive

### Panel de Administración
- Gestión completa de retiros (CRUD)
- Gestión de testimonios con aprobación
- Subida de imágenes a Cloudinary
- Dashboard con estadísticas
- Autenticación segura

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.
