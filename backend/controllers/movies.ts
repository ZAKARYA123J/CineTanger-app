import type { Request, Response} from 'express';
import { Movies} from '../models/Movie.js';

//get all movies 
export const getAllMovies = async (req: Request, res: Response): Promise <void>=>{
  try{
    const movies = await Movies.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  }catch (error){
    console.error('Error fetching movies:', error);
    res.status(500).json({
     success: false,
     message: 'Server error while fetching movies',
     error: error instanceof Error? error.message: 'Unknown error'
    });
  }
};
 //get movie by id 
  export const getMovieById = async (req : Request, res: Response) : Promise<void>=>{
    try {
    const { id } = req.params;

    const movie = await Movies.findByPk(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found`
      });
      return;
    }
     res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching movie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  };
  //create a new movie
   export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      synopsis,
      duration,
      genre,
      director,
      releaseDate,
      posterUrl,
      trailerUrl,
      rating,
      language
    } = req.body;
    // Basic validation
    if (!title || !synopsis || !duration || !genre) {
      res.status(400).json({
        success: false,
        message: 'Fields title, synopsis, duration and genre are required'
      });
      return;
    }
    const movie = await Movies.create({
      title,
      synopsis,
      duration,
      genre,
      director,
      releaseDate,
      posterUrl,
      trailerUrl,
      rating,
      language
    });
      res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    console.error('Error creating movie:', error);
      res.status(500).json({
      success: false,
      message: 'Server error while creating movie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
//update a movie 
 export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      synopsis,
      duration,
      genre,
      director,
      releaseDate,
      posterUrl,
      trailerUrl,
      rating,
      language
    } = req.body;
     const movie = await Movies.findByPk(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found`
      });
      return;
    }
    // Update provided fields
    await movie.update({
      title: title || movie.title,
      synopsis: synopsis || movie.synopsis,
      duration: duration || movie.duration,
      genre: genre || movie.genre,
      director: director || movie.director,
      releaseDate: releaseDate || movie.releaseDate,
      posterUrl: posterUrl || movie.posterUrl,
      trailerUrl: trailerUrl || movie.trailerUrl,
      rating: rating !== undefined ? rating : movie.rating,
      language: language || movie.language
    });
    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Error updating movie:', error);
       res.status(500).json({
      success: false,
      message: 'Server error while updating movie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
//delete a movie
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const movie = await Movies.findByPk(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found`
      });
      return;
    }

    await movie.destroy();

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting movie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

