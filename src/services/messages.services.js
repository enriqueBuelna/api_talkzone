import { Message } from "../models/message.models.js";
import { Op } from "sequelize";

export const createMessage = async (
  sender_id,
  receiver_id,
  content,
  media_url
) => {
  // Crear el mensaje
  const newMessage = await Message.create({
    sender_id,
    receiver_id,
    content: content || null, // Permitir que el contenido sea opcional
    media_url: media_url || null, // Permitir que la URL del medio sea opcional
  });

  return newMessage;
};

export const getMessagesBetweenUsers = async (sender_id, receiver_id) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: sender_id, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      attributes: ["content", "sent_at", "sender_id"], // Seleccionar solo content y sent_at
      order: [["sent_at", "ASC"]], // Ordenar por fecha de envío
      raw: true,
    });

    return messages;
  } catch (error) {
    console.error("Error al obtener los mensajes entre usuarios:", error);
    throw new Error("Error al obtener los mensajes");
  }
};
