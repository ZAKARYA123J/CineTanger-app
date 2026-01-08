import { sequelize } from "./src/config/Database.js"
import User from "./src/models/User.js"
import Movie from "./src/models/Movie.js"
import Theater from "./src/models/theater.js"
import Showtime from "./src/models/showtime.js"
import Reservation from "./src/models/Reservation.js"

export const syncDatabase = async () => {
  try {
   
    

    await sequelize.sync({ alter: true });

    // await Movie.sync({ force: true });
    // console.log("✅ Movie 表已创建");
    
    // await Theater.sync({ force: true });
    // console.log("✅ Theater 表已创建");
    

    // await Showtime.sync({ force: true });
    // console.log("✅ Showtime 表已创建");
    
    // await Reservation.sync({ force: true });
  
  } catch (err) {
    console.error("❌ 数据库同步错误:", err.message);
    // 更详细的错误信息
    if (err.parent) {
      console.error("SQL 错误:", err.parent.message);
      console.error("SQL 语句:", err.sql);
    }
  }
};
