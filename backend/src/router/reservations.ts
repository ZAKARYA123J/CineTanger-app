import express from 'express';
import {
  createReservation,
  getReservationByCode,
  cancelReservation
} from '../controllers/reservations.js';
import {
  validateCreateReservation,
  validateConfirmationCode
} from '../validation/reservationValidation.js';
import authmiddlewares from "../middlewares/authmiddlewares.js"

const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: number
 *               showtimeId:
 *                 type: number
 *               seats:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 */
router.post('/', validateCreateReservation, authmiddlewares, createReservation);

/**
 * @swagger
 * /reservations/{code}:
 *   get:
 *     summary: Récupère une réservation par code de confirmation
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Code de confirmation
 *     responses:
 *       200:
 *         description: Détails de la réservation
 */
router.get('/:code', validateConfirmationCode, authmiddlewares, getReservationByCode);

/**
 * @swagger
 * /reservations/{code}:
 *   delete:
 *     summary: Annule une réservation par code de confirmation
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Code de confirmation
 *     responses:
 *       200:
 *         description: Réservation annulée
 */
router.delete('/:code', validateConfirmationCode, authmiddlewares, cancelReservation);

export default router;
