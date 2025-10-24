import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

/**
 * Servicio para envío de emails
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicializar transporter de nodemailer
   */
  initializeTransporter() {
    // Configuración para Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Tu email de Gmail
        pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación de Gmail
      }
    });
  }

  /**
   * Enviar email de token de testimonio
   * @param {Object} data - Datos del email
   * @returns {Promise}
   */
  async sendTestimonialToken(data) {
    const { email, participantName, retreatTitle, token, expiresAt } = data;

    const testimonialUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/testimonio?token=${token}`;
    
    const expirationDate = new Date(expiresAt).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: {
        name: 'Soul Experiences',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `✨ Comparte tu experiencia - ${retreatTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #43304a;
              margin: 0;
              padding: 0;
              background-color: #f7f5ed;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #81536F 0%, #43304a 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #43304a;
            }
            .message {
              font-size: 16px;
              margin-bottom: 30px;
              color: #666;
            }
            .cta-button {
              display: inline-block;
              background-color: #ebbe6f;
              color: #43304a;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 50px;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              margin: 20px 0;
            }
            .cta-button:hover {
              background-color: #d9a85f;
            }
            .info-box {
              background-color: #f7f5ed;
              border-left: 4px solid #ebbe6f;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .footer {
              background-color: #f7f5ed;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            .token-info {
              background-color: #f9f9f9;
              padding: 10px;
              border-radius: 5px;
              margin: 15px 0;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>✨ Soul Experiences</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">
                ¡Hola ${participantName}! 🌟
              </div>

              <div class="message">
                Gracias por haber sido parte de <strong>${retreatTitle}</strong>. 
                Tu experiencia es muy valiosa para nosotros y para quienes están considerando 
                vivir esta transformación.
              </div>

              <div class="message">
                Nos encantaría que compartas tu experiencia. Solo te tomará unos minutos 
                y ayudarás a otros a conocer el impacto de nuestros retiros.
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${testimonialUrl}" class="cta-button">
                  💬 Dejar mi Testimonio
                </a>
              </div>

              <!-- Info Box -->
              <div class="info-box">
                <strong>📝 ¿Qué incluye?</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Calificación de tu experiencia (1-5 estrellas)</li>
                  <li>Comentario sobre lo que viviste</li>
                  <li>Opcional: Fotos del retiro</li>
                </ul>
              </div>

              <div class="token-info">
                <strong>⏰ Este link es válido hasta el ${expirationDate}</strong><br>
                <small>Si tienes problemas con el link, contáctanos directamente.</small>
              </div>

              <div class="message" style="margin-top: 30px; font-size: 14px; color: #999;">
                Si no deseas dejar un testimonio, simplemente ignora este email.
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 5px 0;">
                <strong>Soul Experiences</strong><br>
                Valle de Traslasierra, Córdoba, Argentina
              </p>
              <p style="margin: 5px 0;">
                <a href="mailto:holasoul.experiences@gmail.com" style="color: #81536F; text-decoration: none;">
                  holasoul.experiences@gmail.com
                </a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 11px;">
                Este email fue enviado porque participaste en uno de nuestros retiros.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hola ${participantName}!

Gracias por haber sido parte de ${retreatTitle}.

Nos encantaría que compartas tu experiencia. Haz click en el siguiente link:
${testimonialUrl}

Este link es válido hasta el ${expirationDate}.

Si tienes problemas, contáctanos a holasoul.experiences@gmail.com

Saludos,
Soul Experiences
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info('✅ Email enviado:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      logger.error('❌ Error enviando email:', error);
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }

  /**
   * Enviar múltiples emails de tokens
   * @param {Array} tokens - Array de tokens con datos
   * @returns {Promise}
   */
  async sendMultipleTestimonialTokens(tokens) {
    const results = {
      sent: [],
      failed: []
    };

    for (const token of tokens) {
      try {
        await this.sendTestimonialToken(token);
        results.sent.push(token.email);
      } catch (error) {
        results.failed.push({
          email: token.email,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Verificar configuración del transporter
   * @returns {Promise<boolean>}
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('✅ Servidor de email listo');
      return true;
    } catch (error) {
      logger.error('❌ Error en configuración de email:', error);
      return false;
    }
  }
}

// Exportar instancia del servicio
export default new EmailService();
