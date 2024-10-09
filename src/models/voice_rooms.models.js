import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
import { Topic } from "./topic.models.js";

export const VoiceRoom = sequelize.define(
  "VoiceRoom",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    host_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    room_status: {
      type: DataTypes.ENUM("active", "closed"),
      defaultValue: "active",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Topic,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Voice_rooms",
    timestamps: false,
  }
);

// Definición de relaciones
VoiceRoom.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"host_user_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
});
VoiceRoom.belongsTo(Topic, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"topic_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
});
