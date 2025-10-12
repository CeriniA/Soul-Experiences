# 🚀 Quick Start - Deployment en 15 minutos

## Paso 1: MongoDB Atlas (3 min)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta → "Build a Database" → "Free" → "Create"
3. Usuario: `soulexperiences` / Password: (guarda esto)
4. Network Access → "Add IP Address" → "Allow Access from Anywhere" → `0.0.0.0/0`
5. Database → "Connect" → "Connect your application" → Copia el string:
   ```
   mongodb+srv://soulexperiences:<password>@cluster0.xxxxx.mongodb.net/soul-experiences
   ```

## Paso 2: Gmail App Password (2 min)

1. Ve a https://myaccount.google.com/security
2. Verificación en 2 pasos → Activar (si no está)
3. Contraseñas de aplicaciones → "Correo" → Generar
4. Copia la contraseña de 16 caracteres

## Paso 3: Cloudinary API Keys (1 min)

1. Ve a https://cloudinary.com/console
2. Dashboard → Copia:
   - Cloud Name: `damnyicqx`
   - API Key: `xxxxxxxxxxxxx`
   - API Secret: `xxxxxxxxxxxxx`

## Paso 4: Render - Backend (4 min)

1. Ve a https://render.com → Login con GitHub
2. "New +" → "Web Service" → Conecta tu repo
3. Configuración:
   - Name: `soul-experiences-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://soulexperiences:TU_PASSWORD@cluster0.xxxxx.mongodb.net/soul-experiences
   JWT_SECRET=cambiar_por_algo_aleatorio_muy_largo_y_seguro_123456789
   JWT_EXPIRE=7d
   CORS_ORIGINS=https://soul-experiences-frontend.onrender.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASSWORD=tu_app_password_de_16_caracteres
   EMAIL_FROM=Soul Experiences <tu-email@gmail.com>
   CLOUDINARY_CLOUD_NAME=damnyicqx
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   FRONTEND_URL=https://soul-experiences-frontend.onrender.com
   ```

5. "Create Web Service" → **Copia la URL** (ej: `https://soul-experiences-backend.onrender.com`)

## Paso 5: Render - Frontend (3 min)

1. En Render, "New +" → "Static Site" → Mismo repo
2. Configuración:
   - Name: `soul-experiences-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://soul-experiences-backend.onrender.com
   ```
   (Usa la URL que copiaste en el paso anterior)

4. "Create Static Site"

## Paso 6: Actualizar CORS (1 min)

1. Vuelve al servicio del **backend** en Render
2. Environment → Edita `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://soul-experiences-frontend.onrender.com
   ```
   (Usa la URL del frontend que acabas de crear)
3. Guarda → El servicio se reiniciará

## Paso 7: Crear Admin (1 min)

1. Abre tu frontend: `https://soul-experiences-frontend.onrender.com`
2. Abre DevTools (F12) → Console
3. Ejecuta:
   ```javascript
   fetch('https://soul-experiences-backend.onrender.com/api/auth/create-admin', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'Clarisa',
       email: 'clarisa@soulexperiences.com',
       password: 'tu_password_seguro'
     })
   }).then(r => r.json()).then(console.log)
   ```

4. O usa el endpoint desde Postman/Thunder Client

## ✅ ¡Listo!

Tu app está en producción:
- **Frontend**: https://soul-experiences-frontend.onrender.com
- **Admin**: https://soul-experiences-frontend.onrender.com/admin
- **Backend**: https://soul-experiences-backend.onrender.com

### Próximos pasos:
1. Login con el usuario admin que creaste
2. Configurar el sitio (Settings)
3. Subir fotos de Clarisa
4. Crear retiros reales
5. ¡Compartir el link!

---

## 🐛 Troubleshooting Rápido

**Backend no responde:**
- Espera 30 segundos (se está despertando del sleep mode)
- Revisa logs en Render

**CORS Error:**
- Verifica que CORS_ORIGINS tenga la URL correcta del frontend
- Sin espacios, sin barra final

**No puedo crear admin:**
- Verifica que el backend esté corriendo
- Usa la URL correcta del backend
- Revisa logs para ver el error

**Emails no llegan:**
- Verifica App Password de Gmail
- Revisa spam
- Revisa logs del backend
