import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";

export const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Messages",
    timestamps: false,
  }
);

Message.belongsTo(User, {
  as: "senderUserMessage",
  foreignKey: {
    name: "sender_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});
Message.belongsTo(User, {
  as: "receiverUserMessage",
  foreignKey: {
    name: "receiver_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});
