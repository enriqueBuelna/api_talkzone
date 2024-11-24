import { User } from "./user.model.js";
import { VoiceRoom } from "./voice_rooms.models.js";
import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";

export const RoomLog = sequelize.define(
  "RoomLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VoiceRoom,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "RoomLogs",
    timestamps: false,
  }
);

RoomLog.belongsTo(User, {
    foreignKey: {
      name: "host_user_id",
      onDelete: "CASCADE",
    },
  });
  
  RoomLog.belongsTo(VoiceRoom, {
    foreignKey: {
      name: "room_id",
      onDelete: "CASCADE",
    },
  });
  