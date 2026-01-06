import { Showtime, allShowtime } from "../controllers/showtimesControllers.js"
import validationMiddlewares from "../middlewares/authmiddlewares.js"
import express from "express"
const router = express.Router()

router.post("/showtime", Showtime)
router.get("/showtime", validationMiddlewares, allShowtime)
export default router;