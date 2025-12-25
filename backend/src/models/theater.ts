import { sequelize } from "../config/Database.js";
import { DataType, DataTypes } from "sequelize";
const theater = sequelize.define("Theater", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "Theater",
    timestamps: true
})
export default theater;