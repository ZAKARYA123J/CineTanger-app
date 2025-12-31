import axios from "axios"
import { API_URL } from "../constant/Url"

export const getMovie = async () => {
    const movies = await axios.get(`${API_URL}/`)
    return movies.data;
}

export const getMovieById = async (id: number | string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        console.log("MovieById response:", response.data);
        return response.data.data;
    } catch (err) {
        console.error("Error fetching movie by id:", err);
        throw err;
    }
};