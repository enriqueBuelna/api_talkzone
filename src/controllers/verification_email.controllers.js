import { VerificationEmail } from "../models/verification_email.model.js";
import { sendCodeEmail } from "../utils/configMail.js";
import { Op } from "sequelize";

// Crear una nueva verificación de email electrónico
export const createEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

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
      codigo_verificacion: await sendCodeEmail(email),
      expira_en: new Date(Date.now() + 60 * 60 * 1000), // Establecer la expiración en 1 hora
    });

    // Aquí puedes enviar el código al email del usuario utilizando algún servicio de email
    // Ejemplo: await enviaremail(email, codigoVerificacion);

    return res.status(201).json({
      message: "Código de verificación enviado",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al generar la verificación",
      error: error.message,
    });
  }
};

// Verificar el código de verificación
export const verifyCode = async (req, res) => {
  try {
    const { email, codigo_verificacion } = req.body;

    // Buscar la verificación correspondiente
    const verificacion = await VerificationEmail.findOne({
      where: {
        email,
        codigo_verificacion,
        usado: false,
        expira_en: {
          [Op.gt]: new Date(), // Verifica que el código no haya expirado
        },
      },
    });

    if (!verificacion) {
      return res.status(400).json({
        message: "Código de verificación inválido o expirado",
      });
    }

    // Actualizar el estado de la verificación a "usado"
    verificacion.usado = true;
    await verificacion.save();

    return res.status(200).json({
      message: "Verificación exitosa",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al verificar el código",
      error: error.message,
    });
  }
};
