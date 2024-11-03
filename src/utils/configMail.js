import { createTransport } from "nodemailer";
import { config } from "dotenv";
config();

// Configuración del transporte SMTP
const transporter = createTransport({
  service: "gmail", // Cambia el servicio si usas otro proveedor
  auth: {
    user: process.env.EMAIL, // Tu correo electrónico
    pass: process.env.PASSWORD_EMAIL, // Tu contraseña o app password de Gmail
  },
});

export const sendCodeEmail = async (correoDestino, titulo) => {
  const codigoVerificacion = generarCodigoVerificacion();

  // Configuración del correo
  const mailOptions = {
    from: process.env.EMAIL,
    to: correoDestino,
    subject: `${titulo}`,
    text: `Tu código de verificación es: ${codigoVerificacion}`,
    html: `<p>Tu código de verificación es: <strong>${codigoVerificacion}</strong></p>`, // Puedes enviar un HTML más bonito
  };

  try {
    // Envío del correo
    await transporter.sendMail(mailOptions);
    console.log("Correo de verificación enviado");
    return codigoVerificacion; // Retorna el código para que lo guardes en tu base de datos o lo verifiques luego
  } catch (error) {
    console.error("Error enviando el correo:", error);
    throw error; // Puedes manejar el error como prefieras
  }
};

const generarCodigoVerificacion = () => {
  return Math.floor(100000 + Math.random() * 900000); // Genera un código de 6 dígitos
};
