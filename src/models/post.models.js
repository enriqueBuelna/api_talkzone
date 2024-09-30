import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./usuario.model.js";
import { Topic } from "./topic.models.js";

export const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // user_id: {
    //   type: DataTypes.STRING(32),
    //   allowNull: false,
    //   references: {
    //     model: "Users", // Nombre de la tabla de usuarios
    //     key: "id",
    //   },
    // },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM("public", "friends", "private"),
      defaultValue: "public",
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comments_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // shared_post_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // topic_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "Topics", // Nombre de la tabla Topics
    //     key: "id",
    //   },
    //   onDelete: "CASCADE",
    // },
  },
  {
    tableName: "Posts", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// // Definir las relaciones
Post.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: "user_id",
});

Post.belongsTo(Topic, {
  as: 'Current',
  foreignKeyConstraints: true,
  foreignKey: "topic_id"
});

// // Si tienes una relación de posts compartidos
Post.belongsTo(Post, {
  as: "SharedPost",
  foreignKey: "shared_post_id",
  foreignKeyConstraints: true
});
