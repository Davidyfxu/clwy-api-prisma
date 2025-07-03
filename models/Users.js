import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const User = sequelize.define(
  "Users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "邮箱必须填写。" },
        notEmpty: { msg: "邮箱不能为空。" },
        isEmail: { msg: "邮箱格式不正确。" },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } });
          if (user) {
            throw new Error("邮箱已存在，请直接登录。");
          }
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "用户名必须填写。" },
        notEmpty: { msg: "用户名不能为空。" },
        len: { args: [2, 45], msg: "用户名长度必须是2 ~ 45之间。" },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value } });
          if (user) {
            throw new Error("用户名已经存在。");
          }
        },
      },
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "昵称必须填写。" },
        notEmpty: { msg: "昵称不能为空。" },
        len: { args: [2, 45], msg: "昵称长度必须是2 ~ 45之间。" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "密码必须填写。" },
        notEmpty: { msg: "密码不能为空。" },
        len: { args: [6, 45], msg: "密码长度必须是6 ~ 45之间。" },
      },
    },
    avatar: { type: DataTypes.STRING },
    sex: {
      type: DataTypes.ENUM("MALE", "FEMALE", "UNKNOWN"),
      allowNull: false,
      defaultValue: "UNKNOWN",
    },
    company: { type: DataTypes.STRING },
    introduce: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM("NORMAL", "ADMIN"),
      allowNull: false,
      defaultValue: "NORMAL",
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
    tableName: "Users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      { fields: ["email"] },
      { fields: ["username"] },
      { fields: ["role"] },
    ],
  },
);

export default User;
