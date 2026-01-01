import type { Request, Response } from "express";
import reservation from "../models/Reservation.js";
import showtime from "../models/showtime.js";
import { calculateAvailableSeats } from "../utils/seatsHelper.js";
import { generateConfirmationCode } from '../utils/confirmationCodeGenerator.js';

export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { showtimeId, numberOfSeats } = req.body;
    const userId = req.user!.id;
    const show = await showtime.findByPk(showtimeId);
    if (!show) {
      res.status(400).json({
        success: false,
        message: 'Showtime not found'
      });
      return;
    }
    const availableSeats = await calculateAvailableSeats(showtimeId);
    if (availableSeats < numberOfSeats) {
      res.status(400).json({
        success: false,
        message: `Not enough seats available. only ${availableSeats} seats remaining`
      });
      return;
    }
    const confirmationCode = await generateConfirmationCode();
    const pricePerSeat = show.get('price') as number;
    const totalPrice = pricePerSeat * numberOfSeats;
    const newReservation = await reservation.create({
      userId,
      showtimeId,
      numberOfSeats,
      confirmationCode,
      totalPrice
    });
    const currentBooked = show.get('bookedSeats') as number;
    await show.update({
      bookedSeats: currentBooked + numberOfSeats
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: newReservation
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating reservation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
export const getReservationByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const reservationData = await reservation.findOne({
      where: { confirmationCode: code }
    });
    if (!reservationData) {
      res.status(404).json({
        success: false,
        message: `Reservation with code ${code} not found`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: reservationData
    });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
export const cancelReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const reservationData = await reservation.findOne({
      where: { confirmationCode: code }
    });
    if (!reservationData) {
      res.status(404).json({
        success: false,
        message: `Reservation with code ${code} not found`
      });
      return;
    }
    if (!reservationData) {
      res.status(404).json({
        success: false,
        message: `Reservation with code ${code} not found`
      });
      return;
    }
    const showtimeId = reservationData.get('showtimeId') as number;
    const numberOfSeats = reservationData.get('numberOfSeats') as number;
    const show = await showtime.findByPk(showtimeId);
    if (show) {
      const currentBooked = show.get('bookedSeats') as number;
      await show.update({
        bookedSeats: Math.max(0, currentBooked - numberOfSeats)
      });
    }
    await reservationData.destroy();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling reservation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { showtimeId, numberOfSeats } = req.body;

    const show = await showtime.findByPk(showtimeId);
    if (!show) {
      res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
      return;
    }

    const availableSeats = await calculateAvailableSeats(showtimeId);
    const isAvailable = availableSeats >= numberOfSeats;

    res.status(200).json({
      success: true,
      isAvailable,
      availableSeats
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking availability',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
