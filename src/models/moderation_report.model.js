import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
import { Message } from "./message.models.js";
import { Comment } from "./comment.model.js";
import { VoiceRoom } from "./voice_rooms.models.js";
import { Post } from "./post.models.js";
export const ModerationReport = sequelize.define(
  "ModerationReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    reported_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Post,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Comment,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: VoiceRoom,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Message,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "resolved", "dismissed"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "Moderation_reports", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// Definir las relaciones
ModerationReport.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "reporter_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  as: "reporter",
});

ModerationReport.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "reported_user_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  as: "reported",
});

ModerationReport.belongsTo(Post, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "post_id",
    allowNull: true,
  },
  as:'reportedPost'
});

ModerationReport.belongsTo(Message, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "message_id",
    allowNull: true,
  },
  as:'reportedMessage'
});

ModerationReport.belongsTo(Comment, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "comment_id",
    allowNull: true,
  },
  as: 'reportedComment'
});

ModerationReport.belongsTo(VoiceRoom, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "room_id",
    allowNull: true,
  },
  as: 'reportedRoom'
});

// Otras relaciones pueden ser definidas según sea necesario
