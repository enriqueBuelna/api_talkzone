import { config } from "dotenv";
config();

import { Sequelize } from "@sequelize/core";
// import { MySqlDialect } from "@sequelize/mysql";
// import { User } from "../src/models/user.model.js";

// const sequelize = new Sequelize({
//   dialect: MySqlDialect,
//   database: process.env.DATABASE,
//   user: process.env.MYSQL_USER,
//   password: process.env.PASSWORD,
//   host: process.env.MYSQL_HOST,
//   port: 3306
// });

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: process.env.DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.PASSWORD,
  host: process.env.MYSQL_HOST,
  port: 3306, // Para ver los logs de SQL generados
});


export default sequelize;
