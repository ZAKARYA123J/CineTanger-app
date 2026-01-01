import { register, login } from "../controllers/authControllers.js"
import validationMiddlewares from "../middlewares/authmiddlewares.js"
import express from "express"
import { createMovie } from "../controllers/movies.js"
const router = express.Router()

router.post("/register", register)
// router.post("/create" , createMovie)
router.post("/login", validationMiddlewares, login)
export default router;