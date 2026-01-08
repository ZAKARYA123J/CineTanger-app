import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movies.js';
import Movie from '../models/Movie.js';
import { nextTick } from 'node:process';

jest.mock('../models/Movie');

describe('Movie Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
      jest.clearAllMocks();
consoleErrorSpy=jest.spyOn(console,'error').mockImplementation(()=>{})

    // Setup mock response
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    mockResponse = {
      status: statusMock as never,
      json: jsonMock as never
    };

    mockRequest = {
      params: {},
      body: {}
    };
  });

  describe('getAllMovies', () => {
    it('should return all movies successfully', async () => {
      const mockMovies = [
        {
          id: 1,  
          title: "Inception",
  photo: "https://example.com/images/inception.jpg",
  duration: 148,
  releaseDate: 2010,
  genre: "Science Fiction"

        },
        {
          id: 2,
          title: 'Test Movie 2',
          duration: 90,
          genre: 'Comedy',
          releaseDate: '2024-02-01',
          photo: 'url2.jpg'
        }
      ];

      (Movie.findAll as jest.Mock) = jest.fn().mockResolvedValue(mockMovies as never);

      await getAllMovies(mockRequest as Request, mockResponse as Response);

      expect(Movie.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']]
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockMovies
      });
    });

    it('should handle errors when fetching movies', async () => {
      const errorMessage = 'Database error';
      (Movie.findAll as jest.Mock) = jest.fn().mockRejectedValue(new Error(errorMessage) as never);

      await getAllMovies(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while fetching movies',
        error: errorMessage
      });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id successfully', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        duration: 120,
        genre: 'Action',
        releaseDate: '2024-01-01',
        photo: 'url.jpg'
      };

      mockRequest.params = { id: '1' };
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockMovie as never);
     
      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(Movie.findByPk).toHaveBeenCalledWith('1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockMovie
      });
    });

    it('should return 404 when movie is not found', async () => {
      mockRequest.params = { id: '999' };
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null as never);

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Movie with ID 999 not found'
      });
    });

    it('should handle errors when fetching movie by id', async () => {
      mockRequest.params = { id: '1' };
      const errorMessage = 'Database error';
      (Movie.findByPk as jest.Mock) = jest.fn().mockRejectedValue(new Error(errorMessage) as never);

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while fetching movie',
        error: errorMessage
      });
    });
  });

  describe('createMovie', () => {
    it('should create a new movie successfully', async () => {
      const movieData = {
        title: 'New Movie',
        duration: 120,
        genre: 'Action',
        releaseDate: '2024-01-01',
        posterUrl: 'url.jpg'
      };

      const createdMovie = {
        id: 1,
        title: movieData.title,
        duration: movieData.duration,
        genre: movieData.genre,
        releaseDate: movieData.releaseDate,
        photo: movieData.posterUrl
      };

      mockRequest.body = movieData;
      (Movie.create as jest.Mock) = jest.fn().mockResolvedValue(createdMovie as never);

      await createMovie(mockRequest as Request, mockResponse as Response);

      expect(Movie.create).toHaveBeenCalledWith({
        title: movieData.title,
        photo: movieData.posterUrl,
        duration: movieData.duration,
        releaseDate: movieData.releaseDate,
        genre: movieData.genre
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Movie created successfully',
        data: createdMovie
      });
    });

    it('should create movie with empty photo when posterUrl is not provided', async () => {
      const movieData = {
        title: 'New Movie',
        duration: 120,
        genre: 'Action',
        releaseDate: '2024-01-01'
      };

      const createdMovie = {
        id: 1,
        ...movieData,
        photo: ''
      };

      mockRequest.body = movieData;
      (Movie.create as jest.Mock) = jest.fn().mockResolvedValue(createdMovie as never);

      await createMovie(mockRequest as Request, mockResponse as Response);

      expect(Movie.create).toHaveBeenCalledWith({
        title: movieData.title,
        photo: '',
        duration: movieData.duration,
        releaseDate: movieData.releaseDate,
        genre: movieData.genre
      });
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should handle errors when creating movie', async () => {
      mockRequest.body = {
        title: 'New Movie',
        duration: 120,
        genre: 'Action',
        releaseDate: '2024-01-01'
      };

      const errorMessage = 'Database error';
      (Movie.create as jest.Mock) = jest.fn().mockRejectedValue(new Error(errorMessage) as never);

      await createMovie(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while creating movie',
        error: errorMessage
      });
    });
  });

  describe('updateMovie', () => {
    it('should update a movie successfully', async () => {
      const existingMovie = {
        id: 1,
        title: 'Old Title',
        duration: 100,
        genre: 'Drama',
        releaseDate: '2023-01-01',
        photo: 'old.jpg',
        update: jest.fn().mockResolvedValue(true as never)
      };

      const updateData = {
        title: 'New Title',
        duration: 120,
        genre: 'Action',
        releaseDate: '2024-01-01',
        posterUrl: 'new.jpg'
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(existingMovie as never);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(Movie.findByPk).toHaveBeenCalledWith('1');
      expect(existingMovie.update).toHaveBeenCalledWith({
        title: updateData.title,
        duration: updateData.duration,
        genre: updateData.genre,
        releaseDate: updateData.releaseDate,
        photo: updateData.posterUrl
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Movie updated successfully',
        data: existingMovie
      });
    });

    it('should update only provided fields', async () => {
      const existingMovie = {
        id: 1,
        title: 'Old Title',
        duration: 100,
        genre: 'Drama',
        releaseDate: '2023-01-01',
        photo: 'old.jpg',
        update: jest.fn().mockResolvedValue(true as never)
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'New Title' };
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(existingMovie as never);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(existingMovie.update).toHaveBeenCalledWith({
        title: 'New Title',
        duration: existingMovie.duration,
        genre: existingMovie.genre,
        releaseDate: existingMovie.releaseDate,
        photo: existingMovie.photo
      });
    });

    it('should return 404 when movie to update is not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'New Title' };
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null as never);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Movie with ID 999 not found'
      });
    });

    it('should handle errors when updating movie', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'New Title' };
      const errorMessage = 'Database error';
      (Movie.findByPk as jest.Mock) = jest.fn().mockRejectedValue(new Error(errorMessage) as never);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while updating movie',
        error: errorMessage
      });
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        destroy: jest.fn().mockResolvedValue(true as never)
      };

      mockRequest.params = { id: '1' };
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockMovie as never);

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(Movie.findByPk).toHaveBeenCalledWith('1');
      expect(mockMovie.destroy).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Movie deleted successfully',
        data: {}
      });
    });

    it('should return 404 when movie to delete is not found', async () => {
      mockRequest.params = { id: '999' };
      (Movie.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null as never);

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Movie with ID 999 not found'
      });
    });

    it('should handle errors when deleting movie', async () => {
      mockRequest.params = { id: '1' };
      const errorMessage = 'Database error';
      (Movie.findByPk as jest.Mock) = jest.fn().mockRejectedValue(new Error(errorMessage) as never);

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while deleting movie',
        error: errorMessage
      });
    });
  });
});