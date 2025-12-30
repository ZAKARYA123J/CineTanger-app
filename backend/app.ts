import { sequelize } from "./src/config/Database.js"

<<<<<<< HEAD
sequelize.sync({ alter: true })
=======
sequelize.sync({force:true})
>>>>>>> eceaa6e (test movies)
  .then(() => {
    console.log("✅ Database connected successfully")
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err)
  })
