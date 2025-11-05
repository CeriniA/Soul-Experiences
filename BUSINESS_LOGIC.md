# Lógicas de Negocio - Soul Experiences

> Última actualización: noviembre 2025
>
> Este documento resume los flujos principales del backend. Incluye disparadores, validaciones, endpoints y decisiones clave para que cualquier miembro del equipo pueda entender “qué pasa detrás” de cada módulo.

---

## Índice

1. [Autenticación y Sesiones](#autenticación-y-sesiones)
2. [Middleware y Manejo de Errores](#middleware-y-manejo-de-errores)
3. [Gestión de Retiros](#gestión-de-retiros)
4. [Gestión de Leads](#gestión-de-leads)
5. [Testimonios y Tokens](#testimonios-y-tokens)
6. [Configuración del Sitio (Settings)](#configuración-del-sitio-settings)
7. [Emails Transaccionales](#emails-transaccionales)
8. [Estructura de Endpoints](#estructura-de-endpoints)
9. [Notas Operativas](#notas-operativas)

---

## Autenticación y Sesiones

**Modelo:** `backend/models/User.js`

- Usuarios administradores con email/contraseña (bcrypt, 12 salt rounds).
- `generateAuthToken()` genera JWT (default 7 días, configurable vía `JWT_EXPIRE`).
- Los tokens se envían en **cookies HttpOnly** (`token`) al hacer login.

**Servicio:** `backend/services/userService.js`

- `authenticateUser(email, password)` valida credenciales, actualiza `lastLogin`, emite token.
- `changeUserPassword` exige contraseña actual y nueva; valida y guarda hash.
- `createAdminUser` permite crear el primer admin **solo si no existen usuarios**.

**Controlador:** `backend/controllers/authController.js`

| Endpoint | Método | Acceso | Lógica clave |
|----------|--------|--------|--------------|
| `/api/auth/login` | POST | Público | Valida credenciales y setea cookie JWT con `secure/sameSite` según entorno.
| `/api/auth/me` | GET | `protect` | Devuelve perfil del admin (id, nombre, email, timestamps).
| `/api/auth/logout` | POST | `protect` | Limpia cookie `token`.
| `/api/auth/change-password` | PUT | `protect` | Cambia contraseña usando servicio.
| `/api/auth/create-admin` | POST | Público | Solo funciona si no hay admins creados.

**Middleware:** `backend/middleware/auth.js`

- `protect`: lee token (header Bearer o cookie), verifica con `JWT_SECRET`, carga `req.user` o lanza `AppError.unauthorized`.
- Cuando el token expira, `jwt.verify` lanza `TokenExpiredError`; el `errorHandler` lo mapea a 401 con código `token_expired`.
- `optionalAuth`: intenta autenticar pero no corta la request si no hay token/ es inválido.

**Frontend:** `frontend/src/contexts/AuthContext.jsx`

- Usa `authAPI.getMe()` en `useEffect` inicial para hidratar sesión.
- Interceptor de `axios` (`frontend/src/services/api.js`) detecta 401 con `code=unauthorized`; si el path actual es `/admin`, dispara evento `auth:expired` → redirige a `/admin/login`.

---

## Middleware y Manejo de Errores

**Error Base:** `backend/utils/AppError.js`
- Clase custom con `statusCode`, `code`, `details`, `isOperational`, `expose`.
- Helpers estáticos (`badRequest`, `unauthorized`, etc.).

**Wrapper Async:** `backend/utils/asyncHandler.js`
- Envoltura para controladores async; forwardea errores a `next`.

**Error Handler Central:** `backend/middleware/errorHandler.js`
- Mapea:
  - `AppError` (responde con datos tal cual).
  - Errores de Mongoose (Validation, Cast, E11000 duplicados).
  - `TokenExpiredError` / `JsonWebTokenError`.
- Fallback: envuelve errores desconocidos en `AppError` 500.
- Responde JSON uniforme `{ success: false, error, message, code, path, method, timestamp }` y opcional `details`.

---

## Gestión de Retiros

**Modelo:** `backend/models/Retreat.js`
- Campos: info básica, fechas, ubicación, precio, `maxParticipants`, arrays (`experiences`, `includes`, etc.), `heroImageIndex`, `highlightWords`.
- `status` (`draft`, `active`, `completed`, `cancelled`).
- Virtuales: `durationDays`, `isFull`, `availableSpots`, `activePricingTier`, `computedStatus` (según fechas).
- `pre('save')` genera `slug` si no existe.

**Servicio:** `backend/services/retreatService.js`

Flujos clave:

1. `getAllRetreats(filters, options, user)`
   - Usuarios no autenticados → fuerza `status='active'` y `endDate >= hoy`.
   - Devuelve retiros paginados enriquecidos con `currentParticipants` (cuenta leads confirmados).

2. `getRetreatById(identifier)`
   - Acepta ID o `slug`, enriquece con disponibilidad.
   - Si admin (`req.user`), responde con `statusWarning` cuando fechas/estado son inconsistentes.

3. `createRetreat` y `updateRetreat`
   - `validateStatusBeforeSave` evita marcar como `completed` si `endDate` ≥ hoy.
   - `updateRetreat` limpia campos vacíos y valida manualmente fechas.

4. `getActiveRetreat`, `getPastRetreats`, `getHeroData`
   - Hero prioriza retiros `showInHero` activos; devuelve fallback si no hay.
   - `getPastRetreats` filtra por `status=completed` y `endDate < hoy`.

**Controlador:** `backend/controllers/retreatController.js`

| Endpoint | Método | Acceso | Notas |
|----------|--------|--------|-------|
| `/api/retreats` | GET | Público/Admin | Usa `optionalAuth`; admin puede filtrar más.
| `/api/retreats/:id` | GET | Público | Se enriquece con disponibilidad.
| `/api/retreats` | POST | `protect` | Crea retiro.
| `/api/retreats/:id` | PUT | `protect` | Actualiza retiro.
| `/api/retreats/:id` | DELETE | `protect` | Elimina retiro.
| `/api/retreats/active/current` | GET | Público | Hero principal.
| `/api/retreats/past` | GET | Público | Hero alternativo.
| `/api/retreats/hero-data` | GET | Público | Paquete hero (activos/pasados).

---

## Gestión de Leads

**Modelo:** `backend/models/Lead.js`
- Campos: datos de contacto, mensaje, `interest`, `status`, `paymentStatus`, `paymentAmount`, `paymentMethod`, `retreat`, notas, `source`, timestamps.
- Índice único `email + retreat` (previene duplicados).
- Virtual `isConfirmed` (status `confirmado` + pago `completo`).

**Constantes:** `backend/constants/enums.js`
- `LEAD_STATUS`, `PAYMENT_STATUS`, `PAYMENT_METHOD`, `INTEREST_TYPE`, `LEAD_SOURCE` + labels.
- Helpers `isLeadFullyConfirmed` y `countsAsConfirmedParticipant`.

**Servicio:** `backend/services/leadService.js`

1. `createLead`
   - Verifica retiro `active` y disponible (cuenta confirmados con pago completo).
   - Evita duplicar email/retreat.
   - Setea defaults (`interest`, `source`) y retorna mensaje éxito.

2. `updateLead`
   - Obtiene lead actual, detecta si el status/pago cambia transición a confirmación.
   - Ajusta `contactedAt` y `confirmedAt` según estado.
   - Indica si cambió disponibilidad (`availabilityChanged`).

3. `deleteLead`
   - Elimina lead y reporta si afectó disponibilidad (si estaba confirmado).

4. `getAllLeads`
   - Filtros por `status`, `paymentStatus`, `retreat` + paginación.
   - Devuelve stats agregadas (conteos + monto total).

5. `getLeadStats`
   - KPIs globales y del mes actual (conversiones, totales, etc.).

**Controlador:** `backend/controllers/leadController.js`

| Endpoint | Método | Acceso | Notas |
|----------|--------|--------|-------|
| `/api/leads` | POST | Público | Formulario landing.
| `/api/leads` | GET | `protect` | Panel admin, incluye Stats.
| `/api/leads/:id` | GET | `protect` | Detalle con disponibilidad del retiro.
| `/api/leads/:id` | PUT | `protect` | Actualiza estado/pago.
| `/api/leads/:id` | DELETE | `protect` | Elimina lead.
| `/api/leads/stats/overview` | GET | `protect` | Resumen numérico para dashboard.

**Interacción con Retiros:**
- Disponibilidad (`currentParticipants`, `availableSpots`) se recalcula contando leads confirmados.
- Cuando se confirman leads, se usa para validar generación de tokens.

---

## Testimonios y Tokens

### Tokens

**Modelo:** `backend/models/TestimonialToken.js`
- Token aleatorio (32 bytes hex), email, `participantName`, `retreat`, `expiresAt` (TTL 30 días), `isUsed`, `usedAt`, `testimonial`.
- Índices: TTL sobre `expiresAt`, únicos por `token` y por (`email`,`retreat`).
- Virtuales `isExpired`/`isValid` y middleware `pre('save')` que setea `usedAt` al marcar `isUsed`.
- `validateToken(token)` devuelve token activo populateado con `retreat`.
- `generateForRetreat(retreatId, participants)` crea tokens ignorando duplicados (código 11000).

**Servicio:** `backend/services/tokenService.js`

- `generateTokensForRetreat(retreatId)`
  - Requiere retiro `completed` con leads confirmados.
  - Evita duplicados por email y dispara envío automático de mails.
  - Respuesta incluye métricas (participantes total, tokens generados, emails enviados/fallidos).
- `validatePublicToken(token)` reutiliza `TestimonialToken.validateToken` para exponer info al frontend.

**Controlador:** `backend/controllers/tokenController.js`

| Endpoint | Método | Acceso | Descripción |
|----------|--------|--------|-------------|
| `/api/tokens/generate/:retreatId` | POST | `protect` | Genera tokens para participantes confirmados de un retiro completado y envía emails.
| `/api/tokens` | GET | `protect` | Lista tokens con filtros/paginación.
| `/api/tokens/:id` | GET | `protect` | Detalle individual (incluye estado y uso).
| `/api/tokens/:id/regenerate` | POST | `protect` | Regenera token si expiró o se perdió el mail.
| `/api/tokens/:id` | DELETE | `protect` | Elimina token.
| `/api/tokens/validate/:token` | GET | Público | Valida token para formularios públicos.

### Testimonios

**Modelo:** `backend/models/Testimonial.js`
- Campos: `participantName`, `participantEmail`, `retreat`, `rating`, `comment`, `participantPhoto`, `isApproved`, `isFeatured`, `token`, timestamps.
- Virtual `stars` para representación visual.

**Servicio:** `backend/services/testimonialService.js`

- `submitTestimonialWithToken(token, data)`
  - Valida token (no usado / no vencido) y crea testimonio con datos del token.
  - Marca token como usado, enlaza testimonio y retorna mensaje de revisión pendiente.
- `createPublicTestimonial({ token, ...data })`
  - Variante que recibe token en body (p.ej. formularios públicos).
  - Crea testimonio con `isApproved=false` y marca token como usado.
- `getAllTestimonials(filters, options, user)`
  - Públicos reciben solo `isApproved=true`.
  - Admin puede filtrar por aprobación, destacado, retiro, rating.
- `updateTestimonial(id, data)`
  - Permite togglear `isApproved`/`isFeatured`, editar contenido.
- `getFeaturedTestimonials(limit)`
  - Devuelve testimonios aprobados y destacados para la landing.

**Controlador:** `backend/controllers/testimonialController.js`

| Endpoint | Método | Acceso | Lógica |
|----------|--------|--------|--------|
| `/api/testimonials` | GET | Público/Admin | Públicos ven aprobados; admin puede filtrar todo.
| `/api/testimonials/:id` | GET | `protect` | Detalle con populate de retiro.
| `/api/testimonials` | POST | `protect` | Crea testimonio manual (admin).
| `/api/testimonials/:id` | PUT | `protect` | Actualiza contenido/flags.
| `/api/testimonials/:id` | DELETE | `protect` | Elimina testimonio.
| `/api/testimonials/submit/:token` | POST | Público (con token) | Usa `submitTestimonialWithToken`.
| `/api/testimonials/public` | POST | Público (con token en body) | Usa `createPublicTestimonial`.
| `/api/testimonials/validate/:token` | GET | Público | Confirma validez antes de mostrar formulario.
| `/api/testimonials/featured/public` | GET | Público | Lista destacados aprobados para la landing.

**Frontend:**
- `LandingPage` consume `testimonialsAPI.getFeatured()`.
- Panel admin (`frontend/src/components/admin/testimonials/*`) ofrece toggle de aprobación/destacado y regeneración de tokens.

**Lifecycle resumen**
1. Admin marca retiro como completado → genera tokens → se envían emails.
2. Participante abre link → frontend valida token → envía testimonio.
3. Backend crea testimonio (pendiente de aprobación) y marca token usado.
4. Admin aprueba/destaca → se publica si cumple criterios (landing requiere `isApproved` + `isFeatured`).

---

## Configuración del Sitio (Settings)

**Modelo:** `backend/models/Setting.js`
- Singleton (índice único `isActive=true`).
- Datos del facilitador, contacto, redes, textos del hero/CTA, tema de colores, email settings.
- Métodos estáticos `getActive()` y `createDefault()`.

**Controlador:** `backend/controllers/settingController.js`

| Endpoint | Método | Acceso | Descripción |
|----------|--------|--------|-------------|
| `/api/settings` | GET | Público/Admin | Devuelve configuración activa; oculta campos sensibles a público.
| `/api/settings/public` | GET | Público | Versión reducida para la landing.
| `/api/settings` | PUT | `protect` | Crea o actualiza la configuración activa.
| `/api/settings/reset` | POST | `protect` | Limpia todo y crea configuración por defecto.

**Frontend:**
- `LandingPage` consume `settingsAPI.getPublic()` para hero, CTA, redes.
- Panel admin (a desarrollar) puede consumir `settingsAPI.get()` y `settingsAPI.update()`.

---

## Emails Transaccionales

**Servicio:** `backend/services/emailService.js`
- Usa `nodemailer` (transporter Gmail).
- Métodos:
  - `sendTestimonialToken({ email, participantName, retreatTitle, token, expiresAt })`
    - Envía correo HTML + texto con link a `/testimonio?token=...`.
  - `sendMultipleTestimonialTokens(tokens)` agrupa resultados (sent/failed).
  - `verifyConnection()` se ejecuta al iniciar servidor (log de éxito/error).
- `server.js` expone `/api/test-email` para pruebas manuales.

**Consideraciones:**
- Requiere `EMAIL_USER` y `EMAIL_PASSWORD` (contraseña de aplicación).
- Emails se intentan enviar uno por uno; fallas individuales se registran pero no interrumpen el lote.

---

## Estructura de Endpoints

Referencias rápidas por dominio:

- **Auth:** `/api/auth/*`
- **Retiros:** `/api/retreats/*`
- **Leads:** `/api/leads/*`
- **Testimonios:** `/api/testimonials/*`
- **Tokens:** `/api/tokens/*`
- **Settings:** `/api/settings/*`
- **Healthcheck:** `/api/health`

Respuestas estándar: `{ success, data, message?, pagination?, count? }`.

---

## Notas Operativas

- `protect` se usa en rutas admin; `optionalAuth` permite enriquecer respuestas públicas cuando hay sesión.
- Variables críticas: `JWT_SECRET`, `JWT_EXPIRE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `FRONTEND_ORIGIN`, `BACKEND_ORIGIN`, `PORT`, `MONGODB_URI`.
- Tokens de testimonios vencen automáticamente (TTL). Para reenviar, usar `POST /api/tokens/:id/regenerate`.
- `leadService` y `retreatService` están acoplados: confirmar/cancelar leads impacta disponibilidad de retiros.
- Mantener actualizado este documento junto con `README.md` (overview) y `README.esquemas.md` (diagramas).
- Storybook (`Button.stories.jsx`) es opcional, útil para QA de componentes UI.

---

¿Algo falta? Abrir issue o PR para extender esta guía.
