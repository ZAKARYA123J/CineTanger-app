import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movies.js';

const router : any=  express.Router();

//Public routes  View movies
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

//Protected routes - Manage movies (Admin only)

router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;