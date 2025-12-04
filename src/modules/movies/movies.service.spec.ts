import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { MovieQueryDto, SearchMovieDto } from './dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: MoviesRepository;

  const mockMovie = {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    tmdb_id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman...',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
    release_date: new Date('1999-10-15'),
    runtime: 139,
    popularity: 85.5,
    vote_average: 8.4,
    vote_count: 25000,
    average_rating: 8.5,
    ratings_count: 100,
    original_language: 'en',
    adult: false,
    genres: [
      { _id: 'g1', id: 'g1', name: 'Drama', tmdb_id: 18 },
      { _id: 'g2', id: 'g2', name: 'Thriller', tmdb_id: 53 },
    ],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByTmdbId: jest.fn(),
    search: jest.fn(),
    findByGenre: jest.fn(),
    count: jest.fn(),
    bulkUpsert: jest.fn(),
    updateAverageRating: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MoviesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<MoviesRepository>(MoviesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated movies with default parameters', async () => {
      const queryDto: MovieQueryDto = {
        page: 1,
        limit: 20,
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      mockRepository.findAll.mockResolvedValue({
        movies: [mockMovie],
        total: 1,
      });

      const result = await service.findAll(queryDto);

      expect(repository.findAll).toHaveBeenCalledWith(
        1,
        20,
        {},
        'popularity',
        'desc',
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Fight Club');
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPrevPage).toBe(false);
    });

    it('should apply filters correctly', async () => {
      const queryDto: MovieQueryDto = {
        page: 1,
        limit: 20,
        genre: 'g1',
        year: 1999,
        minRating: 8,
        sortBy: 'release_date',
        sortOrder: 'asc',
      };

      mockRepository.findAll.mockResolvedValue({
        movies: [mockMovie],
        total: 1,
      });

      await service.findAll(queryDto);

      expect(repository.findAll).toHaveBeenCalledWith(
        1,
        20,
        { genre: 'g1', year: 1999, minRating: 8 },
        'release_date',
        'asc',
      );
    });

    it('should handle pagination with multiple pages', async () => {
      const queryDto: MovieQueryDto = {
        page: 2,
        limit: 10,
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      mockRepository.findAll.mockResolvedValue({
        movies: [mockMovie],
        total: 25,
      });

      const result = await service.findAll(queryDto);

      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPrevPage).toBe(true);
    });

    it('should return empty array when no movies found', async () => {
      const queryDto: MovieQueryDto = {
        page: 1,
        limit: 20,
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      mockRepository.findAll.mockResolvedValue({
        movies: [],
        total: 0,
      });

      const result = await service.findAll(queryDto);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      mockRepository.findById.mockResolvedValue(mockMovie);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(repository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.title).toBe('Fight Club');
      expect(result.genres).toHaveLength(2);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        'Movie with ID nonexistent not found',
      );
    });

    it('should map genres correctly', async () => {
      mockRepository.findById.mockResolvedValue(mockMovie);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result.genres).toEqual([
        { id: 'g1', name: 'Drama', tmdb_id: 18 },
        { id: 'g2', name: 'Thriller', tmdb_id: 53 },
      ]);
    });
  });

  describe('findByTmdbId', () => {
    it('should return a movie by TMDB ID', async () => {
      mockRepository.findByTmdbId.mockResolvedValue(mockMovie);

      const result = await service.findByTmdbId(550);

      expect(repository.findByTmdbId).toHaveBeenCalledWith(550);
      expect(result.tmdb_id).toBe(550);
      expect(result.title).toBe('Fight Club');
    });

    it('should throw NotFoundException if movie not found by TMDB ID', async () => {
      mockRepository.findByTmdbId.mockResolvedValue(null);

      await expect(service.findByTmdbId(999999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByTmdbId(999999)).rejects.toThrow(
        'Movie with TMDB ID 999999 not found',
      );
    });
  });

  describe('search', () => {
    it('should search movies by query', async () => {
      const searchDto: SearchMovieDto = {
        query: 'fight',
        page: 1,
        limit: 20,
      };

      mockRepository.search.mockResolvedValue({
        movies: [mockMovie],
        total: 1,
      });

      const result = await service.search(searchDto);

      expect(repository.search).toHaveBeenCalledWith('fight', 1, 20);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Fight Club');
    });

    it('should handle empty search results', async () => {
      const searchDto: SearchMovieDto = {
        query: 'nonexistent',
        page: 1,
        limit: 20,
      };

      mockRepository.search.mockResolvedValue({
        movies: [],
        total: 0,
      });

      const result = await service.search(searchDto);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should handle pagination in search', async () => {
      const searchDto: SearchMovieDto = {
        query: 'fight',
        page: 2,
        limit: 10,
      };

      mockRepository.search.mockResolvedValue({
        movies: [mockMovie],
        total: 15,
      });

      const result = await service.search(searchDto);

      expect(result.meta.page).toBe(2);
      expect(result.meta.totalPages).toBe(2);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPrevPage).toBe(true);
    });
  });

  describe('findByGenre', () => {
    it('should return movies filtered by genre', async () => {
      mockRepository.findByGenre.mockResolvedValue({
        movies: [mockMovie],
        total: 1,
      });

      const result = await service.findByGenre('g1', 1, 20);

      expect(repository.findByGenre).toHaveBeenCalledWith('g1', 1, 20);
      expect(result.data).toHaveLength(1);
    });

    it('should use default pagination parameters', async () => {
      mockRepository.findByGenre.mockResolvedValue({
        movies: [mockMovie],
        total: 1,
      });

      await service.findByGenre('g1');

      expect(repository.findByGenre).toHaveBeenCalledWith('g1', 1, 20);
    });

    it('should handle empty results for genre', async () => {
      mockRepository.findByGenre.mockResolvedValue({
        movies: [],
        total: 0,
      });

      const result = await service.findByGenre('g999');

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });
});
