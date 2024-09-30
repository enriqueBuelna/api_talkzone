import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Post } from "./post.models.js";
import { User } from "./usuario.model.js";

export const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // parent_comment_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
  },
  {
    tableName: "Comments", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// // Definir las relaciones
Comment.belongsTo(Post, {
  foreignKeyConstraints: true,
  foreignKey: "post_id",
  targetKey: "id",
});

Comment.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: "user_id",
  targetKey: "id",
});

Comment.belongsTo(Comment, {
  foreignKeyConstraints: true,
  foreignKey: "parent_comment_id",
  targetKey: "id", // Alias para la relación padre
});
