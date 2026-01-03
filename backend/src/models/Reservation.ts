import { sequelize } from "../config/Database.js";
import { DataTypes } from "sequelize";
import user from "./User.js";
import showtime from "./showtime.js";

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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: "reservations",
    timestamps: true
});

reservation.belongsTo(user, { foreignKey: "userId" });
reservation.belongsTo(showtime, { foreignKey: "showtimeId" });

user.hasMany(reservation, { foreignKey: "userId" });
showtime.hasMany(reservation, { foreignKey: "showtimeId" });

export default reservation;