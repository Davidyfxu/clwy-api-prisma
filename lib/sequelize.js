import { Sequelize } from "sequelize";
import config from "../config/config.js";

// 直接使用 development 配置
const dbConfig = config.development;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false, // 如需调试可设为 console.log
  }
);

export default sequelize;
