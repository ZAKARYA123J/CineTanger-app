import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movies.js';
import {
  validateCreateMovie,
  validateUpdateMovie,
  validateMovieId
} from '../validation/movieValidation.js';
const router : any =  express.Router();

//Public routes  View movies
router.get('/', getAllMovies);
router.get('/:id', validateMovieId,  getMovieById);

//Protected routes - Manage movies (Admin only)

router.post('/',  createMovie);
router.put('/:id',validateUpdateMovie , updateMovie);
router.delete('/:id', validateMovieId, deleteMovie);

export default router;