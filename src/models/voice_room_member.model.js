import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { VoiceRoom } from "./voice_rooms.models.js";
import { User } from "./user.model.js";
export const VoiceRoomMember = sequelize.define(
  "VoiceRoomMember",
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
      allowNull: false,
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Voice_room_members",
    timestamps: false,
  }
);

// Definición de relaciones
VoiceRoomMember.belongsTo(VoiceRoom, {
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

VoiceRoomMember.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});
