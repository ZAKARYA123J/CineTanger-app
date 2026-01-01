import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movies.js';
import {
  validateCreateMovie,
  validateMovieId
} from '../validation/movieValidation.js';

const router = express.Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retourne tous les films
 *     responses:
 *       200:
 *         description: Liste des films
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   title:
 *                     type: string
 */
router.get('/', getAllMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Retourne un film par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Détails du film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 title:
 *                   type: string
 */
router.get('/:id', validateMovieId, getMovieById);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Crée un nouveau film
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
router.post('/', validateCreateMovie, createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Met à jour un film
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film à mettre à jour
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
 *       200:
 *         description: Film mis à jour avec succès
 */
router.put('/:id', validateCreateMovie, updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Supprime un film
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film à supprimer
 *     responses:
 *       200:
 *         description: Film supprimé avec succès
 */
router.delete('/:id', validateMovieId, deleteMovie);

export default router;
