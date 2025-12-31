import { Request, Response } from "express"
import { movie, showtime, theater } from '../models/associations.js';

export const addTheater = async (req: Request, res: Response) => {
    try {
        const { title, name, capacity } = req.body

        if (!title || !name || !capacity) {
            return res.status(400).json({ message: "Please provide all theater details" })
        }

        const newTheater = await theater.create({ title, name, capacity })

        return res.status(200).json({
            message: "Theater created successfully",
            data: newTheater
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error creating theater",
            error
        })
    }
}

export const allTheater = async (req: Request, res: Response) => {
    try {
        const theaters = await theater.findAll({
            include: [{
                model: showtime,
                as: 'showtimes',
                include: [{
                    model: movie,
                    as: 'movie'
                }]
            }]
        });

        res.status(200).json({
            message: "Theaters retrieved successfully",
            data: theaters
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching theaters",
            error
        });
    }
}