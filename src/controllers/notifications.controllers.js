import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.models.js";
import { Like } from "../models/like.model.js";
// Crear una nueva notificación
export const createNotification = async (req, res) => {
  const {
    user_id,
    sender_id,
    type,
    related_post_id,
    related_comment_id,
    related_message_id,
    related_like_id,
    related_room_open_id,
  } = req.body;

  try {
    const notification = await Notification.create({
      user_id,
      sender_id,
      type,
      related_post_id,
      related_comment_id,
      related_message_id,
      related_like_id,
      related_room_open_id,
    });

    return res.status(201).json(notification);
  } catch (error) {
    console.log(error);
  }
};

// Obtener notificaciones de un usuario
export const getNotifications = async (req, res) => {
  const { user_id } = req.query;

  try {
    const notifications = await Notification.findAll({
      where: { receiver_id: user_id },
      include: [
        {
          model: User,
          as: "userSender",
          attributes: ["id", "username", "profile_picture", "gender"],
        }, // Incluir información del remitente
        // Incluir otras relaciones si es necesario
        {
          model: Like,

          include: [
            {
              as: "post",
              model: Post,
              attributes: ["id"], // Información de la publicación
            },
            {
              model: Comment,
              include: [
                {
                  association: "postss",
                  model: Post,
                  attributes: ["id"], // Información de la publicación original
                },
              ],
              attributes: ["id"], // Información del comentario
            },
          ],
        },
      ],
      attributes: [
        "id",
        "type",
        "related_post_id",
        "related_comment_id",
        "related_like_id",
        "related_room_open_id",
        "related_message_id",
        "follower_id",
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
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
    return res
      .status(500)
      .json({ message: "Error al marcar la notificación como leída", error });
  }
};
