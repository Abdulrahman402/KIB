import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresRepository } from './genres.repository';
import { MoviesRepository } from '../movies/movies.repository';

describe('GenresService', () => {
  let service: GenresService;
  let genresRepository: GenresRepository;
  let moviesRepository: MoviesRepository;

  const mockGenre = {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    tmdb_id: 18,
    name: 'Drama',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockMovie = {
    _id: '507f1f77bcf86cd799439012',
    id: '507f1f77bcf86cd799439012',
    tmdb_id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac...',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: new Date('1999-10-15'),
    runtime: 139,
    popularity: 85.5,
    vote_average: 8.4,
    vote_count: 25000,
    average_rating: 8.5,
    ratings_count: 100,
    original_language: 'en',
    adult: false,
    genres: [mockGenre],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockGenresRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByTmdbId: jest.fn(),
    bulkUpsert: jest.fn(),
    count: jest.fn(),
  };

  const mockMoviesRepository = {
    findByGenre: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: GenresRepository,
          useValue: mockGenresRepository,
        },
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    genresRepository = module.get<GenresRepository>(GenresRepository);
    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all genres', async () => {
      mockGenresRepository.findAll.mockResolvedValue([mockGenre]);

      const result = await service.findAll();

      expect(genresRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('507f1f77bcf86cd799439011');
      expect(result[0].name).toBe('Drama');
    });

    it('should return empty array when no genres found', async () => {
      mockGenresRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a genre by ID', async () => {
      mockGenresRepository.findById.mockResolvedValue(mockGenre);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(genresRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.name).toBe('Drama');
    });

    it('should throw NotFoundException if genre not found', async () => {
      mockGenresRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        'Genre with ID nonexistent not found',
      );
    });
  });

  describe('getMoviesByGenre', () => {
    it('should return paginated movies for a genre', async () => {
      mockGenresRepository.findById.mockResolvedValue(mockGenre);
      mockMoviesRepository.findByGenre.mockResolvedValue({
        movies: [mockMovie],
        total: 1,
      });

      const result = await service.getMoviesByGenre(
        '507f1f77bcf86cd799439011',
        1,
        20,
      );

      expect(genresRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(moviesRepository.findByGenre).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        1,
        20,
      );
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should throw NotFoundException if genre not found', async () => {
      mockGenresRepository.findById.mockResolvedValue(null);

      await expect(
        service.getMoviesByGenre('nonexistent', 1, 20),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getMoviesByGenre('nonexistent', 1, 20),
      ).rejects.toThrow('Genre with ID nonexistent not found');
    });

    it('should handle empty movie results', async () => {
      mockGenresRepository.findById.mockResolvedValue(mockGenre);
      mockMoviesRepository.findByGenre.mockResolvedValue({
        movies: [],
        total: 0,
      });

      const result = await service.getMoviesByGenre(
        '507f1f77bcf86cd799439011',
        1,
        20,
      );

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should calculate pagination correctly', async () => {
      mockGenresRepository.findById.mockResolvedValue(mockGenre);
      mockMoviesRepository.findByGenre.mockResolvedValue({
        movies: [mockMovie],
        total: 50,
      });

      const result = await service.getMoviesByGenre(
        '507f1f77bcf86cd799439011',
        2,
        10,
      );

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPrevPage).toBe(true);
    });
  });
});
