import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_TOKEN = process.env.JWT_TOKEN;

interface JwtPayload {
    id: number;
    email: string;
    [key: string]: any;
}

const authMiddleware = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const token = authHeader.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, JWT_TOKEN) as JwtPayload;
        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default authMiddleware;
