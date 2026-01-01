import express from "express";
import { register, login } from "../controllers/authControllers.js";
import validationMiddlewares from "../middlewares/authmiddlewares.js";
import { createMovie } from "../controllers/movies.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur existant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 */
router.post("/login", validationMiddlewares, login);

/**
 * @swagger
 * /auth/create:
 *   post:
 *     summary: Crée un nouveau film (Admin uniquement)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Film créé avec succès
 */
router.post("/create", createMovie);

export default router;
