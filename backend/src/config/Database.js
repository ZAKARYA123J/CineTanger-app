import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    logging: false,
});
console.log("Host", process.env.DB_NAME, process.env.DB_HOST);
export default sequelize
