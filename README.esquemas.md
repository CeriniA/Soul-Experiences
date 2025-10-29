# Esquemas de Modelos - Soul Experiences

Este documento complementa al `README.md` principal y resume los modelos de la base de datos utilizando tablas que facilitan la consulta rápida de campos, validaciones, virtuales, índices y relaciones.

> **Nota**: Toda la información proviene directamente de los archivos en `backend/models` y `backend/constants/enums.js`. Cuando existan cambios en los modelos, actualizar este archivo en conjunto con el README principal.

---

## 📁 Modelos de Mongoose

### 1. Retreat (`backend/models/Retreat.js`)

| Campo | Tipo | Req. | Descripción | Notas |
|-------|------|------|-------------|-------|
| `title` | `String` | ✅ | Título del retiro (máx. 100) | Se usa para generar `slug`
| `description` | `String` | ✅ | Descripción detallada (máx. 2000) |  |
| `shortDescription` | `String` | ❌ | Resumen (máx. 300) |  |
| `targetAudience` | `[String]` | ❌ | Público objetivo |  |
| `experiences` | `[String]` | ❌ | Actividades incluidas |  |
| `startDate` | `Date` | ✅ | Inicio del retiro |  |
| `endDate` | `Date` | ✅ | Fin del retiro (`>= startDate`) | Validación de rango
| `location` | `Object` | ✅ | Datos completos del lugar | Ver tabla anidada
| `price` | `Number` | ✅ | Precio base (`>= 0`) |  |
| `currency` | `String` | ✅ | Moneda (`ARS`/`USD`/`EUR`) | Default: `ARS`
| `pricingTiers` | `[Object]` | ❌ | Escalas de precio | Validación personalizada
| `maxParticipants` | `Number` | ✅ | Cupos (1-100) |  |
| `includes` | `[String]` | ❌ | Ítems incluidos |  |
| `notIncludes` | `[String]` | ❌ | Ítems excluidos |  |
| `foodInfo` | `Object` | ❌ | Información de alimentación |  |
| `policies` | `Object` | ❌ | Políticas y restricciones |  |
| `images` | `[String]` | ❌ | URLs de imágenes |  |
| `heroImageIndex` | `Number` | ❌ | Índice hero (>=0) | Valida rango según `images`
| `highlightWords` | `[String]` | ❌ | Palabras destacadas |  |
| `showInHero` | `Boolean` | ❌ | Mostrar en hero | Default: `false`
| `status` | `String` | ✅ | Estado (`draft`/`active`/`completed`/`cancelled`) | Default: `draft`
| `slug` | `String` | ✅ | Slug único | Generado en `pre('validate')`
| `whatsappNumber` | `String` | ❌ | Contacto específico |  |
| `createdAt` / `updatedAt` | `Date` | ✅ | Timestamps | `timestamps: true`

**Subdocumento `location`**

| Campo | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `name` | `String` | ✅ | Nombre del lugar |
| `address` | `String` | ✅ | Dirección física |
| `city` / `state` / `country` | `String` | ❌ | Ubicación geográfica (Default país: Argentina) |
| `description` | `String` | ❌ | Texto descriptivo |
| `features` | `[String]` | ❌ | Características destacadas |
| `accommodationType` | `String` | ❌ | Tipo de alojamiento |
| `howToGetThere` | `Object` | ❌ | Instrucciones de acceso |

**Subdocumento `pricingTiers`**

| Campo | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `name` | `String` | ✅ | Título de la escala |
| `price` | `Number` | ✅ | Precio con descuento |
| `validUntil` | `Date` | ✅ | Fecha límite |
| `paymentOptions` | `[String]` | ❌ | Opciones de pago |

**Virtuales**
- `durationDays`: Duración en días (`endDate - startDate`).
- `availableSpots`: Cupos disponibles (`maxParticipants - confirmed`).
- `computedStatus`: Ajusta estado según fechas y cupos.
- `effectivePrice`: Determina precio vigente (tier activo o base).
- `activePricingTier`: Devuelve el tier actual.

**Índices & Middleware**
- Índice único en `slug`.
- `pre('save')`: genera slug y normaliza datos.

---

### 2. Testimonial (`backend/models/Testimonial.js`)

| Campo | Tipo | Req. | Descripción | Notas |
|-------|------|------|-------------|-------|
| `participantName` | `String` | ✅ | Nombre de quien opina |  |
| `participantEmail` | `String` | ❌ | Email de contacto | Lowercase
| `participantPhoto` | `String` | ❌ | URL de foto |  |
| `retreat` | `ObjectId` | ✅ | Referencia a `Retreat` | `ref: 'Retreat'`
| `rating` | `Number` | ✅ | Puntaje 1-5 | Validación de rango
| `comment` | `String` | ✅ | Texto del testimonio |  |
| `isApproved` | `Boolean` | ✅ | Aprobado o no | Default `false`
| `isFeatured` | `Boolean` | ✅ | Mostrar en landing | Default `false`
| `token` | `String` | ❌ | Token utilizado | Único cuando existe
| `approvedAt` | `Date` | ❌ | Fecha de aprobación | Auto-set en middleware
| `notes` | `String` | ❌ | Notas internas (máx. 1000) |  |
| `createdBy` | `ObjectId` | ❌ | Usuario que creó el testimonio |  |
| `createdAt` / `updatedAt` | `Date` | ✅ | Timestamps | `timestamps: true`

**Virtuales**
- `stars`: Devuelve array de longitud `rating` para UI.

**Middleware**
- `pre('save')`: setea `approvedAt` cuando `isApproved` pasa a `true`.

**Índices**
- `retreat` (para consultas).
- `isApproved`, `isFeatured` (filtrado rápido).

---

### 3. Lead (`backend/models/Lead.js`)

| Campo | Tipo | Req. | Descripción | Notas |
|-------|------|------|-------------|-------|
| `name` | `String` | ✅ | Nombre del interesado | Máx. 120 |
| `email` | `String` | ✅ | Email en minúsculas | Validación de formato |
| `phone` | `String` | ❌ | Teléfono de contacto |  |
| `retreat` | `ObjectId` | ❌ | Referencia a `Retreat` | Permite `null`
| `message` | `String` | ❌ | Mensaje enviado | Máx. 1000 |
| `status` | `String` | ✅ | Estado (`nuevo`, `contactado`, `interesado`, `confirmado`, `descartado`) | Default: `nuevo`
| `interest` | `String` | ✅ | Intención (`reservar`, `info`, `consulta`) | Default: `info`
| `paymentStatus` | `String` | ✅ | Pago (`pendiente`, `seña`, `completo`) | Default: `pendiente`
| `paymentAmount` | `Number` | ❌ | Monto abonado (`>=0`) |  |
| `paymentMethod` | `String` | ❌ | Método (`transferencia`, `mercadopago`, `efectivo`) | Default: `""`
| `notes` | `String` | ❌ | Notas internas (máx. 1000) |  |
| `source` | `String` | ✅ | Origen (`landing`, `instagram`, `facebook`, `referido`, `otro`) | Default: `landing`
| `contactedAt` | `Date` | ❌ | Fecha de contacto |  |
| `confirmedAt` | `Date` | ❌ | Fecha de confirmación |  |
| `createdAt` / `updatedAt` | `Date` | ✅ | Timestamps |  |

**Virtuales**
- `isConfirmed`: `status === 'confirmado' && paymentStatus === 'completo'`.

**Índices**
- Índice único compuesto `{ email, retreat }` con `partialFilterExpression` para evitar duplicados por retiro.

---

### 4. User (`backend/models/User.js`)

| Campo | Tipo | Req. | Descripción | Notas |
|-------|------|------|-------------|-------|
| `name` | `String` | ✅ | Nombre completo | Máx. 100 |
| `email` | `String` | ✅ | Email único/select false | Lowercase, trim |
| `password` | `String` | ✅ | Hash bcrypt (12 salt rounds) | `select: false`
| `role` | `String` | ✅ | Rol (`admin`, `editor`) | Default: `admin`
| `lastLogin` | `Date` | ❌ | Último acceso |  |
| `passwordChangedAt` | `Date` | ❌ | Último cambio | Actualiza JWT validity
| `createdAt` / `updatedAt` | `Date` | ✅ | Timestamps |  |

**Middleware**
- `pre('save')`: hashea password si es nuevo o modificado.
- `pre('save')`: setea `passwordChangedAt` cuando se actualiza la contraseña.

**Métodos de instancia**
- `comparePassword(plain)`: compara usando bcrypt.
- `generateAuthToken()`: genera JWT con expiración y payload `{ id, email, role }`.

**Estáticos**
- `createDefaultAdmin()`: crea admin inicial si no existe.

---

### 5. Setting (`backend/models/Setting.js`) – *Singleton*

| Campo | Tipo | Req. | Descripción | Notas |
|-------|------|------|-------------|-------|
| `facilitatorName` | `String` | ✅ | Nombre del facilitador (máx. 100) |  |
| `facilitatorBio` | `String` | ❌ | Biografía (máx. 1000) |  |
| `facilitatorPhoto` | `String` | ❌ | URL de la foto |  |
| `contactEmail` | `String` | ✅ | Email de contacto válido |  |
| `whatsappNumber` | `String` | ✅ | Número visible en landing |  |
| `socialMedia` | `Object` | ❌ | Redes: `instagram`, `facebook`, `youtube`, `website` |  |
| `siteTitle` | `String` | ❌ | Título principal (máx. 100) | Default: `Retiros Espirituales`
| `siteDescription` | `String` | ❌ | Descripción corta (máx. 200) |  |
| `siteLogo` | `String` | ❌ | URL del logo |  |
| `emailSettings` | `Object` | ❌ | `fromName`, `fromEmail`, `replyTo` |  |
| `customTexts` | `Object` | ❌ | Textos hero, CTA, agradecimiento | Defaults definidos |
| `theme` | `Object` | ❌ | Colores primario/secundario/acento | Defaults definidos |
| `isActive` | `Boolean` | ✅ | Indica configuración vigente | Default: `true`
| `createdAt` / `updatedAt` | `Date` | ✅ | Timestamps |  |

**Índices**
- Índice único parcial `{ isActive: 1 }` para garantizar un solo registro activo.

**Estáticos**
- `getActive()`: retorna config activa (crea una por defecto si no existe).
- `createDefault(facilitatorData)`: inicializa valores básicos.

---

### 6. TestimonialToken (`backend/models/TestimonialToken.js`)

| Campo | Tipo | Req. | Descripción | Notas |
|-------|------|------|-------------|-------|
| `token` | `String` | ✅ | Token único (hex 64) | Índice único |
| `email` | `String` | ✅ | Email del participante | Lowercase |
| `participantName` | `String` | ✅ | Nombre del invitado |  |
| `retreat` | `ObjectId` | ✅ | Referencia al retiro | `ref: 'Retreat'`
| `isUsed` | `Boolean` | ✅ | Si fue utilizado | Default: `false`
| `usedAt` | `Date` | ❌ | Fecha de uso | Auto-set en middleware
| `expiresAt` | `Date` | ✅ | Caducidad (30 días) | TTL index
| `testimonial` | `ObjectId` | ❌ | Testimonio creado (ref `Testimonial`) |  |
| `createdAt` / `updatedAt` | `Date` | ✅ | Timestamps |  |

**Virtuales**
- `isExpired`: `Date.now() > expiresAt`.
- `isValid`: `!isUsed && !isExpired`.

**Middleware**
- `pre('save')`: setea `usedAt` cuando `isUsed` pasa a `true`.

**Índices**
- Único en `token`.
- Índice compuesto `{ email, retreat }` para evitar duplicados.
- TTL index en `expiresAt` para eliminación automática.

**Estáticos**
- `generateForRetreat(retreatId, participants)`: crea tokens masivos.
- `validateToken(token)`: retorna token válido con `populate('retreat')`.

---

## 🔁 Enums y Constantes Compartidas (`backend/constants/enums.js`)

| Enum | Valores |
|------|---------|
| `LEAD_STATUS` | `nuevo`, `contactado`, `interesado`, `confirmado`, `descartado` |
| `PAYMENT_STATUS` | `pendiente`, `seña`, `completo` |
| `PAYMENT_METHOD` | `transferencia`, `mercadopago`, `efectivo` |
| `INTEREST_TYPE` | `reservar`, `info`, `consulta` |
| `LEAD_SOURCE` | `landing`, `instagram`, `facebook`, `referido`, `otro` |
| `RETREAT_STATUS` | `draft`, `active`, `completed`, `cancelled` |
| `CURRENCY` | `ARS`, `USD`, `EUR` |

> **Frontend sincronizado**: `frontend/src/constants/enums.js` reproduce estos valores para selectores y validaciones en la UI.

---

## 🔒 Relaciones y Populate

| Relación | Descripción | Uso |
|----------|-------------|-----|
| `Testimonial.retreat` | Cada testimonio pertenece a un retiro | `Testimonial.find().populate('retreat')` |
| `Lead.retreat` | Leads asociados a retiros | `Lead.find().populate('retreat')` |
| `TestimonialToken.retreat` | Tokens generados por retiro | `TestimonialToken.find().populate('retreat')` |
| `TestimonialToken.testimonial` | Vincula token con testimonio creado | Populate opcional en panel admin |

---

## ✅ Resumen

- Este documento provee una visión orientada a esquemas/tablas ideal para presentar el modelo de datos.
- El README principal mantiene explicaciones narrativas, diagramas y ejemplos de uso.
- Ambos documentos deben mantenerse sincronizados frente a cambios futuros.
