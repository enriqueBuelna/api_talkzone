import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { UserPreference } from "./user_preferences.model.js";
import { Tag } from "./tag.models.js";

export const UserPreferenceTag = sequelize.define(
  "UserPreferenceTag",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "User_preference_tags", // Nombre de la tabla en la base de datos
    timestamps: false, // No usar timestamps automáticos de Sequelize
    indexes: [
      {
        unique: true,
        fields: ["user_preference_id", "tag_id"],
      },
    ],
  }
);
// Definir las relaciones
UserPreferenceTag.belongsTo(UserPreference, {
  foreignKey: "user_preference_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});
UserPreferenceTag.belongsTo(Tag, {
  foreignKey: "tag_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});