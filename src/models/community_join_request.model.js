import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { User } from "./user.model.js";
import { Community } from "./communitie.model.js";
export const CommunityJoinRequest = sequelize.define(
  "CommunityJoinRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Community,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true, // Solo se llena si la solicitud fue procesada
    },
    //   reviewed_by: {
    //     type: DataTypes.UUID,
    //     allowNull: true, // ID del admin/moderador que revisa la solicitud
    //     references: {
    //       model: User,
    //       key: "id",
    //     },
    //     onDelete: "SET NULL",
    //   },
  },
  {
    tableName: "CommunityJoinRequests",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["group_id", "user_id"],
      },
    ],
  }
);

CommunityJoinRequest.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});

CommunityJoinRequest.belongsTo(Community, {
  foreignKey: {
    name: "group_id",
    target: "id",
    allowNull: false,
    onDelete: "CASCADE",
  },
  foreignKeyConstraints: true,
});
