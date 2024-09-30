import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Post } from "./post.models.js";
import { Comment } from "./comment.model.js";
import { User } from "./usuario.model.js";
export const Like = sequelize.define(
  "Like",
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
    tableName: "likes",
    timestamps: false, // Configura como true si deseas manejar timestamps automáticamente
    hooks: {
      beforeValidate: (like) => {
        // Lógica para validar que solo se llene post_id o comment_id
        if (
          !(
            (like.post_id && !like.comment_id) ||
            (!like.post_id && like.comment_id)
          )
        ) {
          throw new Error(
            "A Like must be associated with either a post or a comment, but not both."
          );
        }
      },
    },
  }
);

Like.belongsTo(Post, {
  foreignKeyConstraints: true,
  foreignKey: "post_id",
  targetKey: "id",
});

Like.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: "user_id",
  targetKey: "id",
});

Like.belongsTo(Comment, {
  foreignKeyConstraints: true,
  foreignKey: "comment_id",
  targetKey: "id",
});