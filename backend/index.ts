import express, { type Request, type Response } from "express";
import authRouter from "./src/router/authRouter.js";
import movieRouter from "./src/routes/movies.js";
import reservationRouter from "./src/routes/reservations.js";
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import logger, { stream } from './src/config/logger.js';
import morgan from 'morgan';

const app = express();

// Morgan HTTP request logger
app.use(morgan('combined', { stream }));

// Middleware - Body parser
app.use(express.json());

// Routes
app.get('/', (_req: Request, res: Response) => {
    logger.info('Root endpoint accessed');
    res.send("hello world");
});

app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/reservations", reservationRouter);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

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