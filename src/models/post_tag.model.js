import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Post } from "./post.models.js";
import { Tag } from "./tag.models.js";

export const PostTag = sequelize.define(
  "PostTag",
  {},
  {
    tableName: "PostTags", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// Definir las relaciones
PostTag.belongsTo(Post, {
  foreignKey: "post_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});

PostTag.belongsTo(Tag, {
  foreignKey: "tag_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});
