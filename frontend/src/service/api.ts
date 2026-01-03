import axios from "axios"
import { API_URL } from "../constant/Url"
import storageToken from "./storageToken"

export const registerUser = async (userData: { name: string; email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        console.error("Register error:", error);
        throw error;
    }
};

export const loginUser = async (userData: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Backend response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const getMovie = async () => {
    try {
        const response = await axios.get(`${API_URL}/movies`);
        console.log("Movie response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Get movies error:", error);
        throw error;
    }
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
    showtimeId: number;
    numberOfSeats: number;
}) => {
    try {
        const response = await storageToken.post(`/reservations/`, reservationData);
        return response.data;
    } catch (error: any) {
        console.error("Create reservation error:", error);
        throw error;
    }
};

export const checkSeatAvailability = async (
    showtimeId: number,
    numberOfSeats: number
) => {
    try {
        const response = await storageToken.post(`/reservations/check-availability`, {
            showtimeId,
            numberOfSeats,
        });
        return response.data;
    } catch (error: any) {
        console.error("Check seat availability error:", error);
        throw error;
    }
};