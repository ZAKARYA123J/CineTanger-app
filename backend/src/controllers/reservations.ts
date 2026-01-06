import type { Request, Response } from 'express';
import Reservation from '../models/Reservation.js';
import Showtime from '../models/showtime.js';
import { AppError, asyncHandler } from '../middlewares/errorHandler.js';
import { calculateAvailableSeats } from '../utils/seatsHelper.js';
import { generateConfirmationCode } from '../utils/confirmationCodeGenerator.js';
import logger from '../config/logger.js';

// Create reservation
export const createReservation = asyncHandler(async (req: Request, res: Response) => {
    const { userId, showtimeId, numberOfSeats } = req.body;
    
    logger.info('Creating reservation', { userId, showtimeId, numberOfSeats });
    
    // Get showtime
    const showtime = await Showtime.findByPk(showtimeId);
    
    if (!showtime) {
        logger.warn(`Showtime not found: ${showtimeId}`);
        throw new AppError('Showtime not found', 404);
    }
    
    // Check seat availability
    const availableSeats = calculateAvailableSeats(showtime);
    
    logger.info(`Available seats for showtime ${showtimeId}: ${availableSeats}`);
    
    if (availableSeats < numberOfSeats) {
        logger.warn('Insufficient seats', { requested: numberOfSeats, available: availableSeats });
        throw new AppError('Not enough seats available', 400);
    }
    
    // Generate confirmation code
    const confirmationCode = await generateConfirmationCode();
    
    // Calculate total price
    const totalPrice = showtime.get('price') as number * numberOfSeats;
    
    // Create reservation
    const reservation = await Reservation.create({
        userId,
        showtimeId,
        numberOfSeats,
        confirmationCode,
        totalPrice
    });
    
    // Update booked seats
    const currentBookedSeats = showtime.get('bookedSeats') as number;
    await showtime.update({
        bookedSeats: currentBookedSeats + numberOfSeats
    });
    
    logger.info(`Reservation created successfully`, {
        confirmationCode,
        reservationId: reservation.get('id'),
        totalPrice
    });
    
    res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        data: reservation
    });
});

// Get reservation by confirmation code
export const getReservationByCode = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    
    logger.info(`Fetching reservation with code: ${code}`);
    
    const reservation = await Reservation.findOne({
        where: { confirmationCode: code }
    });
    
    if (!reservation) {
        logger.warn(`Reservation not found with code: ${code}`);
        throw new AppError('Reservation not found', 404);
    }
    
    logger.info(`Reservation found: ${code}`);
    
    res.status(200).json({
        success: true,
        data: reservation
    });
});

// Cancel reservation
export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    
    logger.info(`Cancelling reservation with code: ${code}`);
    
    // Find reservation
    const reservation = await Reservation.findOne({
        where: { confirmationCode: code }
    });
    
    if (!reservation) {
        logger.warn(`Reservation not found for cancellation: ${code}`);
        throw new AppError('Reservation not found', 404);
    }
    
    // Get showtime to release seats
    const showtimeId = reservation.get('showtimeId') as number;
    const numberOfSeats = reservation.get('numberOfSeats') as number;
    
    const showtime = await Showtime.findByPk(showtimeId);
    
    if (showtime) {
        const currentBookedSeats = showtime.get('bookedSeats') as number;
        await showtime.update({
            bookedSeats: Math.max(0, currentBookedSeats - numberOfSeats)
        });
        
        logger.info(`Released ${numberOfSeats} seats for showtime ${showtimeId}`);
    }
    
    // Delete reservation
    await reservation.destroy();
    
    logger.info(`Reservation cancelled successfully: ${code}`);
    
    res.status(200).json({
        success: true,
        message: 'Reservation cancelled successfully',
        data: {}
    });
});