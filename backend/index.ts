import express, { type Request, type Response } from "express"
import authRouter from "./src/router/authRouter.js"
import "./app.js"
import theaterRouter from "./src/router/theaterRouter.js";
import showtimeRouter from "./src/router/showtimeRouter.js";
import reservations from "./src/routes/reservations.js";
const app = express()
app.use(express.json());
app.use("/api/auth", authRouter)
app.use("/api/auth", showtimeRouter)
app.use("/api/auth", theaterRouter)
app.use("/api/auth", reservations)
app.get('/', (_req: Request, res: Response) => {
    res.send("hello word")
})
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})