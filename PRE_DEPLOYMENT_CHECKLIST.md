# ✅ Pre-Deployment Checklist

## 📋 Antes de Deployar

### 1. Código Limpio
- [ ] Todo commiteado y pusheado a GitHub
- [ ] No hay `console.log` innecesarios
- [ ] No hay comentarios de debug
- [ ] No hay archivos temporales

### 2. Variables de Entorno
- [ ] Crear `.env.production` en backend con valores reales
- [ ] Crear `.env.production` en frontend con URL del backend
- [ ] Verificar que `.env` NO esté en Git (debe estar en `.gitignore`)
- [ ] Generar JWT_SECRET aleatorio y seguro

### 3. Base de Datos
- [ ] Crear cuenta en MongoDB Atlas
- [ ] Crear cluster gratuito
- [ ] Crear usuario de base de datos
- [ ] Permitir acceso desde cualquier IP (0.0.0.0/0)
- [ ] Copiar connection string

### 4. Email
- [ ] Configurar App Password en Gmail
- [ ] Verificar que EMAIL_USER y EMAIL_PASSWORD sean correctos
- [ ] Probar envío de email localmente

### 5. Cloudinary
- [ ] Verificar que CLOUDINARY_CLOUD_NAME sea correcto
- [ ] Obtener API_KEY y API_SECRET del dashboard
- [ ] Verificar que el upload preset sea "unsigned"

### 6. Testing Local
- [ ] Backend funciona con `npm start`
- [ ] Frontend funciona con `npm run dev`
- [ ] Login funciona
- [ ] CRUD de retiros funciona
- [ ] Subida de imágenes funciona
- [ ] Envío de emails funciona
- [ ] Generación de tokens funciona
- [ ] Testimonios públicos funcionan

### 7. Build de Producción
```bash
# Frontend - verificar que el build funcione
cd frontend
npm run build
npm run preview  # Probar el build localmente
```

### 8. Datos Iniciales
- [ ] Decidir si usar seed o crear datos manualmente
- [ ] Tener listas las credenciales del admin
- [ ] Tener lista la configuración del sitio

---

## 🚀 Durante el Deployment

### Render - Backend
1. [ ] Crear Web Service
2. [ ] Conectar repositorio de GitHub
3. [ ] Configurar Root Directory: `backend`
4. [ ] Build Command: `npm install`
5. [ ] Start Command: `npm start`
6. [ ] Agregar TODAS las variables de entorno
7. [ ] Deploy y copiar URL

### Render - Frontend
1. [ ] Crear Static Site
2. [ ] Conectar mismo repositorio
3. [ ] Configurar Root Directory: `frontend`
4. [ ] Build Command: `npm install && npm run build`
5. [ ] Publish Directory: `dist`
6. [ ] Agregar variable VITE_API_URL con URL del backend
7. [ ] Deploy y copiar URL

### Actualizar CORS
1. [ ] Volver al backend en Render
2. [ ] Actualizar CORS_ORIGINS con URL del frontend
3. [ ] Guardar (se reiniciará automáticamente)

---

## ✅ Post-Deployment

### Verificación Básica
- [ ] Frontend carga sin errores
- [ ] Backend responde en `/api/settings`
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs de Render

### Crear Usuario Admin
```bash
# Opción 1: Endpoint de creación (si está habilitado)
POST https://tu-backend.com/api/auth/create-admin
{
  "name": "Clarisa",
  "email": "clarisa@soulexperiences.com",
  "password": "tu_password_seguro"
}

# Opción 2: Usar Render Shell
# En Render → Backend Service → Shell
node backend/scripts/seedDatabase.js
```

### Testing Completo
- [ ] Login con usuario admin
- [ ] Crear un retiro de prueba
- [ ] Subir imágenes
- [ ] Cambiar estado del retiro
- [ ] Generar tokens (si el retiro está completado)
- [ ] Verificar que llegue el email
- [ ] Abrir link del token y dejar testimonio
- [ ] Verificar que el testimonio aparezca en admin

### Configuración Final
- [ ] Actualizar configuración del sitio (nombre, descripción, etc.)
- [ ] Subir fotos de Clarisa
- [ ] Crear retiros reales
- [ ] Configurar dominio personalizado (opcional)

---

## 🐛 Si Algo Sale Mal

### Backend no inicia
1. Revisar logs en Render
2. Verificar variables de entorno
3. Verificar connection string de MongoDB
4. Verificar que todas las dependencias estén en `package.json`

### Frontend no se conecta al Backend
1. Verificar que VITE_API_URL sea correcto
2. Verificar que CORS_ORIGINS incluya la URL del frontend
3. Abrir DevTools → Network para ver las requests
4. Verificar que el backend esté corriendo

### Emails no se envían
1. Verificar App Password de Gmail
2. Verificar EMAIL_HOST y EMAIL_PORT
3. Revisar logs del backend para ver el error
4. Probar con otro servicio SMTP si Gmail no funciona

### Imágenes no se suben
1. Verificar credenciales de Cloudinary
2. Verificar que el upload preset sea correcto
3. Verificar límites del plan free
4. Revisar logs del backend

---

## 📞 Recursos Útiles

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## 🎉 ¡Éxito!

Una vez que todo funcione:
1. Comparte el link con Clarisa
2. Prueba en diferentes dispositivos
3. Monitorea los logs por si hay errores
4. Considera configurar un dominio personalizado
5. ¡Celebra! 🎊
