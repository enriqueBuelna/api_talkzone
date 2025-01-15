import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
import { Message } from "./message.models.js";

export const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user2: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    last_message: {
      type: DataTypes.INTEGER,
      references: {
        model: Message,
        allowNull: true,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Chats",
    timestamps: false,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["user2", "user1"], // Índice compuesto para mejorar búsquedas,
        name:"chat_unique"
      },
    ],
  }
);

// Definir relaciones
Chat.belongsTo(User, {
  as: "user_chat", // Usuario que sigue a otro usuario
  foreignKeyConstraints: true,
  foreignKey: {
    name: "user1",
    allowNull: false,
    onDelete: "CASCADE",
  },
});

Chat.belongsTo(User, {
  as: "user_chat_1", // Usuario que es seguido por otro usuario
  foreignKey: {
    name: "user2",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});

Chat.belongsTo(Message, {
  as: "last_message_id",
  foreignKey: {
    name: "last_message",
    allowNull: true,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});

// Message.belongsTo(Chat, {
//   as: "messages_chat",
//   foreignKey: {
//     name: "conversation_id",
//     allowNull: false,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   },
//   foreignKeyConstraints: true,
// });
