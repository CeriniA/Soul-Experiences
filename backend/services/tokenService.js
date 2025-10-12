import TestimonialToken from '../models/TestimonialToken.js';
import Lead from '../models/Lead.js';
import Retreat from '../models/Retreat.js';
import emailService from './emailService.js';

/**
 * Servicio para manejar la lógica de negocio de los tokens de testimonio
 */
class TokenService {
  
  /**
   * Generar tokens para un retiro completado
   * Genera tokens automáticamente para TODOS los participantes confirmados que no tengan token
   * @param {string} retreatId - ID del retiro (debe estar en estado 'completed')
   * @returns {Object} Tokens generados
   */
  async generateTokensForRetreat(retreatId) {
    try {
      // Verificar que el retiro existe
      const retreat = await Retreat.findById(retreatId);
      if (!retreat) {
        const error = new Error('Retiro no encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Validar que el retiro esté completado
      if (retreat.status !== 'completed') {
        const error = new Error('Solo se pueden generar tokens para retiros completados');
        error.statusCode = 400;
        error.info = {
          currentStatus: retreat.status,
          requiredStatus: 'completed',
          message: 'El retiro debe estar en estado "completed" para generar tokens de testimonios'
        };
        throw error;
      }

      // Obtener participantes confirmados del retiro
      const confirmedLeads = await Lead.find({
        retreat: retreatId,
        status: 'confirmado'
      }).select('name email');

      if (confirmedLeads.length === 0) {
        const error = new Error('No hay participantes confirmados para este retiro');
        error.statusCode = 400;
        throw error;
      }

      // Verificar cuántos tokens ya existen para este retiro
      const existingTokens = await TestimonialToken.find({ retreat: retreatId });
      const existingEmails = new Set(existingTokens.map(t => t.email));

      // Filtrar participantes que ya tienen token
      const participantsWithoutToken = confirmedLeads.filter(
        lead => !existingEmails.has(lead.email)
      );

      if (participantsWithoutToken.length === 0) {
        const error = new Error('Todos los participantes ya tienen tokens generados');
        error.statusCode = 400;
        error.info = {
          totalParticipants: confirmedLeads.length,
          tokensExisting: existingTokens.length
        };
        throw error;
      }

      // Generar tokens para TODOS los participantes sin token
      // (Se eliminó el parámetro quantity - siempre genera para todos)
      const participantsToGenerate = participantsWithoutToken;

      // Preparar datos de participantes
      const participants = participantsToGenerate.map(lead => ({
        name: lead.name,
        email: lead.email
      }));

      // Generar tokens
      const tokens = await TestimonialToken.generateForRetreat(retreatId, participants);

      // Enviar emails automáticamente
      const emailResults = { sent: [], failed: [] };
      
      try {
        console.log(`📧 Enviando ${tokens.length} emails...`);
        
        for (const token of tokens) {
          try {
            await emailService.sendTestimonialToken({
              email: token.email,
              participantName: token.participantName,
              retreatTitle: retreat.title,
              token: token.token,
              expiresAt: token.expiresAt
            });
            emailResults.sent.push(token.email);
            console.log(`✅ Email enviado a: ${token.email}`);
          } catch (emailError) {
            emailResults.failed.push({
              email: token.email,
              error: emailError.message
            });
            console.error(`❌ Error enviando email a ${token.email}:`, emailError.message);
          }
        }
        
        console.log(`📊 Resultados: ${emailResults.sent.length} enviados, ${emailResults.failed.length} fallidos`);
      } catch (error) {
        console.error('❌ Error en proceso de envío de emails:', error);
      }

      return {
        success: true,
        message: `${tokens.length} token(es) generado(s) exitosamente`,
        data: {
          retreatTitle: retreat.title,
          totalParticipants: confirmedLeads.length,
          participantsWithoutToken: participantsWithoutToken.length,
          tokensGenerated: tokens.length,
          emailsSent: emailResults.sent.length,
          emailsFailed: emailResults.failed.length,
          emailResults: emailResults,
          tokens: tokens.map(token => ({
            id: token._id,
            email: token.email,
            participantName: token.participantName,
            token: token.token,
            expiresAt: token.expiresAt
          }))
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al generar tokens: ${error.message}`);
    }
  }

  /**
   * Obtener todos los tokens con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación
   * @returns {Object} Lista de tokens
   */
  async getAllTokens(filters = {}, options = {}) {
    try {
      const { 
        retreat, 
        isUsed, 
        limit = 10, 
        page = 1, 
        sort = '-createdAt' 
      } = { ...filters, ...options };
      
      // Construir filtros
      const filter = {};
      if (retreat) filter.retreat = retreat;
      if (isUsed !== undefined) filter.isUsed = isUsed === 'true';

      const tokens = await TestimonialToken.find(filter)
        .populate('retreat', 'title startDate endDate')
        .populate('testimonial', 'rating comment isApproved')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await TestimonialToken.countDocuments(filter);

      // Estadísticas
      const stats = await TestimonialToken.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            used: { $sum: { $cond: ['$isUsed', 1, 0] } },
            expired: { 
              $sum: { 
                $cond: [
                  { $lt: ['$expiresAt', new Date()] }, 
                  1, 
                  0
                ] 
              } 
            }
          }
        }
      ]);

      return {
        success: true,
        count: tokens.length,
        total,
        stats: stats[0] || { total: 0, used: 0, expired: 0 },
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        },
        data: tokens
      };
    } catch (error) {
      throw new Error(`Error al obtener tokens: ${error.message}`);
    }
  }

  /**
   * Obtener token por ID
   * @param {string} id - ID del token
   * @returns {Object} Token encontrado
   */
  async getTokenById(id) {
    try {
      const token = await TestimonialToken.findById(id)
        .populate('retreat', 'title startDate endDate location')
        .populate('testimonial', 'rating comment isApproved createdAt');

      if (!token) {
        const error = new Error('Token no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: token
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al obtener token: ${error.message}`);
    }
  }

  /**
   * Eliminar token
   * @param {string} id - ID del token
   * @returns {Object} Confirmación
   */
  async deleteToken(id) {
    try {
      const token = await TestimonialToken.findByIdAndDelete(id);

      if (!token) {
        const error = new Error('Token no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        message: 'Token eliminado exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al eliminar token: ${error.message}`);
    }
  }

  /**
   * Regenerar token expirado
   * @param {string} id - ID del token a regenerar
   * @returns {Object} Nuevo token
   */
  async regenerateToken(id) {
    try {
      const oldToken = await TestimonialToken.findById(id);

      if (!oldToken) {
        const error = new Error('Token no encontrado');
        error.statusCode = 404;
        throw error;
      }

      if (oldToken.isUsed) {
        const error = new Error('No se puede regenerar un token ya utilizado');
        error.statusCode = 400;
        throw error;
      }

      // Eliminar token viejo
      await TestimonialToken.findByIdAndDelete(id);

      // Crear nuevo token
      const newToken = await TestimonialToken.create({
        email: oldToken.email,
        participantName: oldToken.participantName,
        retreat: oldToken.retreat
      });

      await newToken.populate('retreat', 'title startDate endDate');

      return {
        success: true,
        message: 'Token regenerado exitosamente',
        data: newToken
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al regenerar token: ${error.message}`);
    }
  }

  /**
   * Validar token para uso público
   * @param {string} tokenString - Token a validar
   * @returns {Object} Datos del token si es válido
   */
  async validatePublicToken(tokenString) {
    try {
      const tokenData = await TestimonialToken.validateToken(tokenString);

      if (!tokenData) {
        const error = new Error('Token inválido, expirado o ya utilizado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: {
          participantName: tokenData.participantName,
          email: tokenData.email,
          retreat: {
            id: tokenData.retreat._id,
            title: tokenData.retreat.title,
            startDate: tokenData.retreat.startDate,
            endDate: tokenData.retreat.endDate
          },
          expiresAt: tokenData.expiresAt
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al validar token: ${error.message}`);
    }
  }
}

// Exportar instancia del servicio
export default new TokenService();
