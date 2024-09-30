import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./usuario.model.js";
import { Topic } from "./topic.models.js";

export const UserPreference = sequelize.define(
  "UserPreference",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("know", "learn"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "User_preferences",
    timestamps: false, // Ya tienes `created_at` manejado manualmente
    indexes: [
      {
        unique: true,
        fields: ["topic_id", "user_id"],
      },
    ],
  }
);

// Relación con la tabla Users
UserPreference.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});

// Relación con la tabla Topics
UserPreference.belongsTo(Topic, {
  foreignKey: "topic_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});
