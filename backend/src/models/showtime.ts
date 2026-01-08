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
      MovieId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'movies', // 改为小写复数，与 Movie 模型中的 tableName 一致
      key: 'id'
    }
  },
  theaterId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Theater', // 同样改为小写复数
      key: 'id'
    }
  },
}, {
    tableName: "showtimes",
    timestamps: true
})
showtime.belongsTo(movie, { foreignKey: "MovieId" });
showtime.belongsTo(theater, { foreignKey: "theaterId" });
export default showtime;