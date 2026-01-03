import type { Request, Response } from 'express';
import { movie, showtime, theater } from '../models/associations.js';
import Movie from '../models/Movie.js';

export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await movie.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching movies',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const movieData = await movie.findByPk(id, {
      include: [{
        model: showtime,
        as: 'showtimes',
        include: [{
          model: theater,
          as: 'theater'
        }]
      }]
    });

    if (!movieData) {
      res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: movieData
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

export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      duration,
      genre,
      releaseDate,
      posterUrl,  // ← Changed from 'photo' to 'posterUrl'
    } = req.body;

    // Validation is now handled by express-validator middleware
    const newMovie = await Movie.create({
      title,
      photo: posterUrl || '',  // ← Map posterUrl to photo field
      duration,
      releaseDate,
      genre
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: newMovie
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


export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      duration,
      genre,
      releaseDate,
      posterUrl
    } = req.body;

    const movieData = await Movie.findByPk(id);

    if (!movieData) {
      res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found`
      });
      return;
    }

    await movieData.update({
      title: title || movieData.title,
      duration: duration || movieData.duration,
      genre: genre || movieData.genre,
      releaseDate: releaseDate || movieData.releaseDate,
      photo: posterUrl || movieData.photo
    });


    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movieData
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

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const movieData = await movie.findByPk(id);

    if (!movieData) {
      res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found`
      });
      return;
    }

    await movieData.destroy();

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