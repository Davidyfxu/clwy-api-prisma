import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Chapter = sequelize.define(
  "Chapters",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
    video: { type: DataTypes.STRING },
    rank: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
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
    tableName: "Chapters",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [{ fields: ["courseId"] }],
  },
);

export default Chapter;
