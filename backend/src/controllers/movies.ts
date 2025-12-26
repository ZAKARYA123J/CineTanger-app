import type { Request, Response } from 'express';
import Movie from '../models/Movie.js';

// Get all movies 
export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.findAll({
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

// Get movie by id 
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const movieData = await Movie.findByPk(id);

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

// Create a new movie
export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      duration,
      genre,
      releaseDate,
      photo,
    } = req.body;

    // Basic validation
    if (!title || !duration || !genre) {
      res.status(400).json({
        success: false,
        message: 'Fields title, duration and genre are required'
      });
      return;
    }

    const newMovie = await Movie.create({
      title,
      photo: photo || '',
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

// Update a movie 
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

    // Update provided fields
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

// Delete a movie
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const movieData = await Movie.findByPk(id);

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