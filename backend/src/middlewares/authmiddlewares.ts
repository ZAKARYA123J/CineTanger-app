import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import { Request, Response } from "express"
const JWT_TOKEN = process.env.JWT_TOKEN;
const validationMiddlewares = async (req: any, res: Response, next: any) => {
    try {
        const authheader = req.headers.authorization
        if (!authheader) {
            return res.status(400).json({ message: "no token" })
        }
        const valideToken = authheader.split("Bearer ")[1]
        if (!valideToken) {
            return res.status(401).json({ message: "Invalid token format" })
        }
        const valid = jwt.verify(valideToken, JWT_TOKEN)
        req.user = valid;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Unauthorized" })
    }
}
export default validationMiddlewares;