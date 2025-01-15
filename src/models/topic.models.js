import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";

export const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  topic_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'Topics',
  timestamps: false,
});

// Topic.hasMany(Topic);
Topic.belongsTo(Topic, {
  as: 'Current',
  foreignKey: {
    name:"topic_id",
    target:"id",
    allowNull:true,
    onDelete:"CASCADE"
  },
  foreignKeyConstraints: true,
  unique: true
});