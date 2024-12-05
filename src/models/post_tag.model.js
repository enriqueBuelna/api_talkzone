import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Post } from "./post.models.js";
import { Tag } from "./tag.models.js";

export const PostTag = sequelize.define(
  "PostTag",
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "PostTags", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// Definir las relaciones
PostTag.belongsTo(Post, {
  as:"ass-ketchup",
  foreignKey: {
    name: "post_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});

PostTag.belongsTo(Tag, {
  as:"post_tag_tag",
  foreignKey: {
    name: "tag_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});

Post.hasMany(PostTag, {
  as:"post_tagss",
  foreignKey: {
    name: "post_id",
    allowNull: false,
  },
  foreignKeyConstraints: true,
});

Tag.hasMany(PostTag, {
  as:"post_tag_tag",
  foreignKey: {
    name:"tag_id",
    allowNull:false
  },
  foreignKeyConstraints:true
})