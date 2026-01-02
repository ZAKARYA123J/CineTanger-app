import axios from "axios"
import { API_URL } from "../constant/Url"

export const registerUser = async (userData: { name: string; email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        console.error("", error);
        throw error;
    }
};

export const getMovie = async () => {
    const response = await axios.get(`${API_URL}/movies`);
    console.log("Movie response:", response.data);
    return response.data;
};

export const getMovieById = async (id: number | string) => {
    try {
        const response = await axios.get(`${API_URL}/movies/${id}`);
        console.log("MovieById response:", response.data);
        return response.data.data;
    } catch (err) {
        console.error("Error fetching movie by id:", err);
        throw err;
    }
};

export const createReservation = async (reservationData: {
    userId: number;
    showtimeId: number;
    numberOfSeats: number;
}) => {
    try {
        const response = await axios.post(`${API_URL}/reservations`, reservationData);
        return response;
    } catch (err) {
        console.error("Error creating reservation:", err);
        throw err;
    }
};

export const checkSeatAvailability = async (showtimeId: number, numberOfSeats: number) => {
    try {
        const response = await axios.post(`${API_URL}/reservations/check-availability`, {
            showtimeId,
            numberOfSeats
        });
        return response;
    } catch (err) {
        console.error("Error checking availability:", err);
        throw err;
    }
};