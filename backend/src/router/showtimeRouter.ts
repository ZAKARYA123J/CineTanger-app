import express from "express";
import { Showtime, allShowtime } from "../controllers/showtimesControllers.js";
import validationMiddlewares from "../middlewares/authmiddlewares.js";

const router = express.Router();

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Crée un nouvel horaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: number
 *               theaterId:
 *                 type: number
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               totalSeats:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Horaire créé avec succès
 */
router.post("/showtime", Showtime);

/**
 * @swagger
 * /showtimes/{id}:
 *   get:
 *     summary: Retourne un horaire par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l’horaire
 *     responses:
 *       200:
 *         description: Détails de l’horaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 movieId:
 *                   type: number
 *                 theaterId:
 *                   type: number
 *                 startTime:
 *                   type: string
 *                 totalSeats:
 *                   type: number
 *                 price:
 *                   type: number
 */
router.get("/showtime/:id", allShowtime);

export default router;
