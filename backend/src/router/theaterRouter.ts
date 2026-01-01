import express from "express";
import { addTheater, allTheater } from "../controllers/theaterControllers.js";

const router = express.Router();

/**
 * @swagger
 * /theaters:
 *   post:
 *     summary: Ajoute un nouveau cinéma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Théâtre créé avec succès
 */
router.post("/theater", addTheater);

/**
 * @swagger
 * /theaters/{id}:
 *   get:
 *     summary: Retourne un cinéma par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du cinéma
 *     responses:
 *       200:
 *         description: Détails du cinéma
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 title:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: string
 */
router.get("/theater/:id", allTheater);

export default router;
