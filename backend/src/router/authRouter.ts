import { register ,login,me} from "../controllers/authControllers.js"
import validationMiddlewares from "../middlewares/authmiddlewares.js"
import express from "express"
const router = express.Router()

router.post("/register" , register)
// router.post("/create" , createMovie)
router.post("/login",login)
router.post("/me",validationMiddlewares,login)
export default router;