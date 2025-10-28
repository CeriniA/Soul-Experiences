# ✅ Implementación: Virtual Field `computedStatus`

## 🎯 Problema Resuelto

**Antes:** El campo `status` era manual y podía estar desactualizado
**Ahora:** El campo `computedStatus` se calcula automáticamente basado en fechas

---

## 📊 Cómo Funciona

### **Backend: Virtual Field en Mongoose**

```javascript
// models/Retreat.js

retreatSchema.virtual('computedStatus').get(function() {
  const now = new Date();
  
  // Respetar status manual para draft y cancelled
  if (this.status === 'draft' || this.status === 'cancelled') {
    return this.status;
  }
  
  // Calcular automáticamente basado en fechas
  if (this.endDate < now) {
    return 'completed'; // Retiro terminó
  } else if (this.startDate <= now && now <= this.endDate) {
    return 'in_progress'; // Retiro en curso
  } else if (this.startDate > now) {
    return 'upcoming'; // Retiro próximo
  }
  
  return this.status; // Fallback
});
```

**Características:**
- ✅ Se calcula automáticamente al acceder
- ✅ NO se guarda en la base de datos
- ✅ Siempre está actualizado
- ✅ Se incluye automáticamente en JSON

---

### **Frontend: Usa `computedStatus` con Fallback**

```javascript
// utils/retreatHelpers.js

export const getRetreatStatus = (retreat) => {
  // Priorizar computedStatus del backend
  if (retreat.computedStatus) {
    return retreat.computedStatus;
  }
  
  // Fallback: calcular localmente
  // (para compatibilidad con datos antiguos)
  // ...
}
```

---

## 🎨 Estados Disponibles

| Estado | Descripción | Cuándo |
|--------|-------------|--------|
| `draft` | Borrador | Manual (admin) |
| `cancelled` | Cancelado | Manual (admin) |
| `upcoming` | Próximo | `startDate > now` |
| `in_progress` | En curso | `startDate <= now <= endDate` |
| `completed` | Completado | `endDate < now` |

---

## 🔧 Uso en el Código

### **Backend**

```javascript
// Obtener un retiro
const retreat = await Retreat.findById(id);

// Acceder al status computado
console.log(retreat.computedStatus); // 'upcoming', 'completed', etc.

// Verificar si está disponible
if (retreat.isAvailableForBooking()) {
  // Permitir reserva
}

// El computedStatus se incluye automáticamente en JSON
res.json({ data: retreat }); // Incluye computedStatus
```

### **Frontend**

```javascript
import { getRetreatStatus, getRetreatBadge, isAvailableForBooking } from '@/utils/retreatHelpers';

// Obtener status
const status = getRetreatStatus(retreat); // 'upcoming', 'completed', etc.

// Obtener badge
const badge = getRetreatBadge(retreat);
<Badge bg={badge.variant}>{badge.text}</Badge>

// Verificar disponibilidad
if (isAvailableForBooking(retreat)) {
  <Button>Reservar Mi Lugar</Button>
}
```

---

## 📝 Ventajas de Esta Solución

### **1. Una Sola Fuente de Verdad**
```javascript
// Backend calcula
retreat.computedStatus → 'completed'

// Frontend usa directamente
getRetreatStatus(retreat) → 'completed'

// ✅ Siempre consistente
```

### **2. Sin Mantenimiento Manual**
```javascript
// ❌ ANTES: Admin debía cambiar status manualmente
status: 'active' // Pero endDate < now (inconsistente)

// ✅ AHORA: Se calcula automáticamente
computedStatus: 'completed' // Siempre correcto
```

### **3. Respeta Status Manual**
```javascript
// Draft y Cancelled se respetan
status: 'draft' → computedStatus: 'draft'
status: 'cancelled' → computedStatus: 'cancelled'

// Active se calcula
status: 'active' + endDate < now → computedStatus: 'completed'
```

### **4. Performance**
```javascript
// ✅ NO requiere queries adicionales
// ✅ NO requiere cron jobs
// ✅ Se calcula solo cuando se accede
// ✅ Muy rápido (comparación de fechas)
```

---

## 🧪 Testing

### **Test 1: Retiro Próximo**
```javascript
const retreat = {
  status: 'active',
  startDate: new Date('2024-12-01'),
  endDate: new Date('2024-12-05')
};

// Hoy: 2024-10-24
retreat.computedStatus // → 'upcoming'
```

### **Test 2: Retiro en Curso**
```javascript
const retreat = {
  status: 'active',
  startDate: new Date('2024-10-20'),
  endDate: new Date('2024-10-25')
};

// Hoy: 2024-10-24
retreat.computedStatus // → 'in_progress'
```

### **Test 3: Retiro Completado**
```javascript
const retreat = {
  status: 'active',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-01-20')
};

// Hoy: 2024-10-24
retreat.computedStatus // → 'completed'
```

### **Test 4: Respeta Draft**
```javascript
const retreat = {
  status: 'draft',
  startDate: new Date('2024-12-01'),
  endDate: new Date('2024-12-05')
};

// Hoy: 2024-10-24
retreat.computedStatus // → 'draft' (no 'upcoming')
```

---

## 🔄 Migración desde Código Anterior

### **Cambios en Nombres de Estados**

| Antes | Ahora |
|-------|-------|
| `'past'` | `'completed'` |
| `'active'` | `'in_progress'` |
| `'upcoming'` | `'upcoming'` ✅ |

### **Compatibilidad**

El código tiene **fallback automático**:
```javascript
// Si el backend no tiene computedStatus (datos viejos)
// El frontend calcula localmente
export const getRetreatStatus = (retreat) => {
  if (retreat.computedStatus) {
    return retreat.computedStatus; // Usar del backend
  }
  
  // Fallback: calcular localmente
  // ...
}
```

---

## 📚 API Reference

### **Backend**

#### **Virtual Field**
```javascript
retreat.computedStatus
// Retorna: 'draft' | 'cancelled' | 'upcoming' | 'in_progress' | 'completed'
```

#### **Método Helper**
```javascript
retreat.isAvailableForBooking()
// Retorna: boolean
// true si computedStatus === 'upcoming' && availableSpots > 0
```

### **Frontend**

#### **getRetreatStatus(retreat)**
```javascript
getRetreatStatus(retreat)
// Retorna: 'draft' | 'cancelled' | 'upcoming' | 'in_progress' | 'completed'
```

#### **getRetreatBadge(retreat)**
```javascript
getRetreatBadge(retreat)
// Retorna: { variant: string, icon: string, text: string }
```

#### **isPastRetreat(retreat)**
```javascript
isPastRetreat(retreat)
// Retorna: boolean (true si completed)
```

#### **isActiveRetreat(retreat)**
```javascript
isActiveRetreat(retreat)
// Retorna: boolean (true si in_progress)
```

#### **isUpcomingRetreat(retreat)**
```javascript
isUpcomingRetreat(retreat)
// Retorna: boolean (true si upcoming)
```

#### **isAvailableForBooking(retreat)**
```javascript
isAvailableForBooking(retreat)
// Retorna: boolean (true si upcoming con cupos)
```

#### **getRetreatCTA(retreat)**
```javascript
getRetreatCTA(retreat)
// Retorna: string (texto del botón)
```

---

## 🚀 Próximos Pasos (Opcional)

### **1. Actualizar Admin Dashboard**
Mostrar `computedStatus` en la lista de retiros:
```javascript
<Badge bg={getStatusColor(retreat.computedStatus)}>
  {retreat.computedStatus}
</Badge>
```

### **2. Agregar Alertas**
Si `status !== computedStatus`:
```javascript
{retreat.status === 'active' && retreat.computedStatus === 'completed' && (
  <Alert variant="warning">
    ⚠️ Este retiro terminó. Considera cambiar el status a 'completed'.
  </Alert>
)}
```

### **3. Migración de Datos**
Script para actualizar status en BD (opcional):
```javascript
// scripts/updateRetreatStatus.js
const retreats = await Retreat.find({ status: 'active' });

for (const retreat of retreats) {
  if (retreat.computedStatus === 'completed') {
    retreat.status = 'completed';
    await retreat.save();
    console.log(`✅ Actualizado: ${retreat.title}`);
  }
}
```

---

## ✅ Checklist de Verificación

### **Backend**
- [x] ✅ Virtual field `computedStatus` agregado
- [x] ✅ Método `isAvailableForBooking()` agregado
- [x] ✅ `toJSON` configurado con virtuals

### **Frontend**
- [x] ✅ `getRetreatStatus()` usa `computedStatus` con fallback
- [x] ✅ `getRetreatBadge()` maneja todos los estados
- [x] ✅ Estados renombrados: 'past' → 'completed', 'active' → 'in_progress'
- [x] ✅ Nueva función `isAvailableForBooking()`

### **Testing**
- [ ] Probar retiro próximo
- [ ] Probar retiro en curso
- [ ] Probar retiro completado
- [ ] Probar retiro draft
- [ ] Probar retiro cancelled

---

## 📖 Documentación Adicional

### **Mongoose Virtuals**
https://mongoosejs.com/docs/tutorials/virtuals.html

### **Por Qué Virtual Fields**
- No ocupan espacio en BD
- Siempre actualizados
- Fáciles de mantener
- Performance óptimo

---

## 🎉 Resumen

**Archivos Modificados:** 2
- `backend/models/Retreat.js` - Virtual field + método helper
- `frontend/src/utils/retreatHelpers.js` - Usa computedStatus

**Beneficios:**
- ✅ Status siempre correcto
- ✅ Sin mantenimiento manual
- ✅ Una sola fuente de verdad
- ✅ Backward compatible

**Tiempo de Implementación:** ~20 minutos
**Impacto:** Alto (soluciona problema de raíz)

---

¡Listo! Ahora el status de los retiros se calcula automáticamente. 🚀
