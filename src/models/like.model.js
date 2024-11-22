import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Post } from "./post.models.js";
import { Comment } from "./comment.model.js";
import { User } from "./user.model.js";

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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Post,
        key: "id",
      },
      onDelete: "CASCADE",
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Comment ,
        key: "id",
      },
      onDelete: "CASCADE",
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
  foreignKey: {
    name:"post_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  }
});

Like.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"user_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  }
});

Like.belongsTo(Comment, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"comment_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  }
});