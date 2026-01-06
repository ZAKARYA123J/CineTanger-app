import { addTheater, allTheater } from "../controllers/theaterControllers.js"
import express from "express"
const router = express.Router()
router.post("/theater", addTheater)
router.get("/theater", allTheater)
export default router