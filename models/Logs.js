import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const Log = sequelize.define(
  "Logs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    meta: { type: DataTypes.STRING, allowNull: false },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Logs",
    timestamps: false,
  },
);

export default Log;
