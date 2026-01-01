import { sequelize } from "./src/config/Database.js"

sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Database connected successfully")
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err)
  })
