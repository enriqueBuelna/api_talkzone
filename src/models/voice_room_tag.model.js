import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { VoiceRoom } from "./voice_rooms.models.js";
import { Tag } from "./tag.models.js";
export const VoiceRoomTag = sequelize.define(
  "VoiceRoomTag",
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
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Voice_room_tags",
    timestamps: false,
  }
);

// Definición de relaciones
VoiceRoomTag.belongsTo(VoiceRoom, {
  as: "voice_room_tag_to_voice_room",
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

VoiceRoomTag.belongsTo(Tag, {
  as: "voice_room_tag_to_tag",
  foreignKey: {
    name: "tag_id",
    onDelete: "CASCADE",
  },
});

//has many
VoiceRoom.hasMany(VoiceRoomTag, {
  as: "voice_room_to_voice_room_tag",
  foreignKey: {
    name: "room_id",
    onDelete: "CASCADE",
  },
});

Tag.hasMany(VoiceRoomTag, {
  as: "tag_to_voice_room_tag",
  foreignKey: {
    name: "tag_id",
    onDelete: "CASCADE",
  },
});
