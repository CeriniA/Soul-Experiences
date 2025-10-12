# 🚀 Guía de Deployment - Soul Experiences

## 📋 Índice
1. [Opciones de Hosting](#opciones-de-hosting)
2. [Preparación del Proyecto](#preparación-del-proyecto)
3. [Deployment en Render (Recomendado)](#deployment-en-render)
4. [Deployment en Railway](#deployment-en-railway)
5. [Deployment en Vercel + MongoDB Atlas](#deployment-en-vercel)
6. [Variables de Entorno](#variables-de-entorno)
7. [Post-Deployment](#post-deployment)

---

## 🎯 Opciones de Hosting

### Opción 1: **Render** (Recomendado - Todo en uno)
- ✅ **Gratis**: Plan free tier generoso
- ✅ **Backend + Frontend**: Ambos en un solo lugar
- ✅ **MongoDB**: Incluye base de datos
- ✅ **SSL**: Certificado HTTPS automático
- ✅ **Fácil**: Deploy con GitHub en minutos
- ⚠️ **Limitación**: Se duerme después de 15 min de inactividad (plan free)

### Opción 2: **Railway**
- ✅ **Gratis**: $5 USD de crédito mensual
- ✅ **Rápido**: Deploy muy veloz
- ✅ **MongoDB**: Base de datos incluida
- ⚠️ **Limitación**: Crédito limitado

### Opción 3: **Vercel (Frontend) + MongoDB Atlas (DB)**
- ✅ **Vercel**: Excelente para frontend React
- ✅ **MongoDB Atlas**: Base de datos en la nube (gratis)
- ⚠️ **Limitación**: Necesitas hosting separado para backend (Render/Railway)

---

## 🔧 Preparación del Proyecto

### 1. Verificar que todo funciona localmente

```bash
# Backend
cd backend
npm start

# Frontend (otra terminal)
cd frontend
npm run dev
```

### 2. Crear archivo `.env.production` en backend

```bash
# Backend/.env.production
NODE_ENV=production
PORT=5000

# MongoDB Atlas (obtendrás esto después)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/soul-experiences

# JWT (genera uno nuevo y seguro)
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_esto_por_algo_aleatorio
JWT_EXPIRE=7d

# CORS (tu dominio de producción)
CORS_ORIGINS=https://tu-app.onrender.com,https://www.tu-dominio.com

# Email (Gmail o servicio SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_gmail
EMAIL_FROM=Soul Experiences <tu-email@gmail.com>

# Cloudinary
CLOUDINARY_CLOUD_NAME=damnyicqx
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Frontend URL
FRONTEND_URL=https://tu-app.onrender.com
```

### 3. Actualizar `vite.config.js` para producción

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          bootstrap: ['react-bootstrap', 'bootstrap']
        }
      }
    }
  }
})
```

### 4. Crear `.env.production` en frontend

```bash
# Frontend/.env.production
VITE_API_URL=https://tu-backend.onrender.com
```

---

## 🌐 Deployment en Render (RECOMENDADO)

### Paso 1: Crear cuenta en MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratis
3. Crea un cluster (elige la región más cercana)
4. En "Database Access" → Crea un usuario con password
5. En "Network Access" → Agrega `0.0.0.0/0` (permitir desde cualquier IP)
6. Copia tu connection string: `mongodb+srv://usuario:password@cluster.mongodb.net/soul-experiences`

### Paso 2: Preparar el repositorio

```bash
# Asegúrate de que todo esté commiteado
git add .
git commit -m "Preparar para producción"
git push origin master
```

### Paso 3: Deploy del Backend en Render

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name**: `soul-experiences-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Variables de Entorno** (click en "Advanced"):
   ```
   NODE_ENV=production
   MONGODB_URI=tu_connection_string_de_atlas
   JWT_SECRET=genera_uno_aleatorio_seguro
   JWT_EXPIRE=7d
   CORS_ORIGINS=https://tu-frontend.onrender.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASSWORD=tu_app_password
   EMAIL_FROM=Soul Experiences <tu-email@gmail.com>
   CLOUDINARY_CLOUD_NAME=damnyicqx
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

6. Click "Create Web Service"
7. **Copia la URL** del backend (ej: `https://soul-experiences-backend.onrender.com`)

### Paso 4: Deploy del Frontend en Render

1. En Render, click "New +" → "Static Site"
2. Conecta el mismo repositorio
3. Configuración:
   - **Name**: `soul-experiences-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Variables de Entorno**:
   ```
   VITE_API_URL=https://soul-experiences-backend.onrender.com
   ```

5. Click "Create Static Site"

### Paso 5: Actualizar CORS en Backend

1. Ve al servicio del backend en Render
2. Actualiza la variable `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://soul-experiences-frontend.onrender.com
   ```
3. El servicio se reiniciará automáticamente

### Paso 6: Seed de Datos Iniciales

```bash
# Conectarte a tu backend en producción
# Opción 1: Usar Render Shell
# En Render → Tu servicio → Shell → Ejecutar:
npm run seed

# Opción 2: Crear un endpoint temporal de seed (ELIMINAR DESPUÉS)
# Agregar en backend/routes/index.js:
router.post('/api/seed', async (req, res) => {
  // Solo permitir en desarrollo o con token especial
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'No disponible en producción' });
  }
  // Ejecutar seed...
});
```

---

## 🚂 Deployment en Railway (Alternativa)

### Paso 1: Crear cuenta en Railway

1. Ve a [Railway.app](https://railway.app)
2. Crea cuenta con GitHub
3. Obtienes $5 USD gratis al mes

### Paso 2: Deploy Backend + MongoDB

1. Click "New Project" → "Deploy from GitHub repo"
2. Selecciona tu repositorio
3. Railway detectará automáticamente Node.js
4. Agrega MongoDB:
   - Click "+ New" → "Database" → "MongoDB"
   - Railway creará una instancia automáticamente
   - Copia la variable `MONGO_URL`

5. Configura variables de entorno (igual que Render)
6. En Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

### Paso 3: Deploy Frontend

1. En el mismo proyecto, click "+ New" → "GitHub Repo"
2. Configuración:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s dist`

---

## ⚙️ Variables de Entorno Completas

### Backend (.env.production)

```bash
# Servidor
NODE_ENV=production
PORT=5000

# Base de Datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/soul-experiences

# JWT
JWT_SECRET=crea_un_string_aleatorio_muy_largo_y_seguro_aqui
JWT_EXPIRE=7d

# CORS
CORS_ORIGINS=https://tu-frontend.com,https://www.tu-dominio.com

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_gmail
EMAIL_FROM=Soul Experiences <tu-email@gmail.com>

# Cloudinary
CLOUDINARY_CLOUD_NAME=damnyicqx
CLOUDINARY_API_KEY=obtener_de_cloudinary_dashboard
CLOUDINARY_API_SECRET=obtener_de_cloudinary_dashboard

# URLs
FRONTEND_URL=https://tu-frontend.com
```

### Frontend (.env.production)

```bash
VITE_API_URL=https://tu-backend.onrender.com
```

---

## 📧 Configurar Gmail para Emails

### Opción 1: App Password (Recomendado)

1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (actívala si no está)
3. Contraseñas de aplicaciones
4. Genera una contraseña para "Correo"
5. Usa esa contraseña en `EMAIL_PASSWORD`

### Opción 2: Gmail API (Más seguro pero complejo)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto
3. Habilita Gmail API
4. Crea credenciales OAuth 2.0
5. Configura en el backend

---

## ✅ Post-Deployment Checklist

### 1. Verificar que todo funciona

- [ ] Backend responde en `/api/health` o `/api/settings`
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] Crear/editar retiros funciona
- [ ] Subida de imágenes a Cloudinary funciona
- [ ] Envío de emails funciona
- [ ] Generación de tokens funciona
- [ ] Testimonios públicos funcionan

### 2. Crear usuario admin

```bash
# Opción 1: Usar el endpoint de creación
POST https://tu-backend.com/api/auth/create-admin
{
  "name": "Clarisa",
  "email": "clarisa@soulexperiences.com",
  "password": "tu_password_seguro"
}

# Opción 2: Ejecutar seed en producción (una sola vez)
```

### 3. Configurar dominio personalizado (Opcional)

#### En Render:
1. Ve a tu servicio → Settings → Custom Domain
2. Agrega tu dominio (ej: `www.soulexperiences.com`)
3. Configura DNS en tu proveedor:
   ```
   CNAME www soul-experiences-frontend.onrender.com
   ```

### 4. Monitoreo

- **Render**: Dashboard muestra logs en tiempo real
- **Railway**: Logs disponibles en cada servicio
- **MongoDB Atlas**: Monitorea uso de base de datos

### 5. Backups

- **MongoDB Atlas**: Backups automáticos en plan free
- **Código**: Ya está en GitHub
- **Imágenes**: Cloudinary las guarda automáticamente

---

## 🐛 Troubleshooting Común

### Error: "Cannot connect to MongoDB"
- Verifica que la IP `0.0.0.0/0` esté permitida en MongoDB Atlas
- Verifica que el connection string sea correcto
- Verifica que el usuario de DB tenga permisos

### Error: "CORS policy"
- Verifica que `CORS_ORIGINS` incluya la URL del frontend
- Verifica que no haya espacios en la variable

### Error: "Cannot send emails"
- Verifica que App Password de Gmail esté correcto
- Verifica que EMAIL_HOST y EMAIL_PORT sean correctos
- Revisa los logs para ver el error específico

### Frontend no se conecta al Backend
- Verifica que `VITE_API_URL` apunte al backend correcto
- Verifica que el backend esté corriendo
- Abre DevTools → Network para ver las requests

### Render service "sleeping"
- Plan free se duerme después de 15 min
- Primera request tarda ~30 segundos en despertar
- Considera upgrade a plan paid ($7/mes) si es problema

---

## 💰 Costos Estimados

### Plan Gratuito (Recomendado para empezar):
- **Render**: Free (con limitaciones)
- **MongoDB Atlas**: Free (512 MB)
- **Cloudinary**: Free (25 GB storage, 25 GB bandwidth)
- **Total**: $0/mes

### Plan Básico (Sin limitaciones):
- **Render**: $7/mes (backend) + $0 (frontend estático)
- **MongoDB Atlas**: Free o $9/mes (2 GB)
- **Cloudinary**: Free o $89/mes (si necesitas más)
- **Total**: ~$7-16/mes

---

## 📞 Soporte

Si tienes problemas durante el deployment:
1. Revisa los logs en Render/Railway
2. Verifica las variables de entorno
3. Prueba localmente primero
4. Consulta la documentación oficial

---

## 🎉 ¡Listo!

Tu aplicación está en producción. Ahora puedes:
- Compartir el link con clientes
- Probar en dispositivos reales
- Configurar Google Analytics (opcional)
- Configurar dominio personalizado
- Monitorear el uso

**URLs de ejemplo:**
- Frontend: `https://soul-experiences-frontend.onrender.com`
- Backend: `https://soul-experiences-backend.onrender.com`
- Admin: `https://soul-experiences-frontend.onrender.com/admin`
