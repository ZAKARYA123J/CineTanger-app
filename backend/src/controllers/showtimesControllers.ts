import { Response, Request } from "express";
import movie from "../models/Movie.js";
import theater from "../models/theater.js";
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