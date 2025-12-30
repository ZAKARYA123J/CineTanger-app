import { body, param, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg
      }))
    });
    return;
  }

  next();
};

//validation rules for creating a reservation 
export const validateCreateReservation = [
  body('showtimeId')
    .notEmpty()
    .withMessage('Showtime ID is required')
    .isInt({ min: 1 })
    .withMessage('Showtime ID must be a positive integer'),

  body('numberOfSeats')
    .notEmpty()
    .withMessage('Number of seats is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of seats must be between 1 and 10'),

  handleValidationErrors
];

//validation for confirmation code param
export const validateConfirmationCode = [
  param('code')
    .notEmpty()
    .withMessage('Confirmation code is required')
    .matches(/^CINE-[A-Z0-9]{5}$/)
    .withMessage('Invalid confirmation code format. Expected: CINE-XXXXX'),

  handleValidationErrors
];