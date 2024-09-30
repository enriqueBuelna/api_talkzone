import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";

export const VerificationEmail = sequelize.define(
  "VerificationEmail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    codigo_verificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    usado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expira_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Verifications_email",
    timestamps: false, // ya tenemos las marcas de tiempo personalizadas
    hooks: {
      beforeCreate: (verificacion) => {
        // Lógica para validar que solo se llene post_id o comment_id
        const unaHoraDespues = new Date();
        unaHoraDespues.setHours(unaHoraDespues.getHours() + 1);
        verificacion.expira_en = unaHoraDespues;
      },
    },
  }
);
