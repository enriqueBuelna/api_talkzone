import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Community } from "./communitie.model.js";
import { User } from "./usuario.model.js";

export const CommunityMember = sequelize.define(
  "CommunityMember",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    role: {
      type: DataTypes.ENUM("member", "admin"),
      defaultValue: "member",
    },
  },
  {
    tableName: "Communities_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["group_id", "user_id"],
      },
    ],
  }
);

// // Relaciones
CommunityMember.belongsTo(Community, {
  foreignKeyConstraints: true,
  foreignKey: "group_id",
  targetKey: "id",
});

CommunityMember.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: "user_id",
  targetKey: "id",
});
