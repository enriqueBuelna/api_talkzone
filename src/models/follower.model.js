import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";

import { User } from "./user.model.js";


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
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    followed_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
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
  foreignKey: {
    name:"follower_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  }
});

Follower.belongsTo(User, {
  as:"followedId",
  foreignKey: {
    name:"followed_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints:true
});
