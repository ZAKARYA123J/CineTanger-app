import axios from "axios"
import { API_URL } from "../constant/Url"

export const getMovie = async () => {
    const movies = await axios.get(`${API_URL}/`)
    console.log("hada rah", movies)
    return movies.data;
}