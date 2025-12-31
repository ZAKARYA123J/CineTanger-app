import { sequelize } from "./src/config/Database.js"

sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully")
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err)
  })
