import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";

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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Topic,
        key: "id",
      },
      onDelete: "CASCADE",
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
  foreignKey: {
    name:"user_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});

// Relación con la tabla Topics
UserPreference.belongsTo(Topic, {
  foreignKey: {
    name:"topic_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});
