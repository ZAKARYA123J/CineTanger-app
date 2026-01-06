import type { Request, Response } from 'express';
import Movie from '../models/Movie.js';
import { AppError, asyncHandler } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

// Get all movies
export const getAllMovies = asyncHandler(async (req: Request, res: Response) => {
    logger.info('Fetching all movies');
    
    const movies = await Movie.findAll();
    
    logger.info(`Found ${movies.length} movies`);
    
    res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
    });
});

// Get movie by ID
export const getMovieById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    logger.info(`Fetching movie with ID: ${id}`);
    
    const movieData = await Movie.findByPk(id);
    
    if (!movieData) {
        logger.warn(`Movie not found with ID: ${id}`);
        throw new AppError('Movie not found', 404);
    }
    
    logger.info(`Movie found: ${movieData.get('title')}`);
    
    res.status(200).json({
        success: true,
        data: movieData
    });
});

// Create movie
export const createMovie = asyncHandler(async (req: Request, res: Response) => {
    const { title, duration, genre, releaseDate, posterUrl } = req.body;
    
    logger.info('Creating new movie', { title, genre });
    
    const movieData = await Movie.create({
        title,
        duration,
        genre,
        releaseDate,
        photo: posterUrl
    });
    
    logger.info(`Movie created successfully with ID: ${movieData.get('id')}`);
    
    res.status(201).json({
        success: true,
        message: 'Movie created successfully',
        data: movieData
    });
});

// Update movie
export const updateMovie = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    logger.info(`Updating movie with ID: ${id}`, updateData);
    
    const movieData = await Movie.findByPk(id);
    
    if (!movieData) {
        logger.warn(`Movie not found for update with ID: ${id}`);
        throw new AppError('Movie not found', 404);
    }
    
    await movieData.update(updateData);
    
    logger.info(`Movie updated successfully: ${id}`);
    
    res.status(200).json({
        success: true,
        message: 'Movie updated successfully',
        data: movieData
    });
});

// Delete movie
export const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    logger.info(`Deleting movie with ID: ${id}`);
    
    const movieData = await Movie.findByPk(id);
    
    if (!movieData) {
        logger.warn(`Movie not found for deletion with ID: ${id}`);
        throw new AppError('Movie not found', 404);
    }
    
    await movieData.destroy();
    
    logger.info(`Movie deleted successfully: ${id}`);
    
    res.status(200).json({
        success: true,
        message: 'Movie deleted successfully',
        data: {}
    });
});