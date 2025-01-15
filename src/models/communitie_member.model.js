import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Community } from "./communitie.model.js";
import { User } from "./user.model.js";


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
    type:{
      type: DataTypes.ENUM("mentor","entusiasta","explorador","otro"),
      defaultValue: "otro"
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
  },
  {
    tableName: "Communities_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["group_id", "user_id"],
        name:"community_member_unique"
      },
    ],
  }
);

// // Relaciones
CommunityMember.belongsTo(Community, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"group_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  }
});

CommunityMember.belongsTo(User, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"user_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  }
});

Community.hasMany(CommunityMember, {
  foreignKeyConstraints: true,
  foreignKey: {
    name:"group_id",
    target:"id",
    allowNull:false,
    onDelete:"CASCADE"
  },
});
