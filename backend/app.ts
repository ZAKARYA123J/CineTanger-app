import { sequelize } from "./config/Database.js"

sequelize.sync()
  .then(() => {
    console.log("✅ Database connected successfully")
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err)
  })
