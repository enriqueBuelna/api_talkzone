import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
import { Post } from "./post.models.js"; // Asegúrate de que esta ruta sea correcta
import { Comment } from "./comment.model.js"; // Asegúrate de que esta ruta sea correcta
import { Message } from "./message.models.js"; // Asegúrate de que esta ruta sea correcta
import { Like } from "./like.model.js";
import { VoiceRoom } from "./voice_rooms.models.js";

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
        'follower',
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
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    related_post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Post,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    related_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Comment,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    related_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Message,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    related_like_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Like,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    related_room_open_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: VoiceRoom,
        key: "id",
      },
      onDelete: "CASCADE",
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
  foreignKey: {
    name:"receiver_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

Notification.belongsTo(User, {
  as:"userSender",
  foreignKey: {
    name:"sender_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

Notification.belongsTo(Post, {
  foreignKey: {
    name:"related_post_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

Notification.belongsTo(Comment, {
  foreignKey: {
    name:"related_comment_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

Notification.belongsTo(Message, {
  foreignKey: {
    name:"related_message_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

Notification.belongsTo(Like, {
  foreignKey: {
    name:"related_like_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

Notification.belongsTo(VoiceRoom, {
  foreignKey: {
    name:"related_room_open_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});