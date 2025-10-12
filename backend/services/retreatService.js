import Retreat from '../models/Retreat.js';
import Lead from '../models/Lead.js';

/**
 * Servicio para manejar la lógica de negocio de los retiros
 * Contiene toda la lógica de manipulación de datos y reglas de negocio
 */
class RetreatService {
  
  /**
   * Enriquecer un retiro con datos de participantes confirmados
   * @param {Object} retreat - Objeto del retiro
   * @returns {Object} Retiro enriquecido con currentParticipants
   */
  async enrichRetreatWithParticipants(retreat) {
    const currentParticipants = await Lead.countDocuments({
      retreat: retreat._id,
      status: 'confirmado'
    });
    
    const retreatObj = retreat.toObject ? retreat.toObject() : retreat;
    retreatObj.currentParticipants = currentParticipants;
    retreatObj.availableSpots = Math.max(0, retreat.maxParticipants - currentParticipants);
    retreatObj.isFull = currentParticipants >= retreat.maxParticipants;
    
    return retreatObj;
  }

  /**
   * Obtener todos los retiros con filtros y paginación
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación y ordenamiento
   * @param {Object} user - Usuario autenticado (opcional)
   * @returns {Object} Resultado con retiros y metadatos de paginación
   */
  async getAllRetreats(filters = {}, options = {}, user = null) {
    try {
      const { 
        status, 
        limit = 10, 
        page = 1, 
        sort = '-createdAt' 
      } = { ...filters, ...options };
      
      // Construir filtros
      const filter = {};
      if (status) filter.status = status;
      
      // Para usuarios no autenticados, solo mostrar retiros activos
      if (!user) {
        filter.status = 'active';
      }

      // Ejecutar consulta con paginación
      const retreats = await Retreat.find(filter)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Retreat.countDocuments(filter);

      // Enriquecer cada retiro con datos de participantes
      const enrichedRetreats = await Promise.all(
        retreats.map(retreat => this.enrichRetreatWithParticipants(retreat))
      );

      return {
        success: true,
        data: enrichedRetreats,
        count: enrichedRetreats.length,
        total,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener retiros: ${error.message}`);
    }
  }

  /**
   * Obtener un retiro por ID o slug
   * @param {string} identifier - ID o slug del retiro
   * @returns {Object} Retiro encontrado con participantes
   */
  async getRetreatById(identifier) {
    try {
      // Buscar retiro por ID o slug
      const retreat = await Retreat.findOne({
        $or: [
          { _id: identifier },
          { slug: identifier }
        ]
      });

      if (!retreat) {
        const error = new Error('Retiro no encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Enriquecer con datos de participantes
      const enrichedRetreat = await this.enrichRetreatWithParticipants(retreat);

      return {
        success: true,
        data: enrichedRetreat
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al obtener retiro: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo retiro
   * @param {Object} retreatData - Datos del retiro
   * @returns {Object} Retiro creado
   */
  async createRetreat(retreatData) {
    try {
      // Validar estado antes de crear
      this.validateStatusBeforeSave(retreatData);
      
      const retreat = await Retreat.create(retreatData);

      return {
        success: true,
        data: retreat,
        message: 'Retiro creado exitosamente'
      };
    } catch (error) {
      // Manejar errores específicos
      if (error.code === 11000) {
        const duplicateError = new Error('Ya existe un retiro con ese slug');
        duplicateError.statusCode = 400;
        throw duplicateError;
      }

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.messages = messages;
        throw validationError;
      }

      if (error.statusCode) {
        throw error;
      }

      throw new Error(`Error al crear retiro: ${error.message}`);
    }
  }

  /**
   * Actualizar un retiro existente
   * @param {string} id - ID del retiro
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Retiro actualizado
   */
  async updateRetreat(id, updateData) {
    try {
      console.log('🔄 Actualizando retiro:', id);
      console.log('📦 Datos recibidos:', JSON.stringify(updateData, null, 2));
      
      // Limpiar datos: convertir strings vacíos en undefined para campos numéricos
      const cleanedData = { ...updateData };
      
      // Limpiar campos numéricos que pueden venir como strings vacíos
      if (cleanedData.price === '' || cleanedData.price === null) delete cleanedData.price;
      if (cleanedData.maxParticipants === '' || cleanedData.maxParticipants === null) delete cleanedData.maxParticipants;
      if (cleanedData.heroImageIndex === '' || cleanedData.heroImageIndex === null) delete cleanedData.heroImageIndex;
      
      // Limpiar objetos anidados vacíos
      if (cleanedData.location && Object.keys(cleanedData.location).length === 0) {
        delete cleanedData.location;
      }
      if (cleanedData.foodInfo && Object.keys(cleanedData.foodInfo).length === 0) {
        delete cleanedData.foodInfo;
      }
      if (cleanedData.policies && Object.keys(cleanedData.policies).length === 0) {
        delete cleanedData.policies;
      }
      
      console.log('🧹 Datos limpiados:', JSON.stringify(cleanedData, null, 2));
      
      // Obtener retiro actual para validar con todos los datos
      const currentRetreat = await Retreat.findById(id);
      if (!currentRetreat) {
        const error = new Error('Retiro no encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Combinar datos actuales con actualizaciones para validación completa
      const mergedData = { ...currentRetreat.toObject(), ...cleanedData };
      
      // Validación manual de fechas si se actualizan
      if (mergedData.startDate && mergedData.endDate) {
        const startDate = new Date(mergedData.startDate);
        const endDate = new Date(mergedData.endDate);
        
        if (endDate < startDate) {
          const validationError = new Error('La fecha de fin debe ser posterior o igual a la fecha de inicio');
          validationError.statusCode = 400;
          validationError.messages = ['La fecha de fin debe ser posterior o igual a la fecha de inicio'];
          throw validationError;
        }
      }
      
      // Validar estado antes de actualizar
      this.validateStatusBeforeSave(mergedData);
      
      const retreat = await Retreat.findByIdAndUpdate(
        id,
        cleanedData,  // Usar datos limpiados en lugar de updateData
        {
          new: true,
          runValidators: false  // Usamos validación manual
        }
      );

      return {
        success: true,
        data: retreat,
        message: 'Retiro actualizado exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.messages = messages;
        validationError.details = error.errors;
        throw validationError;
      }

      if (error.name === 'CastError') {
        console.error('❌ CastError al actualizar retiro:', {
          path: error.path,
          value: error.value,
          kind: error.kind,
          message: error.message
        });
        const castError = new Error(`Error de formato en el campo "${error.path}": valor "${error.value}" no es válido`);
        castError.statusCode = 400;
        castError.path = error.path;
        castError.value = error.value;
        throw castError;
      }

      throw new Error(`Error al actualizar retiro: ${error.message}`);
    }
  }

  /**
   * Eliminar un retiro
   * @param {string} id - ID del retiro
   * @returns {Object} Confirmación de eliminación
   */
  async deleteRetreat(id) {
    try {
      const retreat = await Retreat.findByIdAndDelete(id);

      if (!retreat) {
        const error = new Error('Retiro no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        message: 'Retiro eliminado exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al eliminar retiro: ${error.message}`);
    }
  }

  /**
   * Obtener retiro activo para el hero
   * @returns {Object} Retiro activo para mostrar en hero
   */
  async getActiveRetreat() {
    try {
      // Primero buscar retiros activos marcados para mostrar en hero
      let retreat = await Retreat.findOne({ 
        status: 'active',
        showInHero: true,
        startDate: { $gte: new Date() }
      }).sort({ startDate: 1 });

      // Si no hay retiros activos con showInHero, buscar cualquier retiro activo
      if (!retreat) {
        retreat = await Retreat.findOne({ 
          status: 'active',
          startDate: { $gte: new Date() }
        }).sort({ startDate: 1 });
      }

      if (!retreat) {
        const error = new Error('No hay retiros activos disponibles');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: retreat
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al obtener retiro activo: ${error.message}`);
    }
  }

  /**
   * Obtener retiros pasados
   * @param {number} limit - Límite de resultados
   * @returns {Object} Lista de retiros pasados
   */
  async getPastRetreats(limit = 5) {
    try {
      const retreats = await Retreat.find({ 
        status: 'completed',
        endDate: { $lt: new Date() }
      })
      .sort({ endDate: -1 })
      .limit(limit);

      return {
        success: true,
        data: retreats,
        count: retreats.length
      };
    } catch (error) {
      throw new Error(`Error al obtener retiros pasados: ${error.message}`);
    }
  }

  /**
   * Obtener datos completos para el hero (activos y pasados)
   * @returns {Object} Datos completos para el hero
   */
  async getHeroData() {
    try {
      // Buscar todos los retiros activos futuros
      const activeRetreats = await Retreat.find({ 
        status: 'active',
        startDate: { $gte: new Date() }
      }).sort({ startDate: 1 });

      // Priorizar retiros con showInHero: true
      const heroRetreats = activeRetreats.filter(retreat => retreat.showInHero);
      const finalActiveRetreats = heroRetreats.length > 0 ? heroRetreats : activeRetreats;

      // Obtener retiros pasados para fallback
      const pastRetreats = await Retreat.find({ 
        status: 'completed',
        endDate: { $lt: new Date() }
      })
      .sort({ endDate: -1 })
      .limit(3);

      // Para compatibilidad, mantener activeRetreat como el primero
      const activeRetreat = finalActiveRetreats.length > 0 ? finalActiveRetreats[0] : null;

      return {
        success: true,
        data: {
          activeRetreat, // Para compatibilidad con código existente
          activeRetreats: finalActiveRetreats, // Todos los retiros activos para el carrusel
          pastRetreats,
          hasActiveRetreat: !!activeRetreat,
          hasMultipleActiveRetreats: finalActiveRetreats.length > 1,
          hasPastRetreats: pastRetreats.length > 0
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener datos del hero: ${error.message}`);
    }
  }

  /**
   * Validar y obtener el estado sugerido para un retiro según sus fechas
   * @param {Object} retreat - Retiro a validar
   * @returns {Object} Información sobre el estado actual y sugerido
   */
  validateRetreatStatus(retreat) {
    const now = new Date();
    
    // Estados que no necesitan validación
    if (retreat.status === 'cancelled') {
      return { current: 'cancelled', suggested: 'cancelled', needsChange: false };
    }
    
    if (retreat.status === 'draft') {
      // Si el retiro ya comenzó, sugerir activarlo
      if (retreat.startDate && now >= retreat.startDate) {
        return {
          current: 'draft',
          suggested: 'active',
          needsChange: true,
          reason: 'El retiro ya comenzó o está por comenzar. Considera activarlo.'
        };
      }
      return { current: 'draft', suggested: 'draft', needsChange: false };
    }
    
    // Si el retiro ya pasó y no está completado
    if (retreat.endDate && now > retreat.endDate) {
      if (retreat.status !== 'completed') {
        return {
          current: retreat.status,
          suggested: 'completed',
          needsChange: true,
          reason: 'El retiro ya finalizó. Deberías marcarlo como completado.'
        };
      }
    }
    
    // Si el retiro está marcado como completado pero no ha finalizado
    if (retreat.status === 'completed' && retreat.endDate && now <= retreat.endDate) {
      return {
        current: 'completed',
        suggested: 'active',
        needsChange: true,
        reason: 'El retiro aún no ha finalizado. No puede estar marcado como completado.'
      };
    }
    
    return { current: retreat.status, suggested: retreat.status, needsChange: false };
  }

  /**
   * Validar que el estado sea consistente con las fechas antes de guardar
   * @param {Object} retreatData - Datos del retiro
   * @throws {Error} Si el estado es inconsistente
   */
  validateStatusBeforeSave(retreatData) {
    const now = new Date();
    
    // Si intenta marcar como completado un retiro que no ha finalizado
    if (retreatData.status === 'completed' && retreatData.endDate) {
      const endDate = new Date(retreatData.endDate);
      if (endDate > now) {
        const error = new Error('No puedes marcar como completado un retiro que aún no ha finalizado');
        error.statusCode = 400;
        throw error;
      }
    }
  }

  /**
   * Obtener todos los retiros con estados inconsistentes
   * @returns {Array} Lista de retiros con problemas de estado
   */
  async findInconsistentRetreats() {
    try {
      const retreats = await Retreat.find({ 
        status: { $in: ['active', 'completed'] } 
      });
      
      const inconsistent = [];
      
      for (const retreat of retreats) {
        const statusCheck = this.validateRetreatStatus(retreat);
        if (statusCheck.needsChange) {
          inconsistent.push({
            id: retreat._id,
            title: retreat.title,
            current: statusCheck.current,
            suggested: statusCheck.suggested,
            reason: statusCheck.reason,
            endDate: retreat.endDate
          });
        }
      }
      
      return inconsistent;
    } catch (error) {
      throw new Error(`Error al buscar retiros inconsistentes: ${error.message}`);
    }
  }
}

// Exportar una instancia del servicio
export default new RetreatService();
