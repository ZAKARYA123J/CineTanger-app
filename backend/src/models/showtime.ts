import { sequelize } from "../config/Database.js";
import { DataType, DataTypes } from "sequelize";
const showtime = sequelize.define("Showtime", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MovieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Movie",
            key: "id"
        }
    },
    theaterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Theater",
            key: "id"
        }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bookedSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: "Showtime",
    timestamps: true
})
export default showtime;