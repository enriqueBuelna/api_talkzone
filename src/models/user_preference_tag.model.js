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
    user_preference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserPreference,
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
  foreignKey: { name: 'user_preference_id', allowNull: false, onDelete: 'CASCADE' },
  foreignKeyConstraints: true,
  hooks: false,
  as: 'userPreferences',
  name: { plural: 'userPreferences', singular: 'userPreference' }
})
UserPreferenceTag.belongsTo(Tag, {
  foreignKey: {
    name: "tag_id",
    allowNull: false,
    onDelete: 'CASCADE', // Elimina UserPreferenceTag si se elimina Tag
  },
  foreignKeyConstraints: true,
});

// Relación con la tabla UserPreferenceTag
UserPreference.hasMany(UserPreferenceTag, {
  foreignKey: "user_preference_id"
});