import showtime from '../models/showtime.js';

//Calculate available seats for a showtime
//Formula: availableSeats = totalSeats - bookedSeats
export const calculateAvailableSeats = async (showtimeId: number): Promise<number> => {
  const show = await showtime.findByPk(showtimeId);
   if (!show) {
    throw new Error(`Showtime with ID ${showtimeId} not found`);
  }

  const totalSeats = show.get('totalSeats') as number;
  const bookedSeats = show.get('bookedSeats') as number;
  
  // Simple calculation: total - booked = available
  return totalSeats - bookedSeats;
};
