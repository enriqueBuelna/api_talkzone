import { Notification } from "../models/notification.model.js";
import { User } from "../models/usuario.model.js";
// Crear una nueva notificación
export const createNotification = async (req, res) => {
  const { user_id, sender_id, type, related_post_id, related_comment_id, related_message_id } = req.body;

  try {
    const notification = await Notification.create({
      user_id,
      sender_id,
      type,
      related_post_id,
      related_comment_id,
      related_message_id,
    });

    return res.status(201).json(notification);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la notificación", error });
  }
};

// Obtener notificaciones de un usuario
export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] }, // Incluir información del remitente
        // Incluir otras relaciones si es necesario
      ],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener notificaciones", error });
  }
};

// Marcar notificaciones como leídas
export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    notification.is_read = true;
    await notification.save();

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: "Error al marcar la notificación como leída", error });
  }
};
