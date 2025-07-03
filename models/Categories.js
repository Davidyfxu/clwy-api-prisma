import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Category = sequelize.define(
  "Categories",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "名称已存在，请选择其他名称。" },
      validate: {
        notNull: { msg: "名称必须填写。" },
        notEmpty: { msg: "名称不能为空。" },
        len: { args: [2, 45], msg: "长度必须是2 ~ 45之间。" },
      },
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "排序必须填写。" },
        notEmpty: { msg: "排序不能为空。" },
        isInt: { msg: "排序必须为整数。" },
        isPositive(value) {
          if (value <= 0) {
            throw new Error("排序必须是正整数。");
          }
        },
      },
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
    tableName: "Categories",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

export default Category;
