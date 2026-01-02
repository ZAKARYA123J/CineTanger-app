import axios from "axios";
import { API_URL } from "../constant/Url";
import { logError, addBreadcrumb } from "../../utils/errorHandler";

// Add request interceptor
axios.interceptors.request.use(
    (config) => {
        addBreadcrumb(`API Request: ${config.method?.toUpperCase()} ${config.url}`, 'api');
        return config;
    },
    (error) => {
        logError(error, { type: 'request_error' });
        return Promise.reject(error);
    }
);

// Add response interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        logError(error, {
            type: 'api_error',
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

// Movie APIs
export const getMovie = async () => {
    const movies = await axios.get(`${API_URL}/movies`);
    return movies.data;
}

export const getMovieById = async (id: number | string) => {
    const movie = await axios.get(`${API_URL}/movies/${id}`);
    return movie.data.data;
}

// Showtime & Reservation APIs
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