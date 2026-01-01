import express from 'express';
import {
  createReservation,
  getReservationByCode,
  cancelReservation,
  checkAvailability
} from '../controllers/reservations.js';
import {
  validateCreateReservation,
  validateConfirmationCode
} from '../validation/reservationValidation.js';
import authmiddlewares from "../middlewares/authmiddlewares.js"

const router: any = express.Router();

//create a new reservation  with validation and seat availability
router.post('/', validateCreateReservation, authmiddlewares, createReservation);
// Get reservation by confirmation code
router.get('/:code', validateConfirmationCode, authmiddlewares, getReservationByCode);
// Cancel reservation by confirmation code
// Cancel reservation by confirmation code
router.delete('/:code', validateConfirmationCode, authmiddlewares, cancelReservation);
// Check seat availability
router.post('/check-availability', authmiddlewares, checkAvailability);

export default router;