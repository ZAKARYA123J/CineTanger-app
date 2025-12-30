import express, { type Request, type Response } from "express"
import authRouter from "./src/router/authRouter.js"
import movieRouter from "./src/routes/movies.js"
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import reservationRouter from "./src/routes/reservations.js"


const app = express()
app.use(express.json());
app.use("/api/auth",authRouter)
app.get('/', (_req: Request, res: Response) => {
    res.send("hello word")
})
app.use("/api/auth", authRouter)
app.use("/api/movies", movieRouter)  
app.use("/api/reservations", reservationRouter)

// 404 handler 
app.use(notFound);

// Error handler - handles all errors (LAST)
app.use(errorHandler);
const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})