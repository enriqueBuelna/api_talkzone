import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Topic } from "./topic.models.js";

export const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Topic,
        key: "id",
      },
      onDelete: "CASCADE",
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
  },
  {
    tableName: "Tags", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// Definir la relación con Topics
Tag.belongsTo(Topic, {
  foreignKey: {
    name:"topic_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
});
