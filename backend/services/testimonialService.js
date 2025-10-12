import Testimonial from '../models/Testimonial.js';
import TestimonialToken from '../models/TestimonialToken.js';

/**
 * Servicio para manejar la lógica de negocio de los testimonios
 * Contiene toda la lógica de manipulación de datos y reglas de negocio
 */
class TestimonialService {

  /**
   * Obtener todos los testimonios con filtros y paginación
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación y ordenamiento
   * @param {Object} user - Usuario autenticado (opcional)
   * @returns {Object} Resultado con testimonios y metadatos de paginación
   */
  async getAllTestimonials(filters = {}, options = {}, user = null) {
    try {
      const { 
        isApproved, 
        isFeatured, 
        retreat, 
        rating,
        limit = 10, 
        page = 1, 
        sort = '-createdAt' 
      } = { ...filters, ...options };
      
      console.log('📊 getAllTestimonials - Parámetros recibidos:', { isApproved, isFeatured, user: user ? 'Autenticado' : 'No autenticado' });
      
      // Construir filtros
      const filter = {};
      
      // Para usuarios no autenticados, solo mostrar aprobados
      if (!user) {
        filter.isApproved = true;
        console.log('👤 Usuario NO autenticado - Forzando isApproved=true');
      } else {
        console.log('🔐 Usuario autenticado - Permitiendo filtros personalizados');
        // Para admin, permitir filtrar por aprobación
        if (isApproved !== undefined && isApproved !== '') {
          // Convertir string a booleano correctamente
          if (isApproved === 'false' || isApproved === false) {
            filter.isApproved = false;
            console.log('✅ Filtro aplicado: isApproved = false (pendientes)');
          } else if (isApproved === 'true' || isApproved === true) {
            filter.isApproved = true;
            console.log('✅ Filtro aplicado: isApproved = true (aprobados)');
          }
        } else {
          console.log('ℹ️ Sin filtro de aprobación - mostrando todos');
        }
      }
      
      console.log('🔍 Filtro final aplicado:', filter);
      
      if (isFeatured !== undefined && isFeatured !== '') {
        filter.isFeatured = isFeatured === 'true';
      }
      if (retreat && retreat !== '') filter.retreat = retreat;
      if (rating && rating !== '') filter.rating = { $gte: parseInt(rating) };

      // Ejecutar consulta con paginación y populate
      const testimonials = await Testimonial.find(filter)
        .populate('retreat', 'title startDate endDate')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Testimonial.countDocuments(filter);

      return {
        success: true,
        data: testimonials,
        count: testimonials.length,
        total,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener testimonios: ${error.message}`);
    }
  }

  /**
   * Obtener un testimonio por ID
   * @param {string} id - ID del testimonio
   * @returns {Object} Testimonio encontrado
   */
  async getTestimonialById(id) {
    try {
      const testimonial = await Testimonial.findById(id)
        .populate('retreat', 'title startDate endDate location');

      if (!testimonial) {
        const error = new Error('Testimonio no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: testimonial
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al obtener testimonio: ${error.message}`);
    }
  }

  /**
   * Crear testimonio con token de validación
   * @param {string} token - Token de validación
   * @param {Object} testimonialData - Datos del testimonio
   * @returns {Object} Testimonio creado
   */
  async submitTestimonialWithToken(token, testimonialData) {
    try {
      const { rating, comment, participantPhoto } = testimonialData;

      // Validar token
      const testimonialToken = await TestimonialToken.validateToken(token);
      
      if (!testimonialToken) {
        const error = new Error('Token inválido o expirado');
        error.statusCode = 400;
        throw error;
      }

      // Verificar que no se haya usado ya
      if (testimonialToken.isUsed) {
        const error = new Error('Este token ya fue utilizado');
        error.statusCode = 400;
        throw error;
      }

      // Crear testimonio
      const testimonial = await Testimonial.create({
        participantName: testimonialToken.participantName,
        participantEmail: testimonialToken.email,
        participantPhoto,
        retreat: testimonialToken.retreat._id,
        rating,
        comment,
        token: token
      });

      // Marcar token como usado y asociar testimonio
      testimonialToken.isUsed = true;
      testimonialToken.testimonial = testimonial._id;
      await testimonialToken.save();

      // Poblar datos del retiro
      await testimonial.populate('retreat', 'title startDate endDate');

      return {
        success: true,
        data: testimonial,
        message: 'Testimonio enviado exitosamente. Será revisado antes de publicarse.'
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
        throw validationError;
      }

      throw new Error(`Error al enviar testimonio: ${error.message}`);
    }
  }

  /**
   * Validar token de testimonio
   * @param {string} token - Token a validar
   * @returns {Object} Información del token válido
   */
  async validateTestimonialToken(token) {
    try {
      const testimonialToken = await TestimonialToken.validateToken(token);
      
      if (!testimonialToken) {
        const error = new Error('Token inválido o expirado');
        error.statusCode = 400;
        throw error;
      }

      return {
        success: true,
        message: 'Token válido',
        data: {
          participantName: testimonialToken.participantName,
          retreat: {
            title: testimonialToken.retreat.title,
            startDate: testimonialToken.retreat.startDate,
            endDate: testimonialToken.retreat.endDate
          }
        }
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al validar token: ${error.message}`);
    }
  }

  /**
   * Crear testimonio público con token
   * @param {Object} testimonialData - Datos del testimonio (incluye token)
   * @returns {Object} Testimonio creado
   */
  async createPublicTestimonial(testimonialData) {
    try {
      const { token, ...data } = testimonialData;

      // Validar token
      const testimonialToken = await TestimonialToken.validateToken(token);
      
      if (!testimonialToken) {
        const error = new Error('Token inválido, expirado o ya utilizado');
        error.statusCode = 400;
        throw error;
      }

      // Crear testimonio
      const testimonial = await Testimonial.create({
        ...data,
        retreat: testimonialToken.retreat._id,
        participantName: testimonialToken.participantName,
        email: testimonialToken.email,
        isApproved: false // Siempre pendiente de aprobación
      });

      // Marcar token como usado
      testimonialToken.isUsed = true;
      testimonialToken.testimonial = testimonial._id;
      await testimonialToken.save();

      await testimonial.populate('retreat', 'title startDate endDate');

      return {
        success: true,
        data: testimonial,
        message: 'Testimonio enviado exitosamente. Será revisado antes de publicarse.'
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
        throw validationError;
      }

      throw new Error(`Error al crear testimonio: ${error.message}`);
    }
  }

  /**
   * Crear testimonio (admin)
   * @param {Object} testimonialData - Datos del testimonio
   * @returns {Object} Testimonio creado
   */
  async createTestimonial(testimonialData) {
    try {
      const testimonial = await Testimonial.create(testimonialData);
      
      await testimonial.populate('retreat', 'title startDate endDate');

      return {
        success: true,
        data: testimonial,
        message: 'Testimonio creado exitosamente'
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.messages = messages;
        throw validationError;
      }

      throw new Error(`Error al crear testimonio: ${error.message}`);
    }
  }

  /**
   * Actualizar testimonio
   * @param {string} id - ID del testimonio
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Testimonio actualizado
   */
  async updateTestimonial(id, updateData) {
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      ).populate('retreat', 'title startDate endDate');

      if (!testimonial) {
        const error = new Error('Testimonio no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: testimonial,
        message: 'Testimonio actualizado exitosamente'
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
        throw validationError;
      }

      throw new Error(`Error al actualizar testimonio: ${error.message}`);
    }
  }

  /**
   * Eliminar testimonio
   * @param {string} id - ID del testimonio
   * @returns {Object} Confirmación de eliminación
   */
  async deleteTestimonial(id) {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(id);

      if (!testimonial) {
        const error = new Error('Testimonio no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        message: 'Testimonio eliminado exitosamente'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error al eliminar testimonio: ${error.message}`);
    }
  }

  /**
   * Obtener testimonios destacados para la landing page
   * @param {number} limit - Límite de resultados
   * @returns {Object} Lista de testimonios destacados
   */
  async getFeaturedTestimonials(limit = 6) {
    try {
      const testimonials = await Testimonial.find({
        isApproved: true,
        isFeatured: true
      })
      .populate('retreat', 'title')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

      return {
        success: true,
        data: testimonials,
        count: testimonials.length
      };
    } catch (error) {
      throw new Error(`Error al obtener testimonios destacados: ${error.message}`);
    }
  }
}

// Exportar una instancia del servicio
export default new TestimonialService();
