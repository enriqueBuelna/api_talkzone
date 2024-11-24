import { User } from "./user.model.js";
import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { VoiceRoom } from "./voice_rooms.models.js";
export const BlockedRoomUser = sequelize.define(
  "BlockedRoomUser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VoiceRoom,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "BlockedRoomUser",
    timestamps: false,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["user_id", "room_id"], // Índice compuesto para mejorar búsquedas
      },
    ],
  }
);

BlockedRoomUser.belongsTo(VoiceRoom, {
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

BlockedRoomUser.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});
