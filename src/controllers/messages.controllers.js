import * as messageService from "../services/messages.services.js";
import { Message } from "../models/message.models.js";
import { ModerationReport } from "../models/moderation_report.model.js";
export const getUnreadMessages = async (req, res) => {
  const {user_id} = req.query;
  try {
    const unreadMessagesCount = await Message.count({
      where: {
        receiver_id: user_id,
        is_read: false,
      },
    });

    res.status(201).json(unreadMessagesCount);
  } catch (error) {
    
  }
}

export const reportMessage = async (req, res) => {
  const {reason, details, reported_user_id, reporter_id, message_id} = req.body;   
  try {
    const newReport = await ModerationReport.create({
      reason,
      details,
      reported_user_id,
      reporter_id,
      message_id
    });
    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
}

export const postMessage = async (req, res) => {
  const { sender_id, receiver_id, content, media_url } = req.body;

  try {
    // Validar que se han proporcionado los campos requeridos
    if (!sender_id || !receiver_id) {
      return res
        .status(400)
        .json({ error: "sender_id y receiver_id son requeridos" });
    }

    // Llamar al servicio para crear el mensaje
    const newMessage = await messageService.createMessage({
      sender_id,
      receiver_id,
      content,
      media_url,
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    return res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

export const getMessages = async (req, res) => {
  const { myUser_id, user_id } = req.query;

  try {
    const messages = await messageService.getMessagesBetweenUsers(
      myUser_id,
      user_id
    );
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

export const getMyConversations = async (req, res) => {
  const { user_id } = req.query;
  try {
    const conversations = await messageService.getMyConversation(user_id);
    conversations.sort((a, b) => new Date(b.last_message_id.sent_at) - new Date(a.last_message_id.sent_at));

    res.status(201).json(conversations);
  } catch (error) {}
};
