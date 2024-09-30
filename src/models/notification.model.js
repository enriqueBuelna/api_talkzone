import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./usuario.model.js"; // Asegúrate de que esta ruta sea correcta
import { Post } from "./post.models.js"; // Asegúrate de que esta ruta sea correcta
import { Comment } from "./comment.model.js"; // Asegúrate de que esta ruta sea correcta
import { Message } from "./message.models.js"; // Asegúrate de que esta ruta sea correcta

export const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(
        'like',
        'comment',
        'mention',
        'friend_request',
        'message',
        'room_open',
        'other',
        'message_system'
      ),
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Notifications", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// Definir las relaciones
Notification.belongsTo(User, {
  as:"userReceiver",
  foreignKey: "user_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});

Notification.belongsTo(User, {
  as:"userSender",
  foreignKey: "sender_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});

Notification.belongsTo(Post, {
  foreignKey: "related_post_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});

Notification.belongsTo(Comment, {
  foreignKey: "related_comment_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});

Notification.belongsTo(Message, {
  foreignKey: "related_message_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});
