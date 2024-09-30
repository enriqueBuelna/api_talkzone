import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./usuario.model.js";

export const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // sender_id: {
    //   type: DataTypes.STRING(32),
    //   allowNull: false,
    // },
    // receiver_id: {
    //   type: DataTypes.STRING(32),
    //   allowNull: false,
    // },
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
  foreignKey: "sender_id",
  foreignKeyConstraints: true,
});
Message.belongsTo(User, {
  as: "receiverUserMessage",
  foreignKey: "receiver_id",
  foreignKeyConstraints: true,
});
