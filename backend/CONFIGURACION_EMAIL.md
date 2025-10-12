# 📧 Configuración del Sistema de Emails

## 🎯 Resumen
El sistema envía automáticamente emails a los participantes cuando se generan tokens de testimonio.

---

## 📋 Pasos de Configuración

### 1. Instalar Dependencias

```bash
cd backend
npm install nodemailer
```

### 2. Configurar Variables de Entorno

Agrega estas líneas a tu archivo `.env`:

```env
# Configuración de Email (Gmail)
EMAIL_USER=adriancerini@gmail.com
EMAIL_PASSWORD=wwod nebs oqzi uuyb
FRONTEND_URL=http://localhost:3000
```

### 3. Obtener Contraseña de Aplicación de Gmail

⚠️ **IMPORTANTE**: NO uses tu contraseña normal de Gmail.

**Pasos**:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Click en **"Seguridad"** (menú izquierdo)
3. Busca **"Verificación en 2 pasos"**
   - Si no está activada, actívala primero
4. Una vez activada, busca **"Contraseñas de aplicaciones"**
5. Click en **"Contraseñas de aplicaciones"**
6. Selecciona:
   - **Aplicación**: Correo
   - **Dispositivo**: Otro (nombre personalizado)
   - Escribe: "Soul Experiences Backend"
7. Click en **"Generar"**
8. **Copia la contraseña de 16 caracteres** que aparece
9. Pégala en tu archivo `.env` como `EMAIL_PASSWORD`

---

## 🧪 Probar la Configuración

### Opción 1: Desde el Código

Agrega esto temporalmente en `server.js`:

```javascript
import emailService from './services/emailService.js';

// Después de conectar a MongoDB
emailService.verifyConnection().then(isValid => {
  if (isValid) {
    console.log('✅ Configuración de email correcta');
  } else {
    console.log('❌ Error en configuración de email');
  }
});
```

### Opción 2: Generar Tokens de Prueba

1. Crea un retiro completado
2. Agrega participantes confirmados con emails reales
3. Genera tokens desde el admin panel
4. Revisa la consola del backend para ver los logs de envío

---

## 📧 Contenido del Email

Los participantes recibirán un email con:

- ✨ Diseño profesional con colores de Soul Experiences
- 💬 Botón para dejar testimonio
- 📝 Explicación de qué incluye
- ⏰ Fecha de expiración del token
- 📍 Información de contacto

**Vista previa del email**:
- Header con gradiente púrpura/malva
- Saludo personalizado con nombre del participante
- Botón dorado "Dejar mi Testimonio"
- Información del retiro
- Footer con datos de contacto

---

## 🔧 Solución de Problemas

### Error: "Invalid login"
- Verifica que EMAIL_USER sea correcto
- Asegúrate de usar una **contraseña de aplicación**, no tu contraseña normal
- Verifica que la verificación en 2 pasos esté activada

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Algunos firewalls bloquean el puerto 587/465
- Prueba con otra red

### Emails no llegan
- Revisa la carpeta de SPAM
- Verifica que el email del participante sea correcto
- Revisa los logs del backend para ver errores específicos

### Emails llegan pero sin formato
- El cliente de email no soporta HTML
- El contenido en texto plano se enviará automáticamente

---

## 🚀 Alternativas a Gmail

### SendGrid (Recomendado para Producción)

```bash
npm install @sendgrid/mail
```

```env
SENDGRID_API_KEY=tu_api_key_aqui
EMAIL_FROM=holasoul.experiences@gmail.com
```

**Ventajas**:
- Más confiable para producción
- 100 emails gratis por día
- Mejor deliverability
- Analytics incluidos

### Resend (Moderna y Simple)

```bash
npm install resend
```

```env
RESEND_API_KEY=tu_api_key_aqui
EMAIL_FROM=holasoul.experiences@gmail.com
```

**Ventajas**:
- API muy simple
- 100 emails gratis por día
- Excelente para desarrollo

---

## 📊 Logs y Monitoreo

El sistema registra en consola:

```
📧 Enviando 5 emails...
✅ Email enviado a: participante1@email.com
✅ Email enviado a: participante2@email.com
❌ Error enviando email a participante3@email.com: Invalid email
✅ Email enviado a: participante4@email.com
✅ Email enviado a: participante5@email.com
📊 Resultados: 4 enviados, 1 fallidos
```

---

## ✅ Checklist de Configuración

- [ ] Nodemailer instalado
- [ ] Variables de entorno configuradas
- [ ] Contraseña de aplicación de Gmail generada
- [ ] Verificación en 2 pasos activada
- [ ] Conexión verificada
- [ ] Email de prueba enviado exitosamente

---

## 🎉 ¡Listo!

Una vez configurado, cada vez que generes tokens desde el admin panel:

1. Se crean los tokens en la base de datos
2. Se envían emails automáticamente a cada participante
3. Los participantes reciben un link único
4. Pueden dejar su testimonio con un click

**El sistema está completamente automatizado.** 🚀
