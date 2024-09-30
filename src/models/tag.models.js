import { DataTypes, sql } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Topic } from "./topic.models.js";

export const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tag_name: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    // topic_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Topics',  // Nombre de la tabla referenciada
    //     key: 'id'         // Clave primaria de la tabla referenciada
    //   }
    // },
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
    tableName: 'Tags',  // Nombre de la tabla en la base de datos
    timestamps: false,
  });
  
  // Definir la relación con Topics
  Tag.belongsTo((Topic), {
    foreignKey: 'topic_id',
    foreignKeyConstraints:true
  });