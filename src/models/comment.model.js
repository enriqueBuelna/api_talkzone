import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Post } from "./post.models.js";
import { User } from "./user.model.js";

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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model:Post,
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
    // parent_comment_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Comment, 
    //     key:"id"
    //   },
    //   onDelete: "CASCADE",
    // },
  },
  {
    tableName: "Comments", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// // Definir las relaciones
Comment.belongsTo(Post, {
  as:"postss",
  foreignKeyConstraints: true,
  foreignKey: {
    name: "post_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
});

Comment.belongsTo(User, {
  as:"userss",
  foreignKeyConstraints: true,
  foreignKey: {
    name: "user_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
});

Comment.belongsTo(Comment, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "parent_comment_id",
    target: "id",
    allowNull: true,
    onDelete: "CASCADE",
  },
});

//has many

User.hasMany(Comment, {
  foreignKey: {
    name:"user_id",
    onDelete: "CASCADE"
  }
});

Post.hasMany(Comment, {
  foreignKey: {
    name:"post_id",
    onDelete:"CASCADE"
  }
})