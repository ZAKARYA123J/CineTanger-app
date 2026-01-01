import { sequelize } from "../config/Database.js";
import { DataType, DataTypes } from "sequelize";
import theater from "./theater.js";
import movie from "./Movie.js";
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
            model: "movies",
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
        type: DataTypes.INTEGER,
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
    tableName: "showtimes",
    timestamps: true
})
showtime.belongsTo(movie, { foreignKey: "MovieId" });
showtime.belongsTo(theater, { foreignKey: "theaterId" });
export default showtime;
