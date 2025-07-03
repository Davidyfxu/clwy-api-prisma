import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Article = sequelize.define(
  "Articles",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title is required" },
        notEmpty: { msg: "Title cannot be empty" },
        len: {
          args: [2, 45],
          msg: "Title must be between 2 and 45 characters",
        },
      },
    },
    content: { type: DataTypes.TEXT },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: { type: DataTypes.DATE },
  },
  {
    tableName: "Articles",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    paranoid: true, // 支持 deletedAt
  },
);

export default Article;
