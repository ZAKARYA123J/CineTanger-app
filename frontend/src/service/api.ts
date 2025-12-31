import axios from "axios"
import { API_URL } from "../constant/Url"

export const getMovie = async () => {
    const movies = await axios.get(`${API_URL}/`)
    return movies.data;
}

export const getMovieById = async (id: number | string) => {
    const movie = await axios.get(`${API_URL}/${id}`)
    return movie.data.data
}