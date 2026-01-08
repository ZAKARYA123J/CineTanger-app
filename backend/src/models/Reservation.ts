import { sequelize } from "../config/Database.js";
import { DataTypes } from "sequelize";
const reservation = sequelize.define("Reservation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "showtimes",
            key: "id"
        }
    },
    numberOfSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    confirmationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    totalPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
}, {
    tableName: "Reservation",
    timestamps: true
})
export default reservation;