import { Message } from "../models/message.models.js";

export const postMessage = async (req, res) => {
    const { sender_id, receiver_id, content, media_url } = req.body;
  
    try {
      // Validar que se han proporcionado los campos requeridos
      if (!sender_id || !receiver_id) {
        return res.status(400).json({ error: 'sender_id y receiver_id son requeridos' });
      }
  
      // Crear el mensaje
      const newMessage = await Message.create({
        sender_id,
        receiver_id,
        content: content, // Permitir que el contenido sea opcional
        media_url: media_url || null, // Permitir que la URL del medio sea opcional
      });
  
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      return res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
  };
  