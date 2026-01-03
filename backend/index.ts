import express, { type Request, type Response } from "express"
import cors from 'cors';
import authRouter from "./src/router/authRouter.js"
import theaterRouter from "./src/router/theaterRouter.js";
import showtimeRouter from "./src/router/showtimeRouter.js";
import reservations from "./src/router/reservations.js";
import movies from "./src/router/movies.js"
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import './app.js'
import './src/models/associations.js';

export const app = express()

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRouter)
app.use("/api/showtime", showtimeRouter)
app.use("/api/theater", theaterRouter)
app.use("/api/reservations", reservations)
app.use("/api/movies", movies)

app.get('/', (_req: Request, res: Response) => {
  res.send("hello world")
})

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode}`);
  });
  next();
});

app.use(notFound)
app.use(errorHandler)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})