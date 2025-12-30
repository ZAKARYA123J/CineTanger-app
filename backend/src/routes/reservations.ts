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

const router: any = express.Router();

//create a new reservation  with validation and seat availability
router.post('/', validateCreateReservation, createReservation);
// Get reservation by confirmation code
router.get('/:code', validateConfirmationCode, getReservationByCode);
// Cancel reservation by confirmation code
router.delete('/:code', validateConfirmationCode, cancelReservation);

export default router;