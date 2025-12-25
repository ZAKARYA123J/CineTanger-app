import showtime from "../models/showtime.js";
import { Response, Request } from "express";
import movie from "../models/Movie.js";
import theater from "../models/theater.js";
export const Showtime = async (req: Request, res: Response) => {
    try {
        const { startTime, price, totalSeats, bookedSeats, MovieId, theaterId } = req.body;
        const Movie = await movie.findByPk(MovieId);
        if (!Movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        const Theater = await theater.findByPk(theaterId);
        if (!Theater) {
            return res.status(404).json({ message: "Theater not found" });
        }
        const newShowtime = await showtime.create({
            startTime,
            price,
            totalSeats,
            bookedSeats,
            MovieId,
            theaterId
        });
        if (newShowtime) {
            return res.status(200).json({ message: "Showtime is register", newShowtime })
        }
        return res.status(200).json({ message: "showTime valide", newShowtime })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: "showTime nout found", error })
    }
}
export const allShowtime = async (req: Request, res: Response) => {
    try {
        const get = await showtime.findAll()
        res.status(200).json({ message: "confirme get showtime", get })
    } catch (error) {
        res.status(400).json({ message: "showtime not found", error })
    }
}