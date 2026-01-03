import showtime from '../models/showtime.js';

/**
 * Calculate available seats for a showtime
 * Formula: availableSeats = totalSeats - bookedSeats
 * @param showtimeId - The ID of the showtime
 * @returns Promise<number> - Number of available seats
 * @throws Error if showtime not found or invalid data
 */
export const calculateAvailableSeats = async (showtimeId: number): Promise<number> => {
  if (!showtimeId || typeof showtimeId !== 'number') {
    throw new Error('Invalid showtime ID. Must be a valid number');
  }

  const show = await showtime.findByPk(showtimeId);

  if (!show) {
    throw new Error(`Showtime with ID ${showtimeId} not found`);
  }

  const totalSeats = show.get('totalSeats') as number;
  const bookedSeats = show.get('bookedSeats') as number;

  if (totalSeats < 0 || bookedSeats < 0) {
    throw new Error('Invalid seat data: seats cannot be negative');
  }

  if (bookedSeats > totalSeats) {
    throw new Error('Invalid seat data: booked seats exceed total seats');
  }

  return totalSeats - bookedSeats;
};

/**
 * Calculate available seats from values directly
 * Use this when you already have totalSeats and bookedSeats values
 * @param totalSeats - Total capacity of the showtime
 * @param bookedSeats - Number of seats already booked
 * @returns number - Number of available seats
 */
export const calculateAvailableSeatsFromValues = (
  totalSeats: number,
  bookedSeats: number
): number => {
  if (totalSeats < 0 || bookedSeats < 0) {
    throw new Error('Seats cannot be negative');
  }

  if (bookedSeats > totalSeats) {
    throw new Error('Booked seats cannot exceed total seats');
  }

  return totalSeats - bookedSeats;
};