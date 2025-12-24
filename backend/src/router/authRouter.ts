import { loginUser } from "../controllers/authControllers.js"
import express from "express"

const router = express.Router()

router.post("/register" , loginUser)
export default router;