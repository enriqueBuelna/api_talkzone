import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
import { Topic } from "./topic.models.js";
import { UserPreference } from "./user_preferences.model.js";

export const Post = sequelize.define(
  "Post",
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
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    user_preference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserPreference,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Posts", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// // Definir las relaciones
Post.belongsTo(User, {
  as: 'post_user',
  foreignKeyConstraints: true,
  foreignKey: {
    name:"user_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
});

Post.belongsTo(UserPreference, {
  as: 'post_user_preference',
  foreignKeyConstraints: true,
  foreignKey: {
    name:"user_preference_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  }
});

// // Si tienes una relación de posts compartidos
Post.belongsTo(Post, {
  as: "SharedPost",
  foreignKey: {
    name:"shared_post_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true
});


//RELACIONES HAS MANY

User.hasMany(Post, {
  foreignKey: {
    name:"user_id",
    onDelete: "CASCADE"
  }
});
