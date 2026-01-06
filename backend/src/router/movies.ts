import express from "express";
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} from "../controllers/movies.js";
import {
    validateCreateMovie,
    validateMovieId,
    validateUpdateMovie,
} from "../validation/movieValidation.js";

const router = express.Router();

// Public routes
router.get("/", getAllMovies);
router.get("/:id", validateMovieId, getMovieById);

// Protected routes
router.post("/", validateCreateMovie, createMovie);
router.patch("/:id", validateMovieId, validateUpdateMovie, updateMovie);
router.delete("/:id", validateMovieId, deleteMovie);

export default router;