import express from "express";
import {
  createReservation,
  getReservationByCode,
  cancelReservation,
  checkSeatAvailability,
  getUserReservations,
} from "../controllers/reservations.js";
import authMiddleware from "../middlewares/authmiddlewares.js";
import {
  validateCreateReservation,
  validateConfirmationCode
} from "../validation/reservationValidation.js";

const router = express.Router();

router.post("/", validateCreateReservation, authMiddleware, createReservation);
router.post("/check-availability", authMiddleware, checkSeatAvailability);
router.get("/my-reservations", authMiddleware, getUserReservations);

router.get("/:code", validateConfirmationCode, authMiddleware, getReservationByCode);
router.delete("/:code", validateConfirmationCode, authMiddleware, cancelReservation);

export default router;
