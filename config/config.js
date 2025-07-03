// config/config.js
const config = {
  development: {
    username: "root",
    password: "clwy1234",
    database: "clwy_staging",
    port: 3307,
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+08:00",
  },
  production: {
    database: "your_database_prod",
    username: "your_user_prod",
    password: "your_password_prod",
    host: "your_host_prod",
    dialect: "postgres",
    timezone: "+08:00",
  },
};

export default config;
