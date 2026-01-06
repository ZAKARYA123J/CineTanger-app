import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        logger.info('HTTP Request', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
    });
    
    next();
};