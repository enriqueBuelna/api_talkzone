import { DataTypes } from "@sequelize/core";
import sequelize from "../../db/db.js";
import { Tag } from "./tag.models.js";
import { Community } from "./communitie.model.js";
export const CommunityTags = sequelize.define(
  "CommunityTags",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Communitie_tags", // Nombre de la tabla en la base de datos
    timestamps: false, // Si no quieres usar los timestamps automáticos de Sequelize
  }
);

CommunityTags.belongsTo(Tag, {
  foreignKey: {
    name: "tag_id",
    target: "id",
  },
  foreignKeyConstraints: true,
});

CommunityTags.belongsTo(Community, {
  as:"xd",
  foreignKey: {
    name: "group_id",
    target: "id",
  },
  foreignKeyConstraints: true,
});

Community.hasMany(CommunityTags, {
  as:"com_tag_id",
  foreignKey: "group_id",
  foreignKeyConstraints:true
})
