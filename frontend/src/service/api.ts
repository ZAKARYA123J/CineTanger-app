import axios from "axios"
import { API_URL } from "../constant/Url"

export const getMovie = async () => {
    const movies = await axios.get(`${API_URL}/movies`)
    return movies.data;
}

export const getMovieById = async (id: number | string) => {
    const movie = await axios.get(`${API_URL}/movies/${id}`)
    return movie.data.data
}

// ===== NEW: Showtime & Reservation APIs =====

export const getShowtimesByMovieId = async (movieId: number | string) => {
    const response = await axios.get(`${API_URL}/showtimes`, {
        params: { movieId }
    });
    return response.data;
}

export const checkSeatAvailability = async (showtimeId: number, numberOfSeats: number) => {
    const response = await axios.post(`${API_URL}/showtimes/${showtimeId}/check-availability`, {
        numberOfSeats
    });
    return response.data;
}

export const createReservation = async (reservationData: {
    userId: number;
    showtimeId: number;
    numberOfSeats: number;
}) => {
    const response = await axios.post(`${API_URL}/reservations`, reservationData);
    return response.data;
}

export const getReservationByCode = async (code: string) => {
    const response = await axios.get(`${API_URL}/reservations/${code}`);
    return response.data;
}

export const cancelReservation = async (confirmationCode: string) => {
    const response = await axios.delete(`${API_URL}/reservations/${confirmationCode}`);
    return response.data;
}