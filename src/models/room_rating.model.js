import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { VoiceRoom } from "./voice_rooms.models.js"; // Asegúrate de ajustar la ruta
import { User } from "./user.model.js"; // Asegúrate de ajustar la ruta

export const RoomRating = sequelize.define(
  "RoomRating",
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
    host_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
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
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "RoomRatings",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["room_id", "user_id"],
        name:"room_rating_unique"
      },
    ],
  }
);

RoomRating.belongsTo(User, {
  as: "member",
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});
RoomRating.belongsTo(User, {
  as: "host",
  foreignKey: {
    name: "host_user_id",
    onDelete: "CASCADE",
  },
});

RoomRating.belongsTo(VoiceRoom, {
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

