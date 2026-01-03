import axios from "axios";
import { API_URL } from "../constant/Url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("@user_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getUserIdFromToken = async (): Promise<number | null> => {
    try {
        const token = await AsyncStorage.getItem("@user_token");
        if (!token) {
            console.warn("No token found");
            return null;
        }

        const decoded: any = jwtDecode(token);
        return decoded.id || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const clearAuthToken = async () => {
    await AsyncStorage.removeItem("@user_token");
};

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
}) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/register`,
            userData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Register error:", error);
        throw error.response?.data || error;
    }
};

export const loginUser = async (userData: {
    email: string;
    password: string;
}) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/login`,
            userData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.data.token) {
            await AsyncStorage.setItem("@user_token", response.data.token);
        }

        console.log("Login successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error(
            "Login error:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

export const getMovie = async () => {
    try {
        const response = await api.get(`/movies`);
        console.log("Movie response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Get movies error:", error);
        throw error.response?.data || error;
    }
};

export const getMovieById = async (id: number | string) => {
    try {
        const response = await api.get(`/movies/${id}`);
        console.log("MovieById response:", response.data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching movie by id:", error);
        throw error.response?.data || error;
    }
};

export const checkSeatAvailability = async (
    showtimeId: number,
    numberOfSeats: number
) => {
    try {
        const response = await api.post(
            `/reservations/check-availability`,
            {
                showtimeId,
                numberOfSeats,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Check seat availability error:", error);
        throw error.response?.data || error;
    }
};
export const createReservation = async (reservationData: {
    showtimeId: number;
    numberOfSeats: number;
}) => {
    try {
        const userId = await getUserIdFromToken();

        if (!userId) {
            throw new Error(
                "User not authenticated. Please login first."
            );
        }

        console.log("Creating reservation with userId:", userId);

        const response = await api.post(`/reservations`, {
            userId,
            ...reservationData,
        });

        console.log("Reservation created:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Create reservation error:", error);
        throw error.response?.data || error;
    }
};

export const getReservationByCode = async (code: string) => {
    try {
        const response = await api.get(`/reservations/${code}`);
        return response.data;
    } catch (error: any) {
        console.error("Get reservation error:", error);
        throw error.response?.data || error;
    }
};

export const cancelReservation = async (code: string) => {
    try {
        const response = await api.post(`/reservations/cancel/${code}`);
        return response.data;
    } catch (error: any) {
        console.error("Cancel reservation error:", error);
        throw error.response?.data || error;
    }
};

export default api;