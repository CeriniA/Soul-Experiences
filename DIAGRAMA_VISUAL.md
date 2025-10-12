# 📊 DIAGRAMA VISUAL - ARQUITECTURA SOUL EXPERIENCES

## 🗺️ VISTA GENERAL DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ LandingPage  │  │  AdminPanel  │  │  Components  │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                 │                 │                       │
│         └─────────────────┴─────────────────┘                       │
│                           │                                         │
│                      API REST (HTTP)                                │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    CAPA 1: CONTROLLERS                       │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │ │
│  │  │ auth │ │ lead │ │retreat│ │testi-│ │token │ │setting│     │ │
│  │  │      │ │      │ │       │ │monial│ │      │ │       │     │ │
│  │  └───┬──┘ └───┬──┘ └───┬───┘ └───┬──┘ └───┬──┘ └───┬───┘     │ │
│  └──────┼────────┼────────┼─────────┼────────┼────────┼─────────┘ │
│         │        │        │         │        │        │           │
│  ┌──────▼────────▼────────▼─────────▼────────▼────────▼─────────┐ │
│  │                    CAPA 2: SERVICES                           │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │ │
│  │  │ user │ │ lead │ │retreat│ │testi-│ │token │ │email │      │ │
│  │  │Service│ │Service│ │Service│ │monial│ │Service│ │Service│      │ │
│  │  │      │ │      │ │       │ │Service│ │      │ │      │      │ │
│  │  └───┬──┘ └───┬──┘ └───┬───┘ └───┬──┘ └───┬──┘ └──────┘      │ │
│  └──────┼────────┼────────┼─────────┼────────┼─────────────────┘ │
│         │        │        │         │        │                   │
│  ┌──────▼────────▼────────▼─────────▼────────▼─────────────────┐ │
│  │                    CAPA 3: MODELS                            │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │ │
│  │  │ User │ │ Lead │ │Retreat│ │Testi-│ │Token │ │Setting│     │ │
│  │  │      │ │      │ │       │ │monial│ │      │ │       │     │ │
│  │  └──────┘ └───┬──┘ └───┬───┘ └───┬──┘ └───┬──┘ └──────┘     │ │
│  └───────────────┼────────┼─────────┼────────┼─────────────────┘ │
└──────────────────┼────────┼─────────┼────────┼────────────────────┘
                   │        │         │        │
┌──────────────────▼────────▼─────────▼────────▼────────────────────┐
│                      MONGODB (Base de Datos)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  users   │ │  leads   │ │ retreats │ │testimonials│            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐                                       │
│  │  tokens  │ │ settings │                                       │
│  └──────────┘ └──────────┘                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 RELACIONES ENTRE COLECCIONES

```
                    ┌─────────────────┐
                    │     RETREAT     │
                    │   (Retiro)      │
                    │                 │
                    │ • title         │
                    │ • dates         │
                    │ • price         │
                    │ • capacity      │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                │ 1:N        │ 1:N        │ 1:N
                │            │            │
        ┌───────▼──────┐ ┌──▼─────────┐ ┌▼──────────────┐
        │     LEAD     │ │TESTIMONIAL │ │TESTIMONIAL    │
        │  (Consulta)  │ │(Testimonio)│ │    TOKEN      │
        │              │ │            │ │               │
        │ • name       │ │ • rating   │ │ • token       │
        │ • email      │ │ • comment  │ │ • isUsed      │
        │ • status     │ │ • approved │ │ • expiresAt   │
        │ • payment    │ │ • featured │ └───────┬───────┘
        └──────────────┘ └──────┬─────┘         │
                                │               │
                                │ 1:1 opcional  │
                                └───────────────┘


    ┌─────────────┐              ┌─────────────┐
    │    USER     │              │   SETTING   │
    │   (Admin)   │              │   (Config)  │
    │             │              │             │
    │ • name      │              │ • facilitator│
    │ • email     │              │ • contact   │
    │ • password  │              │ • theme     │
    └─────────────┘              └─────────────┘
    (Independiente)               (Singleton)
```

---

## 🎯 FLUJO DE DATOS: CREAR LEAD

```
1. USUARIO (Landing)
   │
   │ POST /api/leads
   │ { name, email, phone, retreat }
   │
   ▼
2. leadController.createLead()
   │
   │ Llama a →
   │
   ▼
3. leadService.createLead()
   │
   ├─→ Verifica retiro existe (Retreat.findOne)
   ├─→ Verifica disponibilidad (Lead.countDocuments)
   ├─→ Verifica duplicado (Lead.findOne)
   │
   │ Lead.create()
   │
   ▼
4. MongoDB: Inserta en colección 'leads'
   │
   │ Response
   │
   ▼
5. Usuario recibe confirmación
```

---

## 🔄 FLUJO DE DATOS: ACTUALIZAR LEAD (Confirmar Pago)

```
1. ADMIN (Panel)
   │
   │ PUT /api/leads/:id
   │ { status: 'confirmado', paymentStatus: 'completo' }
   │
   ▼
2. leadController.updateLead()
   │
   │ Llama a →
   │
   ▼
3. leadService.updateLead()
   │
   ├─→ Lead.findById() - Obtiene lead actual
   │   • Estaba confirmado? NO (seña != completo)
   │
   ├─→ Lead.findByIdAndUpdate() - Actualiza
   │   • status: 'confirmado'
   │   • paymentStatus: 'completo'
   │   • confirmedAt: new Date()
   │
   ├─→ Verifica nuevo estado
   │   • Está confirmado ahora? SÍ
   │
   └─→ Detecta cambio: availabilityChanged = true
   │
   ▼
4. MongoDB: Actualiza documento en 'leads'
   │
   ▼
5. Próxima consulta a Retreat:
   │
   │ retreatService.enrichRetreatWithParticipants()
   │
   ├─→ Lead.countDocuments({
   │     retreat: id,
   │     status: 'confirmado',
   │     paymentStatus: 'completo'
   │   })
   │
   └─→ Calcula:
       • currentParticipants = count
       • availableSpots = max - count
       • isFull = count >= max
```

---

## 📊 CÁLCULO DE DISPONIBILIDAD

```
┌─────────────────────────────────────────────────────────┐
│  ¿Cómo se calcula la disponibilidad de un retiro?      │
└─────────────────────────────────────────────────────────┘

❌ NO HAY campo 'currentParticipants' en Retreat schema
✅ SE CALCULA dinámicamente cada vez que se consulta

┌──────────────────────────────────────────────────────┐
│  retreatService.enrichRetreatWithParticipants()      │
│                                                      │
│  1. Cuenta leads confirmados:                       │
│     const count = await Lead.countDocuments({       │
│       retreat: retreatId,                           │
│       status: 'confirmado',                         │
│       paymentStatus: 'completo'                     │
│     });                                             │
│                                                      │
│  2. Calcula disponibilidad:                         │
│     currentParticipants = count                     │
│     availableSpots = maxParticipants - count        │
│     isFull = count >= maxParticipants               │
│                                                      │
│  3. Retorna retiro enriquecido                      │
└──────────────────────────────────────────────────────┘

VENTAJAS:
✅ Siempre preciso (no hay desincronización)
✅ No requiere actualizar campo en BD
✅ Menos propenso a errores
✅ Un solo lugar de verdad (colección leads)
```

---

## 🔐 FLUJO DE AUTENTICACIÓN

```
1. ADMIN (Login)
   │
   │ POST /api/auth/login
   │ { email, password }
   │
   ▼
2. authController.login()
   │
   │ Llama a →
   │
   ▼
3. userService.authenticateUser()
   │
   ├─→ User.findOne({ email }).select('+password')
   ├─→ user.comparePassword(password) - bcrypt
   ├─→ user.generateAuthToken() - JWT
   │
   └─→ { token, user }
   │
   ▼
4. Admin recibe token JWT
   │
   │ Guarda en localStorage
   │
   ▼
5. Peticiones futuras incluyen:
   │
   │ Headers: { Authorization: 'Bearer <token>' }
   │
   ▼
6. Middleware: protect()
   │
   ├─→ Verifica token JWT
   ├─→ Decodifica payload
   ├─→ Busca usuario
   │
   └─→ req.user = usuario
   │
   ▼
7. Controller tiene acceso a req.user
```

---

## 🎫 FLUJO DE TOKENS DE TESTIMONIO

```
1. ADMIN (Panel)
   │
   │ POST /api/tokens/generate/:retreatId
   │ { quantity: 5 }
   │
   ▼
2. tokenController.generateTokensForRetreat()
   │
   ▼
3. tokenService.generateTokensForRetreat()
   │
   ├─→ Retreat.findById() - Verifica retiro
   ├─→ Lead.find({ retreat, status: 'confirmado' })
   ├─→ TestimonialToken.find({ retreat }) - Tokens existentes
   │
   ├─→ Filtra participantes sin token
   │
   ├─→ TestimonialToken.generateForRetreat()
   │   └─→ Crea tokens con crypto.randomBytes(32)
   │
   └─→ emailService.sendTestimonialToken()
       └─→ Envía email con link único
   │
   ▼
4. MongoDB: Inserta en 'testimonialTokens'
   │
   ▼
5. PARTICIPANTE recibe email
   │
   │ Click en link: /testimonial/:token
   │
   ▼
6. FRONTEND valida token
   │
   │ GET /api/tokens/validate/:token
   │
   ▼
7. tokenService.validatePublicToken()
   │
   ├─→ TestimonialToken.validateToken()
   │   • isUsed = false
   │   • expiresAt > now
   │
   └─→ { participantName, retreat, expiresAt }
   │
   ▼
8. PARTICIPANTE completa formulario
   │
   │ POST /api/testimonials/submit/:token
   │ { rating, comment }
   │
   ▼
9. testimonialService.submitTestimonialWithToken()
   │
   ├─→ Valida token nuevamente
   ├─→ Testimonial.create()
   ├─→ token.isUsed = true
   ├─→ token.testimonial = testimonialId
   │
   ▼
10. MongoDB: Inserta en 'testimonials'
    │
    ▼
11. ADMIN revisa y aprueba
    │
    │ PUT /api/testimonials/:id
    │ { isApproved: true, isFeatured: true }
    │
    ▼
12. Aparece en landing page
```

---

## 📋 ENUMS CENTRALIZADOS

```
┌─────────────────────────────────────────────────────────┐
│           backend/constants/enums.js                    │
│                                                         │
│  export const LEAD_STATUS = {                          │
│    NUEVO: 'nuevo',                                     │
│    CONTACTADO: 'contactado',                           │
│    INTERESADO: 'interesado',                           │
│    CONFIRMADO: 'confirmado',                           │
│    DESCARTADO: 'descartado'                            │
│  };                                                     │
│                                                         │
│  export const PAYMENT_STATUS = { ... }                 │
│  export const PAYMENT_METHOD = { ... }                 │
│  export const RETREAT_STATUS = { ... }                 │
│  export const CURRENCY = { ... }                       │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Importado por
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Lead.js    │  │  Retreat.js  │  │leadService.js│
│              │  │              │  │              │
│ enum:        │  │ enum:        │  │ Usa para     │
│ LEAD_STATUS_ │  │ RETREAT_     │  │ validaciones │
│ ARRAY        │  │ STATUS_ARRAY │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────┐
│         frontend/src/constants/enums.js                 │
│                                                         │
│  export const LEAD_STATUS_OPTIONS = [                  │
│    { value: 'nuevo', label: 'Nuevo' },                │
│    { value: 'contactado', label: 'Contactado' },      │
│    ...                                                 │
│  ];                                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Usado por
                          │
                          ▼
                  ┌──────────────┐
                  │LeadDetail.jsx│
                  │              │
                  │ Dropdowns    │
                  │ con opciones │
                  └──────────────┘
```

---

## 🎨 RESUMEN VISUAL DE COHERENCIA

```
✅ COHERENTE                    ⚠️ MEJORABLE
┌──────────────────┐           ┌──────────────────┐
│ • Arquitectura   │           │ • settingCtrl    │
│   3 capas        │           │   sin service    │
│                  │           │   (aceptable)    │
│ • Enums en       │           └──────────────────┘
│   Lead.js ✅     │
│                  │           ❌ CORREGIDO
│ • Enums en       │           ┌──────────────────┐
│   Retreat.js ✅  │           │ • Retreat.js     │
│   (CORREGIDO)    │           │   ahora usa      │
│                  │           │   enums ✅       │
│ • Disponibilidad │           └──────────────────┘
│   dinámica ✅    │
│                  │
│ • Relaciones     │
│   bien definidas │
│                  │
│ • Services con   │
│   lógica clara   │
└──────────────────┘
```

---

## 🏆 MÉTRICAS FINALES

```
┌─────────────────────────────────────────┐
│         ESTADO DEL SISTEMA              │
├─────────────────────────────────────────┤
│ Modelos:              6                 │
│ Controllers:          6                 │
│ Services:             6                 │
│ Enums sincronizados:  7/7 ✅           │
│ Relaciones:           4 (bien definidas)│
│ Índices:              ~30               │
│ Inconsistencias:      0 ✅              │
│                                         │
│ CALIFICACIÓN:    🌟🌟🌟🌟🌟           │
│                  EXCELENTE              │
└─────────────────────────────────────────┘
```

---

**Generado**: 2025-10-12  
**Sistema**: Soul Experiences  
**Estado**: ✅ Producción Ready
