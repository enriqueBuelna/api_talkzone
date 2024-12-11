import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";

export const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sql.uuidV4, // Genera un UUID v4 por defecto
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cover_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    about_me: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_profile_complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other", "prefer_not_to_say"),
      allowNull: false,
    },
    user_role: {
      type: DataTypes.ENUM("user", "admin", "moderator"),
      defaultValue: "user",
    },
    is_active: {
      type: DataTypes.ENUM("active", "no-active"),
      defaultValue: "active",
    },
    follower_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_online: {
      type: DataTypes.ENUM("online", "offline"),
      defaultValue: "offline",
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "Users",
    timestamps: false, // Ya que manejas las fechas manualmente
  }
);
