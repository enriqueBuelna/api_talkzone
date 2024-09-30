import { DataTypes} from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./usuario.model.js";

export const Community = sequelize.define(
  "Community",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    communitie_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    about_communitie: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    //   creator_id: {
    //     type: DataTypes.STRING(32),
    //     allowNull: false,
    //   },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Communities", // Nombre de la tabla en la base de datos
    timestamps: false, // Si no quieres usar los timestamps automáticos de Sequelize
  }
);

// Relación con la tabla de usuarios (creador de la comunidad)
Community.belongsTo(User, {
  foreignKey: "creator_id",
  targetKey: "id",
  foreignKeyConstraints: true,
});
