import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";

export const ModerationReport = sequelize.define(
  "ModerationReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    reported_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "resolved", "dismissed"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Moderation_reports", // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

// Definir las relaciones
ModerationReport.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "reporter_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  as: "reporter",
});

ModerationReport.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name: "reported_user_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  as: "reportedUser",
});

// Otras relaciones pueden ser definidas según sea necesario
