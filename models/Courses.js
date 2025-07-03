import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Course = sequelize.define(
  "Courses",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING },
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    content: { type: DataTypes.TEXT },
    likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    chaptersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
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
  },
  {
    tableName: "Courses",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["userId"] },
      { fields: ["recommended"] },
      { fields: ["introductory"] },
    ],
  },
);

export default Course;
