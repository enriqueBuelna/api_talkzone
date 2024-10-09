import * as messageService from '../services/messages.services.js';

export const postMessage = async (req, res) => {
  const { sender_id, receiver_id, content, media_url } = req.body;

  try {
    // Validar que se han proporcionado los campos requeridos
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: 'sender_id y receiver_id son requeridos' });
    }

    // Llamar al servicio para crear el mensaje
    const newMessage = await messageService.createMessage({ sender_id, receiver_id, content, media_url });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    return res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};

export const getMessages = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    const messages = await messageService.getMessagesBetweenUsers(sender_id, receiver_id);
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};