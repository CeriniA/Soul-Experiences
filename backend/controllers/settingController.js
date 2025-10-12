import Setting from '../models/Setting.js';

// @desc    Obtener configuración activa
// @route   GET /api/settings
// @access  Public (para landing) / Private (para admin con más detalles)
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.getActive();

    if (!settings) {
      // Si no hay configuración, crear una por defecto
      const defaultSettings = await Setting.createDefault();
      return res.json({
        success: true,
        data: defaultSettings
      });
    }

    // Si es usuario no autenticado, ocultar información sensible
    if (!req.user) {
      const publicSettings = {
        facilitatorName: settings.facilitatorName,
        facilitatorBio: settings.facilitatorBio,
        facilitatorPhoto: settings.facilitatorPhoto,
        contactEmail: settings.contactEmail,
        whatsappNumber: settings.whatsappNumber,
        socialMedia: settings.socialMedia,
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        siteLogo: settings.siteLogo,
        customTexts: settings.customTexts,
        theme: settings.theme
      };

      return res.json({
        success: true,
        data: publicSettings
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuración',
      message: error.message
    });
  }
};

// @desc    Actualizar configuración
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.getActive();

    if (!settings) {
      // Si no existe configuración, crear una nueva
      settings = await Setting.create({
        ...req.body,
        isActive: true
      });
    } else {
      // Actualizar configuración existente
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: settings
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al actualizar configuración',
      message: error.message
    });
  }
};

// @desc    Obtener configuración para landing page
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.getActive();

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Configuración no encontrada'
      });
    }

    // Solo datos públicos necesarios para la landing
    const publicData = {
      facilitatorName: settings.facilitatorName,
      facilitatorBio: settings.facilitatorBio,
      facilitatorPhoto: settings.facilitatorPhoto,
      contactEmail: settings.contactEmail,
      whatsappNumber: settings.whatsappNumber,
      socialMedia: settings.socialMedia,
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      siteLogo: settings.siteLogo,
      customTexts: settings.customTexts,
      theme: settings.theme
    };

    res.json({
      success: true,
      data: publicData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuración pública',
      message: error.message
    });
  }
};

// @desc    Resetear configuración a valores por defecto
// @route   POST /api/settings/reset
// @access  Private (Admin)
export const resetSettings = async (req, res) => {
  try {
    // Eliminar configuración actual
    await Setting.deleteMany({});

    // Crear configuración por defecto
    const defaultSettings = await Setting.createDefault({
      name: req.body.facilitatorName || 'Facilitador',
      email: req.body.contactEmail || 'contacto@retiros.com',
      whatsapp: req.body.whatsappNumber || '+54911234567'
    });

    res.json({
      success: true,
      message: 'Configuración reseteada a valores por defecto',
      data: defaultSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al resetear configuración',
      message: error.message
    });
  }
};
