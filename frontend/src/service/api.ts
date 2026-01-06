import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../constant/Url";
import storageToken from "./storageToken";

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
        await AsyncStorage.setItem('@cinetanger_movies', JSON.stringify(response.data));
        return response.data;
    } catch (error: any) {
        try {
            const cached = await AsyncStorage.getItem('@cinetanger_movies');
            if (cached) return JSON.parse(cached);
        } catch {}
        throw error;
    }
};

export const getMovieById = async (id: number | string) => {
    try {
        const response = await axios.get(`${API_URL}/movies/${id}`);
        const movie = response.data.data;
        await AsyncStorage.setItem(`@cinetanger_movie_${id}`, JSON.stringify(movie));
        return movie;
    } catch (err) {
        try {
            const cached = await AsyncStorage.getItem(`@cinetanger_movie_${id}`);
            if (cached) return JSON.parse(cached);
            const list = await AsyncStorage.getItem('@cinetanger_movies');
            if (list) {
                const parsed = JSON.parse(list);
                const found = Array.isArray(parsed?.data)
                    ? parsed.data.find((m: any) => String(m.id) === String(id))
                    : Array.isArray(parsed)
                    ? parsed.find((m: any) => String(m.id) === String(id))
                    : null;
                if (found) return found;
            }
        } catch {}
        throw err;
    }
};
export const cancelReservation = async (confirmationCode: string) => {
    const response = await axios.delete(`${API_URL}/reservations/${confirmationCode}`);
    return response.data;
}
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

export const getUserReservations: () => Promise<any> = async () => {
    try {
        const response = await storageToken.get(`/reservations/my-reservations`);
        return response.data;
    } catch (error: any) {
        console.error("Get user reservations error:", error.response?.data || error.message);
        throw error;
    }
};
