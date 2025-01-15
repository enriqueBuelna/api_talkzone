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
    type: {
      type: DataTypes.ENUM("host", "member"),
      defaultValue: "member",
      allowNull: false,
    },
    in_stage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "Voice_room_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["room_id", "user_id"],
        name:"voice_room_member_unique"
      },
    ],
  }
);

// Definición de relaciones
VoiceRoomMember.belongsTo(VoiceRoom, {
  as: "voice_room_member_to_voice_room",
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

VoiceRoomMember.belongsTo(User, {
  as: "user_information_voice_room",
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});

VoiceRoom.hasMany(VoiceRoomMember, {
  as: "users_of_voice_room",
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

User.hasMany(VoiceRoomMember, {
  as: "user_to_voice_room_member",
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});
