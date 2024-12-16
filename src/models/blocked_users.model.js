import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
export const BlockedUsers = sequelize.define(
  "Blocked_users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    blocker_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    blocked_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Blocked_users", // Nombre de la tabla en la base de datos
    timestamps: false, // Evita que Sequelize añada `createdAt` y `updatedAt`
    indexes: [
      {
        unique: true,
        fields: ["blocker_user_id", "blocked_user_id"], // Índice único para evitar duplicados
      },
    ],
  }
);

// Asociación en el modelo Users
BlockedUsers.belongsTo(User,{
    as: "blocker", // Usuario que sigue a otro usuario
    foreignKeyConstraints: true,
    foreignKey: {
      name: "blocker_user_id",
      allowNull: false,
      onDelete: "CASCADE",
    },
  });

BlockedUsers.belongsTo(User, {
    as: "blocked", // Usuario que sigue a otro usuario
    foreignKeyConstraints: true,
    foreignKey: {
      name: "blocked_user_id",
      allowNull: false,
      onDelete: "CASCADE",
    },
});

// User.hasMany(BlockedUsers, {
//     name: 'id',
//     foreignKey: "blocked_user_id",
//     as:'blockedUser'
// })

// User.hasMany(BlockedUsers, {
//     name: 'id',
//     as: 'blockerUser'
// })