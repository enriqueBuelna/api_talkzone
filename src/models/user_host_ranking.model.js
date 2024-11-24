import { DataTypes, sql } from "@sequelize/core";
import { User } from "./user.model.js";
import sequelize from "../../db/db.js";

export const UserHostRanking = sequelize.define(
  "UserHostRanking",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    average_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_ratings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "UserHostRankings",
    timestamps: false,
  }
);

UserHostRanking.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});

User.hasMany(UserHostRanking, {
  as:"rating_",
  foreignKey:{
    name:"user_id",
    onDelete:"CASCADE"
  }
})