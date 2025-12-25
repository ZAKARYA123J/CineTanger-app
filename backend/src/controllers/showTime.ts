import type { Request, Response } from 'express';
import showtime from '../models/showtime.js';
import { calculateAvailableSeats } from '../utils/seatsHelper.js';

//Get showtime with available seats calculation
export const getShowtimeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
     const show = await showtime.findByPk(id);
      if (!show) {
      res.status(404).json({
        success: false,
        message: `Showtime with ID ${id} not found`
      });
      return;
    }
     // Calculate available seats automatically
    const availableSeats = await calculateAvailableSeats(Number(id));

    res.status(200).json({
      success: true,
      data: {
        ...show.toJSON(),
        availableSeats  // calculated available seats
      }
    });
     } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
