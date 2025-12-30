import { body, param, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

//middleware to handle validation errors
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

//validation rules for creating a movie
export const validateCreateMovie = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer (in minutes)'),

  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Genre must be between 2 and 100 characters'),

  body('releaseDate')
    .optional()
    .isISO8601()
    .withMessage('Release date must be a valid date (YYYY-MM-DD)'),

  body('posterUrl')
    .optional()
    .isURL()
    .withMessage('Poster URL must be a valid URL'),

  handleValidationErrors
];
/**
 * Validation rules for updating a movie
 */

export const validateCreateReservation = [
  body("showtimeId")
    .notEmpty()
    .withMessage("Showtime ID is required")
    .isInt({ min: 1 })
    .withMessage("Showtime ID must be a positive integer"),

  body("numberOfSeats")
    .notEmpty()
    .withMessage("Number of seats is required")
    .isInt({ min: 1 })
    .withMessage("Number of seats must be a positive integer"),

  handleValidationErrors
];
//Validation rules for movie ID parameter
export const validateMovieId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Movie ID must be a valid positive integer'),

  handleValidationErrors
];
