import express, { type Request, type Response } from "express"
import authRouter from "./src/router/authRouter.js"
import "./app.js"
import theaterRouter from "./src/router/theaterRouter.js";
import showtimeRouter from "./src/router/showtimeRouter.js";
import reservations from "./src/router/reservations.js";
import movieRouter from "./src/router/movies.js"
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import logger, { stream } from './src/config/logger.js';
import morgan from 'morgan';

export const app = express()
// Morgan HTTP request logger
app.use(morgan('combined', { stream }));

app.use(express.json())


// Error handler (should be last)


app.use(express.json());
app.use("/api/auth", authRouter)
app.use("/api/timers", showtimeRouter)
app.use("/api/theaters", theaterRouter)
app.use("/api/reservations", reservations)
app.use("/api/movies", movieRouter)

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.use(notFound)
app.use(errorHandler)
// Add this after your routes to see if requests complete
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode}`);
  });
  next();
});
app.get('/', (_req: Request, res: Response) => {
    res.send("hello word")
})


const PORT = 3000

app.listen(PORT, () => {
 logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  // Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
});