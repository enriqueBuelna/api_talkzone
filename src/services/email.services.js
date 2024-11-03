import { VerificationEmail } from "../models/verification_email.model.js";
import {sendCodeEmail} from '../utils/configMail.js';
export const sendCodeEmailService = async (email, titulo) => {
    const existingVerification = await VerificationEmail.findOne({
        where: { email },
      });
    
      // Si existe, lo eliminamos
      if (existingVerification) {
        await VerificationEmail.destroy({
          where: { email },
        });
      }
    
      // Generar un código de verificación de 6 dígitos
  
      // Crear una nueva verificación en la base de datos
      const nuevaVerificacion = await VerificationEmail.create({
        email,
        codigo_verificacion: await sendCodeEmail(email, titulo),
        expira_en: new Date(Date.now() + 60 * 60 * 1000), // Establecer la expiración en 1 hora
      });
}