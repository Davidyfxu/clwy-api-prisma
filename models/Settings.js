import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Setting = sequelize.define(
  "Settings",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "网站名称必须填写。" },
        len: { args: [2, 100], msg: "名称长度必须是2 ~ 100之间。" },
      },
    },
    icp: { type: DataTypes.STRING, allowNull: false },
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
    tableName: "Settings",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

export default Setting;
