import { Request, Response } from "express";
import Reservation from "../models/Reservation.js";
import Showtime from "../models/showtime.js";
import Movie from "../models/Movie.js";
import Theater from "../models/theater.js";
import { calculateAvailableSeatsFromValues } from "../utils/seatsHelper.js";
import { generateConfirmationCode } from "../utils/confirmationCodeGenerator.js";
import logger from "../config/logger.js";

export const createReservation = async (req: Request & { user?: { id: number } }, res: Response) => {
  try {
    const { showtimeId, numberOfSeats } = req.body;
    const userId = req.user?.id;

    if (!userId || !showtimeId || !numberOfSeats) {
      return res.status(400).json({ success: false, message: "userId, showtimeId, and numberOfSeats are required" });
    }

    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) {
      return res.status(404).json({ success: false, message: "Showtime not found" });
    }

    const totalSeats = showtime.get("totalSeats") as number;
    const bookedSeats = showtime.get("bookedSeats") as number;
    const availableSeats = calculateAvailableSeatsFromValues(totalSeats, bookedSeats);

    if (availableSeats < numberOfSeats) {
      return res.status(400).json({ success: false, message: "Not enough seats available", availableSeats });
    }

    const confirmationCode = await generateConfirmationCode();
    const price = showtime.get("price") as number;
    const totalPrice = price * numberOfSeats;

    const reservation = await Reservation.create({
      userId,
      showtimeId,
      numberOfSeats,
      confirmationCode,
      totalPrice
    });

    await showtime.update({ bookedSeats: bookedSeats + numberOfSeats });

    logger.info("Reservation created", { userId, showtimeId, confirmationCode });

    return res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation
    });
  } catch (error) {
    console.error("Create reservation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getReservationByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const reservation = await Reservation.findOne({ where: { confirmationCode: code } });

    if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found" });

    return res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.error("Get reservation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const reservation = await Reservation.findOne({ where: { confirmationCode: code } });

    if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found" });

    const showtime = await Showtime.findByPk(reservation.get("showtimeId") as number);
    if (showtime) {
      const currentBookedSeats = showtime.get("bookedSeats") as number;
      const numberOfSeats = reservation.get("numberOfSeats") as number;
      await showtime.update({ bookedSeats: Math.max(0, currentBookedSeats - numberOfSeats) });
    }

    await reservation.destroy();
    return res.status(200).json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkSeatAvailability = async (req: Request, res: Response) => {
  try {
    const { showtimeId, numberOfSeats } = req.body;
    if (!showtimeId) return res.status(400).json({ success: false, message: "Showtime ID is required" });

    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) return res.status(404).json({ success: false, message: "Showtime not found" });

    const totalSeats = showtime.get("totalSeats") as number;
    const bookedSeats = showtime.get("bookedSeats") as number;
    const availableSeats = calculateAvailableSeatsFromValues(totalSeats, bookedSeats);

    return res.status(200).json({
      success: true,
      available: availableSeats >= numberOfSeats,
      availableSeats,
    });
  } catch (error) {
    console.error("Check seats error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserReservations = async (req: Request & { user?: { id: number } }, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const reservations = await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Showtime,
          include: [
            { model: Movie, attributes: ["title", "photo", "duration"] },
            { model: Theater, attributes: ["name", "title"] }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error("Get user reservations error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
