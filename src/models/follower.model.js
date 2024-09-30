import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";

import { User } from "./usuario.model.js";

export const Follower = sequelize.define(
  "Follower",
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
    tableName: "Followers", // Nombre de la tabla en la base de datos
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["follower_id", "followed_id"], // Asegura que un usuario no siga a otro más de una vez
      },
    ],
  }
);

// Definir relaciones
Follower.belongsTo(User, {
  as:"followerId",
  foreignKeyConstraints: true,
  foreignKey: "follower_id",
  targetKey: "id",
});

Follower.belongsTo(User, {
  as:"followedId",
  foreignKey: "followed_id",
  targetKey: "id",
  foreignKeyConstraints:true
});
