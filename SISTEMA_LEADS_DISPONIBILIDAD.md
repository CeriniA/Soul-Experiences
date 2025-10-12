# 📋 Sistema de Leads y Disponibilidad Automática

## 🎯 Resumen

Este documento explica cómo funciona el sistema de gestión de leads y la actualización automática de disponibilidad de retiros en Soul Experiences.

---

## 🏗️ Arquitectura

### Capas Implementadas

```
┌─────────────────────────────────────────┐
│         FRONTEND (React)                │
│  - LeadDetail.jsx (UI)                  │
│  - constants/enums.js (Valores)         │
└──────────────┬──────────────────────────┘
               │ API REST
┌──────────────▼──────────────────────────┐
│         BACKEND (Node.js)               │
│  ┌────────────────────────────────────┐ │
│  │  Controllers (HTTP)                │ │
│  │  - leadController.js               │ │
│  └──────────┬─────────────────────────┘ │
│             │                            │
│  ┌──────────▼─────────────────────────┐ │
│  │  Services (Lógica de Negocio)     │ │
│  │  - leadService.js                  │ │
│  │  - retreatService.js               │ │
│  └──────────┬─────────────────────────┘ │
│             │                            │
│  ┌──────────▼─────────────────────────┐ │
│  │  Models (Base de Datos)            │ │
│  │  - Lead.js                         │ │
│  │  - Retreat.js                      │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Constants (Enums)                 │ │
│  │  - constants/enums.js              │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🔑 Conceptos Clave

### ¿Cuándo un Lead cuenta como "Confirmado"?

Un lead solo cuenta como participante confirmado cuando cumple **AMBAS** condiciones:

```javascript
status === 'confirmado' && paymentStatus === 'completo'
```

**Esto significa:**
- ✅ `status: 'confirmado'` + `paymentStatus: 'completo'` → **CUENTA como participante**
- ❌ `status: 'confirmado'` + `paymentStatus: 'seña'` → **NO CUENTA**
- ❌ `status: 'confirmado'` + `paymentStatus: 'pendiente'` → **NO CUENTA**
- ❌ `status: 'interesado'` + `paymentStatus: 'completo'` → **NO CUENTA**

### Cálculo de Disponibilidad

La disponibilidad se calcula **dinámicamente** contando leads confirmados:

```javascript
const confirmedCount = await Lead.countDocuments({
  retreat: retreatId,
  status: 'confirmado',
  paymentStatus: 'completo'
});

const availableSpots = maxParticipants - confirmedCount;
```

**NO se usa un campo `currentParticipants` en el modelo Retreat**, se calcula en tiempo real.

---

## 📊 Enums Centralizados

### Estados del Lead (`status`)

| Valor | Label | Significado |
|-------|-------|-------------|
| `nuevo` | Nuevo | Lead recién creado, sin contactar |
| `contactado` | Contactado | Ya se contactó al lead |
| `interesado` | Interesado | Mostró interés en reservar |
| `confirmado` | Confirmado | Confirmó asistencia (revisar pago) |
| `descartado` | Descartado | No asistirá o no respondió |

### Estados de Pago (`paymentStatus`)

| Valor | Label | Significado |
|-------|-------|-------------|
| `pendiente` | Pendiente | No pagó nada aún |
| `seña` | Seña | Pagó una seña/adelanto |
| `completo` | Completo | Pagó el monto total |

### Métodos de Pago (`paymentMethod`)

| Valor | Label |
|-------|-------|
| `''` | Seleccionar... |
| `transferencia` | Transferencia |
| `mercadopago` | MercadoPago |
| `efectivo` | Efectivo |

### Tipos de Interés (`interest`)

| Valor | Label |
|-------|-------|
| `reservar` | Reservar |
| `info` | Información |
| `consulta` | Consulta |

### Fuentes de Lead (`source`)

| Valor | Label |
|-------|-------|
| `landing` | Landing Page |
| `instagram` | Instagram |
| `facebook` | Facebook |
| `referido` | Referido |
| `otro` | Otro |

---

## 🔄 Flujo de Actualización

### Escenario: Lead paga completo

```
1. Admin abre LeadDetail
2. Cambia paymentStatus de 'seña' → 'completo'
3. Cambia status a 'confirmado' (si no lo estaba)
4. Hace clic en "Guardar Cambios"
5. Frontend → POST /api/leads/:id
6. Backend leadService.updateLead():
   - Obtiene lead actual
   - Verifica si estaba confirmado: NO (seña != completo)
   - Actualiza el lead
   - Verifica si está confirmado ahora: SÍ (confirmado + completo)
   - Detecta cambio en disponibilidad
   - Actualiza confirmedAt = new Date()
7. Respuesta al frontend con availabilityChanged: true
8. La próxima vez que se consulte el retiro, availableSpots será menor
```

### Escenario: Lead cancela (confirmado → descartado)

```
1. Admin cambia status de 'confirmado' → 'descartado'
2. leadService.updateLead():
   - Estaba confirmado: SÍ
   - Está confirmado ahora: NO
   - Detecta cambio en disponibilidad
3. La próxima vez que se consulte el retiro, availableSpots será mayor
```

---

## 🛠️ Archivos Clave

### Backend

#### `backend/constants/enums.js`
- **Propósito**: Definir todos los valores permitidos (enums)
- **Funciones útiles**:
  - `isLeadFullyConfirmed(status, paymentStatus)`: Verifica si un lead cuenta como confirmado
  - `countsAsConfirmedParticipant(status, paymentStatus)`: Alias de la anterior

#### `backend/services/leadService.js`
- **Propósito**: Lógica de negocio de leads
- **Métodos principales**:
  - `getConfirmedParticipantsCount(retreatId)`: Cuenta participantes confirmados
  - `updateLead(id, updateData)`: Actualiza lead y detecta cambios en disponibilidad
  - `createLead(leadData)`: Crea lead y verifica disponibilidad
  - `deleteLead(id)`: Elimina lead y detecta si afecta disponibilidad

#### `backend/services/retreatService.js`
- **Propósito**: Lógica de negocio de retiros
- **Método clave**:
  - `enrichRetreatWithParticipants(retreat)`: Agrega `currentParticipants`, `availableSpots`, `isFull` al retiro

#### `backend/models/Lead.js`
- **Propósito**: Schema de MongoDB para leads
- **Validaciones**:
  - Email + retreat deben ser únicos (no duplicados)
  - Enums validados contra constantes centralizadas
- **Virtual**: `isConfirmed` (getter calculado)

#### `backend/controllers/leadController.js`
- **Propósito**: Manejo de HTTP (req/res)
- **Responsabilidad**: Solo llamar al service y devolver respuesta

### Frontend

#### `frontend/src/constants/enums.js`
- **Propósito**: Mismos enums que el backend, para el frontend
- **Formato**: Arrays de `{ value, label }` para dropdowns
- **Importante**: Mantener sincronizado con backend

#### `frontend/src/components/admin/leads/LeadDetail.jsx`
- **Propósito**: UI para editar un lead
- **Usa**: Enums centralizados para dropdowns
- **Funcionalidad**: Guardado manual (no automático)

---

## ✅ Buenas Prácticas Implementadas

### 1. **Enums Centralizados**
- ✅ Un solo lugar para definir valores
- ✅ Fácil de mantener y actualizar
- ✅ Sincronización entre frontend y backend
- ✅ Previene typos y errores

### 2. **Service Layer**
- ✅ Lógica de negocio separada de HTTP
- ✅ Reutilizable en diferentes contextos
- ✅ Fácil de testear
- ✅ Controladores ligeros

### 3. **Cálculo Dinámico de Disponibilidad**
- ✅ No hay campo `currentParticipants` en BD
- ✅ Se calcula en tiempo real contando leads
- ✅ Siempre preciso, no hay desincronización
- ✅ Menos propenso a errores

### 4. **Validaciones Robustas**
- ✅ Validación en modelo (MongoDB)
- ✅ Validación en service (lógica de negocio)
- ✅ Mensajes de error claros
- ✅ Prevención de duplicados

### 5. **Logging para Debugging**
- ✅ Logs en operaciones críticas
- ✅ Fácil identificar problemas
- ✅ Trazabilidad de cambios

---

## 🚀 Uso en Producción

### Crear un Lead (Público)

```javascript
POST /api/leads
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 9 11 1234-5678",
  "message": "Quiero reservar para el retiro",
  "interest": "reservar",
  "retreat": "60d5ec49f1b2c72b8c8e4f1a"
}
```

### Actualizar Lead (Admin)

```javascript
PUT /api/leads/:id
{
  "status": "confirmado",
  "paymentStatus": "completo",
  "paymentAmount": 888888,
  "paymentMethod": "transferencia",
  "notes": "Pagó por transferencia el 12/10/2025"
}
```

### Obtener Disponibilidad de un Retiro

```javascript
GET /api/retreats/:id

Response:
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "title": "Retiro de Año Nuevo 2026",
    "maxParticipants": 20,
    "currentParticipants": 5,  // Calculado dinámicamente
    "availableSpots": 15,       // Calculado dinámicamente
    "isFull": false             // Calculado dinámicamente
  }
}
```

---

## 🔍 Debugging

### Ver cuántos leads confirmados tiene un retiro

```javascript
// En MongoDB Compass o shell
db.leads.countDocuments({
  retreat: ObjectId("60d5ec49f1b2c72b8c8e4f1a"),
  status: "confirmado",
  paymentStatus: "completo"
})
```

### Ver logs de actualización

```bash
# En la consola del backend verás:
📊 ACTUALIZACIÓN DE LEAD:
   Lead ID: 60d5ec49f1b2c72b8c8e4f1b
   Retiro: Retiro de Año Nuevo 2026
   Estado anterior: interesado / seña
   Estado nuevo: confirmado / completo
   Estaba confirmado: false
   Está confirmado ahora: true
   Cambio en disponibilidad: true
```

---

## 🎓 Preguntas Frecuentes

### ¿Por qué no usar un campo `currentParticipants` en Retreat?

**Respuesta**: Porque sería propenso a desincronización. Si un lead se elimina o cambia de estado, habría que recordar actualizar ese campo. Con el cálculo dinámico, siempre es preciso.

### ¿Qué pasa si borro un lead confirmado?

**Respuesta**: El `leadService.deleteLead()` detecta si el lead estaba confirmado y retorna `availabilityChanged: true`. La próxima consulta al retiro mostrará un lugar más disponible.

### ¿Puedo tener un lead con status 'confirmado' pero pago 'pendiente'?

**Respuesta**: Sí, puedes. Pero **NO contará como participante confirmado** para la disponibilidad. Solo cuenta cuando ambos son `confirmado` + `completo`.

### ¿Cómo agrego un nuevo estado de pago?

**Respuesta**:
1. Agregar en `backend/constants/enums.js` → `PAYMENT_STATUS`
2. Agregar en `frontend/src/constants/enums.js` → `PAYMENT_STATUS_OPTIONS`
3. Listo, se aplicará automáticamente en toda la app

---

## 📝 Checklist de Mantenimiento

Al modificar enums:
- [ ] Actualizar `backend/constants/enums.js`
- [ ] Actualizar `frontend/src/constants/enums.js`
- [ ] Verificar que los valores coincidan exactamente
- [ ] Probar en desarrollo antes de desplegar

Al agregar nuevos campos a Lead:
- [ ] Agregar en `backend/models/Lead.js`
- [ ] Agregar validaciones si es necesario
- [ ] Actualizar `leadService.js` si afecta lógica de negocio
- [ ] Actualizar frontend si es necesario

---

## 🏆 Resultado Final

✅ **Sistema robusto y mantenible**
✅ **Enums centralizados y sincronizados**
✅ **Disponibilidad calculada dinámicamente**
✅ **Service layer con lógica de negocio clara**
✅ **Fácil de debuggear y extender**
✅ **Buenas prácticas aplicadas**

---

**Desarrollado con ❤️ para Soul Experiences**
