import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Order = sequelize.define(
  "Orders",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    outTradeNo: { type: DataTypes.STRING, allowNull: false },
    tradeNo: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: {
      type: DataTypes.ENUM("ALIPAY", "WECHATPAY"),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("UNPAID", "PAID", "CANCEL"),
      allowNull: false,
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
    tableName: "Orders",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

export default Order;
