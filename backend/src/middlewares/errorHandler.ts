import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

// Custom error class
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handler
export const errorHandler = (
    err: any,
    req: Request,
    res: Response
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error details
    logger.error('API Error:', {
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.body,
        params: req.params,
        query: req.query,
    });

    // Send response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    } else {
        // Production: don't leak error details
        res.status(err.statusCode).json({
            success: false,
            message: err.isOperational ? err.message : 'Something went wrong',
        });
    }
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    logger.warn('404 Not Found:', {
        path: req.path,
        method: req.method,
        ip: req.ip,
    });

    const error = new AppError(`Route ${req.path} not found`, 404);
    next(error);
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};