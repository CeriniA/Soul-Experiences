import Lead from '../models/Lead.js';
import Retreat from '../models/Retreat.js';
import { LEAD_STATUS, PAYMENT_STATUS, countsAsConfirmedParticipant } from '../constants/enums.js';
import AppError from '../utils/AppError.js';

/**
 * Servicio para manejar la lógica de negocio de los leads
 * Incluye lógica automática de actualización de disponibilidad de retiros
 */
class LeadService {
  
  /**
   * Calcular participantes confirmados de un retiro
   * @param {string} retreatId - ID del retiro
   * @returns {number} Cantidad de participantes confirmados
   */
  async getConfirmedParticipantsCount(retreatId) {
    const count = await Lead.countDocuments({
      retreat: retreatId,
      status: LEAD_STATUS.CONFIRMADO,
      paymentStatus: PAYMENT_STATUS.COMPLETO
    });
    return count;
  }

  /**
   * Obtener todos los leads con filtros y paginación
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación
   * @returns {Object} Resultado con leads y metadatos
   */
  async getAllLeads(filters = {}, options = {}) {
    try {
      const { 
        status, 
        paymentStatus, 
        retreat, 
        limit = 10, 
        page = 1, 
        sort = '-createdAt' 
      } = { ...filters, ...options };
      
      // Construir filtros
      const filter = {};
      if (status) filter.status = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;
      if (retreat) filter.retreat = retreat;

      const leads = await Lead.find(filter)
        .populate('retreat', 'title startDate endDate price')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Lead.countDocuments(filter);

      // Estadísticas rápidas
      const stats = await Lead.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$paymentAmount' }
          }
        }
      ]);

      return {
        success: true,
        count: leads.length,
        total,
        stats,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        },
        data: leads
      };
    } catch (error) {
      if (error instanceof AppError || error.statusCode) throw error;
      throw AppError.internal(`Error al obtener leads: ${error.message}`);
    }
  }

  /**
   * Obtener lead por ID
   * @param {string} id - ID del lead
   * @returns {Object} Lead encontrado
   */
  async getLeadById(id) {
    try {
      const lead = await Lead.findById(id)
        .populate('retreat', 'title startDate endDate price location maxParticipants');

      if (!lead) {
        throw AppError.notFound('Lead no encontrado');
      }

      // Enriquecer con datos de disponibilidad del retiro
      if (lead.retreat) {
        const confirmedCount = await this.getConfirmedParticipantsCount(lead.retreat._id);
        const leadObj = lead.toObject();
        leadObj.retreat.currentParticipants = confirmedCount;
        leadObj.retreat.availableSpots = Math.max(0, lead.retreat.maxParticipants - confirmedCount);
        leadObj.retreat.isFull = confirmedCount >= lead.retreat.maxParticipants;
        return {
          success: true,
          data: leadObj
        };
      }

      return {
        success: true,
        data: lead
      };
    } catch (error) {
      if (error instanceof AppError || error.statusCode) {
        throw error;
      }
      throw AppError.internal(`Error al obtener lead: ${error.message}`);
    }
  }

  /**
   * Crear nuevo lead
   * @param {Object} leadData - Datos del lead
   * @returns {Object} Lead creado
   */
  async createLead(leadData) {
    try {
      // Verificar que el retiro existe y está activo
      const retreat = await Retreat.findOne({
        _id: leadData.retreat,
        status: 'active'
      });

      if (!retreat) {
        throw AppError.badRequest('Retiro no disponible');
      }

      // Verificar disponibilidad
      const confirmedCount = await this.getConfirmedParticipantsCount(leadData.retreat);
      if (confirmedCount >= retreat.maxParticipants) {
        throw AppError.badRequest('El retiro está completo. No hay lugares disponibles.');
      }

      // Verificar si ya existe un lead con este email para este retiro
      const existingLead = await Lead.findOne({ 
        email: leadData.email, 
        retreat: leadData.retreat 
      });
      
      if (existingLead) {
        throw AppError.badRequest('Ya existe una consulta con este email para este retiro');
      }

      const lead = await Lead.create({
        ...leadData,
        interest: leadData.interest || 'consulta',
        source: leadData.source || 'landing'
      });

      // Poblar datos del retiro para la respuesta
      await lead.populate('retreat', 'title startDate endDate price');

      return {
        success: true,
        message: 'Consulta enviada exitosamente. Te contactaremos pronto.',
        data: lead
      };
    } catch (error) {
      if (error.code === 11000) {
        throw AppError.badRequest('Ya enviaste una consulta para este retiro');
      }

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw AppError.validationError('Error de validación', { errors: messages });
      }

      if (error instanceof AppError || error.statusCode) {
        throw error;
      }

      throw AppError.internal(`Error al crear lead: ${error.message}`);
    }
  }

  /**
   * Actualizar lead con lógica de disponibilidad automática
   * @param {string} id - ID del lead
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Lead actualizado
   */
  async updateLead(id, updateData) {
    try {
      // Obtener lead actual
      const currentLead = await Lead.findById(id);
      if (!currentLead) {
        throw AppError.notFound('Lead no encontrado');
      }

      // Verificar si el lead estaba confirmado antes
      const wasConfirmed = countsAsConfirmedParticipant(
        currentLead.status, 
        currentLead.paymentStatus
      );

      // Actualizar el lead
      const updatedLead = await Lead.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      ).populate('retreat', 'title startDate endDate price maxParticipants');

      // Verificar si el lead está confirmado ahora
      const isConfirmedNow = countsAsConfirmedParticipant(
        updatedLead.status, 
        updatedLead.paymentStatus
      );

      // Actualizar fechas de contacto/confirmación si corresponde
      const additionalUpdates = {};
      
      if (updateData.status === LEAD_STATUS.CONTACTADO && !currentLead.contactedAt) {
        additionalUpdates.contactedAt = new Date();
      }
      
      if (isConfirmedNow && !currentLead.confirmedAt) {
        additionalUpdates.confirmedAt = new Date();
      }

      if (Object.keys(additionalUpdates).length > 0) {
        await Lead.findByIdAndUpdate(id, additionalUpdates);
        Object.assign(updatedLead, additionalUpdates);
      }

      // Log para debugging
      console.log('📊 ACTUALIZACIÓN DE LEAD:');
      console.log('   Lead ID:', id);
      console.log('   Retiro:', updatedLead.retreat?.title);
      console.log('   Estado anterior:', currentLead.status, '/', currentLead.paymentStatus);
      console.log('   Estado nuevo:', updatedLead.status, '/', updatedLead.paymentStatus);
      console.log('   Estaba confirmado:', wasConfirmed);
      console.log('   Está confirmado ahora:', isConfirmedNow);
      console.log('   Cambio en disponibilidad:', wasConfirmed !== isConfirmedNow);

      return {
        success: true,
        message: 'Lead actualizado exitosamente',
        data: updatedLead,
        availabilityChanged: wasConfirmed !== isConfirmedNow
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw AppError.validationError('Error de validación', { errors: messages });
      }

      if (error instanceof AppError || error.statusCode) {
        throw error;
      }

      throw AppError.internal(`Error al actualizar lead: ${error.message}`);
    }
  }

  /**
   * Eliminar lead
   * @param {string} id - ID del lead
   * @returns {Object} Confirmación de eliminación
   */
  async deleteLead(id) {
    try {
      const lead = await Lead.findById(id);

      if (!lead) {
        throw AppError.notFound('Lead no encontrado');
      }

      // Verificar si estaba confirmado (afecta disponibilidad)
      const wasConfirmed = countsAsConfirmedParticipant(lead.status, lead.paymentStatus);

      await Lead.findByIdAndDelete(id);

      console.log('🗑️ LEAD ELIMINADO:');
      console.log('   Lead ID:', id);
      console.log('   Estaba confirmado:', wasConfirmed);
      console.log('   Afecta disponibilidad:', wasConfirmed);

      return {
        success: true,
        message: 'Lead eliminado exitosamente',
        availabilityChanged: wasConfirmed
      };
    } catch (error) {
      if (error instanceof AppError || error.statusCode) {
        throw error;
      }
      throw AppError.internal(`Error al eliminar lead: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de leads
   * @returns {Object} Estadísticas generales
   */
  async getLeadStats() {
    try {
      const stats = await Lead.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            nuevos: { $sum: { $cond: [{ $eq: ['$status', LEAD_STATUS.NUEVO] }, 1, 0] } },
            contactados: { $sum: { $cond: [{ $eq: ['$status', LEAD_STATUS.CONTACTADO] }, 1, 0] } },
            interesados: { $sum: { $cond: [{ $eq: ['$status', LEAD_STATUS.INTERESADO] }, 1, 0] } },
            confirmados: { $sum: { $cond: [{ $eq: ['$status', LEAD_STATUS.CONFIRMADO] }, 1, 0] } },
            totalPagado: { $sum: '$paymentAmount' }
          }
        },
        {
          $addFields: {
            conversionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$confirmados', '$total'] }, 100] },
                0
              ]
            }
          }
        }
      ]);

      // Estadísticas del mes actual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthStats = await Lead.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            esteMes: { $sum: 1 },
            nuevosEsteMes: { $sum: { $cond: [{ $eq: ['$status', LEAD_STATUS.NUEVO] }, 1, 0] } },
            confirmadosEsteMes: { $sum: { $cond: [{ $eq: ['$status', LEAD_STATUS.CONFIRMADO] }, 1, 0] } }
          }
        }
      ]);

      const result = {
        ...(stats[0] || {
          total: 0,
          nuevos: 0,
          contactados: 0,
          interesados: 0,
          confirmados: 0,
          totalPagado: 0,
          conversionRate: 0
        }),
        ...(monthStats[0] || {
          esteMes: 0,
          nuevosEsteMes: 0,
          confirmadosEsteMes: 0
        })
      };

      return {
        success: true,
        data: result
      };
    } catch (error) {
      if (error instanceof AppError || error.statusCode) throw error;
      throw AppError.internal(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

// Exportar una instancia del servicio
export default new LeadService();
