import { sequelize } from "./src/config/Database.js"

sequelize.sync()
  .then(() => {
    console.log("✅ Database connected successfully")
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err)
  })
