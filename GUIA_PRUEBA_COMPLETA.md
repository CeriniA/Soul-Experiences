# 🧪 GUÍA DE PRUEBA COMPLETA DEL SISTEMA

## 📋 Objetivo
Probar todo el flujo del sistema desde cero: crear retiro, recibir leads, gestionar estados, generar tokens y testimonios.

---

## 🚀 PASO 1: Limpiar y Poblar la Base de Datos

### 1.1 Limpiar BD
```bash
cd backend
node scripts/cleanDatabase.js
```

**Resultado esperado**:
```
✅ Retiros: X documento(s) eliminado(s)
✅ Leads: X documento(s) eliminado(s)
✅ Testimonios: X documento(s) eliminado(s)
✅ Tokens: X documento(s) eliminado(s)
✅ Configuración: X documento(s) eliminado(s)
ℹ️  Usuarios: 1 (no se eliminan)
```

### 1.2 Poblar BD con Retiro Completo
```bash
node scripts/seedDatabase.js
```

**Resultado esperado**:
```
✅ Configuración creada
✅ Retiro creado exitosamente

📊 RESUMEN:
   • Retiro: "Retiro de Año Nuevo 2026 - Celebración Consciente"
   • Fechas: 29/12/2025 - 02/01/2026
   • Precio: $1.111.111 ARS
   • Capacidad: 24 personas
   • Estado: active
```

---

## 🌐 PASO 2: Verificar Frontend (Landing Page)

### 2.1 Iniciar Servidores

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 2.2 Abrir Landing Page
- URL: `http://localhost:5173` o `http://localhost:3000`

### 2.3 Verificaciones Visuales

✅ **Hero Section**:
- [ ] Aparece el retiro "AÑO NUEVO 2026"
- [ ] Se ven las fechas: 29 dic 2025 - 2 ene 2026
- [ ] Se muestra el precio: $1.111.111
- [ ] Aparece "24 lugares disponibles"
- [ ] Palabras resaltadas: "AÑO NUEVO", "2026", "CELEBRACIÓN CONSCIENTE"

✅ **Sección Retiros**:
- [ ] Card del retiro visible
- [ ] Información completa
- [ ] Botón "Reservar Mi Plaza"

✅ **Sección Testimonios**:
- [ ] Aparece vacía (aún no hay testimonios)

✅ **Sección Contacto**:
- [ ] Email: holasoul.experiences@gmail.com
- [ ] WhatsApp visible
- [ ] Botones funcionando

---

## 👤 PASO 3: Crear Lead (Simular Usuario Interesado)

### 3.1 Completar Formulario de Contacto

**Ir a la sección "Contacto"** o hacer clic en "Reservar Mi Plaza"

**Datos de prueba**:
```
Nombre: María González
Email: maria.gonzalez@email.com
Teléfono: +54 9 351 123 4567
Mensaje: Hola! Me interesa mucho el retiro de Año Nuevo. 
         Quisiera saber si hay lugares disponibles y 
         las opciones de pago. Gracias!
```

### 3.2 Enviar Formulario

**Resultado esperado**:
- ✅ Mensaje de confirmación
- ✅ "Gracias por tu interés. Te contactaremos pronto."

---

## 🔐 PASO 4: Gestionar Lead en Admin Panel

### 4.1 Login al Admin Panel

- URL: `http://localhost:5173/admin/login`

**Credenciales** (si ya tienes usuario):
```
Email: tu_email@admin.com
Password: tu_password
```

**Si no tienes usuario**, crear uno:
```bash
# En Postman o Thunder Client
POST http://localhost:5000/api/auth/create-admin
Content-Type: application/json

{
  "name": "Admin Soul",
  "email": "admin@soul.com",
  "password": "admin123"
}
```

### 4.2 Ver el Lead Creado

**Navegar a**: Admin Panel → Leads

**Verificar**:
- [ ] Aparece "María González"
- [ ] Email: maria.gonzalez@email.com
- [ ] Estado: "nuevo" (badge amarillo)
- [ ] Pago: "pendiente"
- [ ] Retiro: "Retiro de Año Nuevo 2026"

### 4.3 Actualizar Estado del Lead

**Hacer clic en el lead** → Se abre el detalle

**Cambios a realizar**:

#### Paso 1: Contactar
```
Estado: nuevo → contactado
Notas: "Contactada por WhatsApp. Muy interesada. 
        Preguntó por opciones de pago."
```
- [ ] Guardar cambios
- [ ] Badge cambia a azul

#### Paso 2: Confirmar Interés
```
Estado: contactado → interesado
Pago: pendiente → seña
Monto: 333333 (30% de seña)
Método: transferencia
Notas: "Envió seña del 30%. Confirmó asistencia."
```
- [ ] Guardar cambios
- [ ] Badge cambia a verde claro

#### Paso 3: Confirmar Pago Completo
```
Estado: interesado → confirmado
Pago: seña → completo
Monto: 1111111 (total)
Notas: "Pago completo recibido. Plaza confirmada."
```
- [ ] Guardar cambios
- [ ] Badge cambia a verde oscuro
- [ ] **IMPORTANTE**: Ahora cuenta como participante confirmado

### 4.4 Verificar Disponibilidad del Retiro

**Navegar a**: Admin Panel → Retiros → "Año Nuevo 2026"

**Verificar**:
- [ ] Participantes Actuales: 1
- [ ] Lugares Disponibles: 23
- [ ] Progreso: 1/24

---

## 🎫 PASO 5: Generar Token de Testimonio

### 5.1 Crear Más Leads Confirmados (Opcional)

Para probar tokens múltiples, crea 2-3 leads más y confírmalos:

**Lead 2**:
```
Nombre: Juan Pérez
Email: juan.perez@email.com
Estado: confirmado
Pago: completo
```

**Lead 3**:
```
Nombre: Laura Martínez
Email: laura.martinez@email.com
Estado: confirmado
Pago: completo
```

### 5.2 Generar Tokens

**Navegar a**: Admin Panel → Tokens → "Generar Tokens"

**Seleccionar**:
- Retiro: "Retiro de Año Nuevo 2026"
- Cantidad: (dejar vacío para todos los confirmados)

**Hacer clic en**: "Generar Tokens"

**Resultado esperado**:
```
✅ 3 token(es) generado(s) exitosamente
📧 Emails enviados: 3
   • maria.gonzalez@email.com ✅
   • juan.perez@email.com ✅
   • laura.martinez@email.com ✅
```

### 5.3 Ver Tokens Generados

**Navegar a**: Admin Panel → Tokens

**Verificar**:
- [ ] Aparecen 3 tokens
- [ ] Estado: "No usado"
- [ ] Email de cada participante
- [ ] Fecha de expiración (30 días)

---

## 💬 PASO 6: Enviar Testimonio (Simular Participante)

### 6.1 Obtener Token

**En Admin Panel → Tokens**:
- Copiar el token de "María González"
- Ejemplo: `a1b2c3d4e5f6...`

### 6.2 Abrir Formulario de Testimonio

**URL**: `http://localhost:5173/testimonial/:token`

Reemplazar `:token` con el token copiado.

**Ejemplo**:
```
http://localhost:5173/testimonial/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 6.3 Completar Formulario de Testimonio

**Datos de prueba**:
```
Calificación: ⭐⭐⭐⭐⭐ (5 estrellas)

Comentario:
"Una experiencia transformadora que superó todas mis expectativas. 
El retiro de Año Nuevo fue exactamente lo que necesitaba para cerrar 
ciclos y comenzar el 2026 desde un lugar de paz y consciencia. 

Las ceremonias fueron profundas, la comida deliciosa, y el grupo 
humano increíble. Clarisa es una facilitadora excepcional que crea 
un espacio seguro para la transformación. 

Recomiendo 100% esta experiencia a cualquiera que busque reconectarse 
consigo mismo. ¡Gracias Soul Experiences!"

Foto: (opcional, subir una imagen)
```

### 6.4 Enviar Testimonio

**Hacer clic en**: "Enviar Testimonio"

**Resultado esperado**:
- ✅ Mensaje de confirmación
- ✅ "Testimonio enviado exitosamente. Será revisado antes de publicarse."

---

## ✅ PASO 7: Aprobar Testimonio (Admin)

### 7.1 Ver Testimonio Pendiente

**Navegar a**: Admin Panel → Testimonios

**Verificar**:
- [ ] Aparece testimonio de "María González"
- [ ] Estado: "Pendiente" (badge amarillo)
- [ ] Rating: 5 estrellas
- [ ] Comentario completo visible

### 7.2 Aprobar y Destacar

**Hacer clic en el testimonio** → Detalle

**Cambios**:
```
Aprobado: ✅ Sí
Destacado: ✅ Sí (para que aparezca en landing)
Notas: "Testimonio excelente. Destacar en landing."
```

**Guardar cambios**

### 7.3 Verificar en Landing Page

**Volver a**: `http://localhost:5173`

**Scroll hasta**: Sección "Testimonios"

**Verificar**:
- [ ] Aparece testimonio de María González
- [ ] 5 estrellas visibles
- [ ] Comentario completo
- [ ] Nombre del retiro: "Retiro de Año Nuevo 2026"

---

## 🎯 PASO 8: Verificar Token Usado

### 8.1 Ver Token en Admin

**Navegar a**: Admin Panel → Tokens

**Verificar token de María**:
- [ ] Estado: "Usado" (badge verde)
- [ ] Fecha de uso visible
- [ ] Link al testimonio creado

### 8.2 Intentar Usar Token Nuevamente

**Abrir nuevamente**: `http://localhost:5173/testimonial/:token`

**Resultado esperado**:
- ❌ Error: "Token inválido, expirado o ya utilizado"
- No permite enviar otro testimonio

---

## 📊 PASO 9: Verificar Estadísticas

### 9.1 Dashboard de Leads

**Navegar a**: Admin Panel → Leads → Stats

**Verificar**:
- [ ] Total de leads: 3
- [ ] Confirmados: 3
- [ ] Tasa de conversión: 100%
- [ ] Gráficos actualizados

### 9.2 Dashboard de Retiros

**Navegar a**: Admin Panel → Retiros → "Año Nuevo 2026"

**Verificar**:
- [ ] Participantes: 3/24
- [ ] Disponibilidad: 21 lugares
- [ ] Progreso: 12.5%
- [ ] Ingresos estimados: $3.333.333

---

## 🧹 PASO 10: Probar Eliminación y Actualización

### 10.1 Descartar un Lead

**Crear un nuevo lead** (desde landing):
```
Nombre: Pedro Descartado
Email: pedro@email.com
```

**En Admin Panel**:
- Cambiar estado a: "descartado"
- Notas: "No respondió a los mensajes"

**Verificar**:
- [ ] Badge rojo
- [ ] NO cuenta como participante
- [ ] Disponibilidad sigue en 21

### 10.2 Actualizar Retiro

**Navegar a**: Admin Panel → Retiros → Editar

**Cambios de prueba**:
```
Precio: 1.200.000 (aumentar)
Capacidad: 30 (aumentar)
```

**Guardar y verificar**:
- [ ] Cambios reflejados
- [ ] Disponibilidad recalculada: 27 lugares

### 10.3 Eliminar Testimonio

**Navegar a**: Admin Panel → Testimonios

**Seleccionar un testimonio** → Eliminar

**Confirmar eliminación**

**Verificar**:
- [ ] Desaparece del admin
- [ ] Desaparece de la landing

---

## ✅ CHECKLIST FINAL DE FUNCIONALIDADES

### Frontend (Landing Page)
- [ ] Hero dinámico con retiro activo
- [ ] Información de retiro completa
- [ ] Formulario de contacto funcional
- [ ] Testimonios destacados visibles
- [ ] Responsive en móvil
- [ ] Scroll suave entre secciones
- [ ] Botones de WhatsApp y email funcionando

### Admin Panel
- [ ] Login funcional
- [ ] Dashboard con estadísticas
- [ ] CRUD de retiros completo
- [ ] Gestión de leads con estados
- [ ] Actualización de disponibilidad automática
- [ ] Generación de tokens
- [ ] Gestión de testimonios
- [ ] Filtros y búsquedas funcionando

### Backend (API)
- [ ] Autenticación JWT
- [ ] CRUD de todas las entidades
- [ ] Cálculo dinámico de disponibilidad
- [ ] Validaciones de negocio
- [ ] Generación de tokens únicos
- [ ] Envío de emails (si está configurado)
- [ ] Manejo de errores correcto

### Base de Datos
- [ ] Relaciones entre colecciones correctas
- [ ] Índices funcionando
- [ ] Validaciones de schema
- [ ] Enums sincronizados
- [ ] TTL en tokens funcionando

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: No aparece el retiro en el Hero
**Solución**:
- Verificar que `status: 'active'`
- Verificar que `showInHero: true`
- Verificar que las fechas sean futuras

### Problema 2: Lead no cuenta como participante
**Solución**:
- Verificar que `status === 'confirmado'`
- Verificar que `paymentStatus === 'completo'`
- Ambos deben estar en ese estado

### Problema 3: Token no funciona
**Solución**:
- Verificar que no esté usado (`isUsed: false`)
- Verificar que no esté expirado (`expiresAt > now`)
- Copiar token completo sin espacios

### Problema 4: Testimonio no aparece en landing
**Solución**:
- Verificar que `isApproved: true`
- Verificar que `isFeatured: true`
- Ambos deben estar en true

### Problema 5: Emails no se envían
**Solución**:
- Verificar variables de entorno en `.env`
- Verificar configuración de Nodemailer
- Los tokens se crean igual, solo falla el email

---

## 📝 NOTAS FINALES

### Datos de Prueba Creados
```javascript
Retiro:
  • ID: (generado automáticamente)
  • Título: "Retiro de Año Nuevo 2026"
  • Fechas: 29/12/2025 - 02/01/2026
  • Precio: $1.111.111 ARS
  • Capacidad: 24 personas
  • Estado: active

Configuración:
  • Email: holasoul.experiences@gmail.com
  • WhatsApp: +5493512345678
  • Facilitadora: Clarisa Soul
```

### Próximos Pasos Sugeridos
1. ✅ Probar en diferentes navegadores
2. ✅ Probar en móvil
3. ✅ Verificar responsive design
4. ✅ Probar con múltiples leads simultáneos
5. ✅ Verificar performance con muchos datos

---

## 🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!

Si completaste todos los pasos, has probado:
- ✅ Creación de retiros
- ✅ Gestión de leads
- ✅ Cálculo de disponibilidad
- ✅ Generación de tokens
- ✅ Envío de testimonios
- ✅ Aprobación y publicación
- ✅ Landing page dinámica
- ✅ Admin panel completo

**El sistema está listo para producción.** 🚀
