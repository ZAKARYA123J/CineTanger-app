import { sequelize } from "../config/Database.js";
import { DataType, DataTypes } from "sequelize";
import showtime from "./showtime.js";
import theater from "./theater.js";
const movie = sequelize.define("Movie", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "Movie",
    timestamps: true
})
export default movie;