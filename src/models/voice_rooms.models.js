import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./usuario.model.js";
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
    // host_user_id: {
    //   type: DataTypes.STRING(32),
    //   allowNull: false,
    // },
    // topic_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
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
  },
  {
    tableName: "Voice_rooms",
    timestamps: false,
  }
);

// Definición de relaciones
VoiceRoom.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: "host_user_id",
  targetKey: "id",
});
VoiceRoom.belongsTo(Topic, {
  foreignKeyConstraints: true,
  foreignKey: "topic_id",
  targetKey: "id",
});
