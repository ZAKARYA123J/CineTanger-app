import theater from "../models/theater.js"
import { Request, Response } from "express"
export const addTheater = async (req: Request, res: Response) => {
    try {
        const { title, name, capacity } = req.body
        if (!title || !name || !capacity) {
            return res.status(400).json({ message: "add your theater" })
        }
        const save = await theater.create({ title, name, capacity })
        return res.status(200).json({ message: "theater is confirme", save })
    } catch (error) {
        return res.status(400).json({ message: "theater is error", error })
    }
}
export const allTheater = async (req: Request, res: Response) => {
    try {
        const get = await theater.findAll()
        res.status(200).json({ message: "confirme get theater", get })
    } catch (error) {
        res.status(400).json({ message: "showtime not theater", error })
    }
}