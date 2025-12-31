import { Response, Request } from "express";
import { movie, showtime, theater } from '../models/associations.js';

export const Showtime = async (req: Request, res: Response) => {
    try {
        const { startTime, price, totalSeats, MovieId, theaterId } = req.body;

        const Movie = await movie.findByPk(MovieId);
        if (!Movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const Theater = await theater.findByPk(theaterId);
        if (!Theater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        const newShowtime = await showtime.create({
            startTime: startTime,
            price,
            totalSeats,
            bookedSeats: 0,
            MovieId,
            theaterId
        });

        return res.status(200).json({
            message: "Showtime is registered",
            newShowtime
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating showtime",
            error
        });
    }
}

export const allShowtime = async (req: Request, res: Response) => {
    try {
        const showtimes = await showtime.findAll({
            include: [
                { model: movie, as: 'movie' },
                { model: theater, as: 'theater' }
            ]
        });

        res.status(200).json({
            message: "Showtimes retrieved successfully",
            data: showtimes
        });

    } catch (error) {
        res.status(500).json({
            message: "Showtimes not found",
            error
        });
    }
}