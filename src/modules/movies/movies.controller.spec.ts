import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {
  MovieQueryDto,
  SearchMovieDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
} from './dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMovieResponse: MovieResponseDto = {
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
      { id: 'g1', name: 'Drama', tmdb_id: 18 },
      { id: 'g2', name: 'Thriller', tmdb_id: 53 },
    ],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockPaginatedResponse: PaginatedMoviesResponseDto = {
    data: [mockMovieResponse],
    meta: {
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  const mockMoviesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByTmdbId: jest.fn(),
    search: jest.fn(),
    findByGenre: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated movies', async () => {
      const queryDto: MovieQueryDto = {
        page: 1,
        limit: 20,
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should pass filters to service', async () => {
      const queryDto: MovieQueryDto = {
        page: 1,
        limit: 10,
        genre: 'g1',
        year: 1999,
        minRating: 8,
        sortBy: 'release_date',
        sortOrder: 'asc',
      };

      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('search', () => {
    it('should search movies', async () => {
      const searchDto: SearchMovieDto = {
        query: 'fight',
        page: 1,
        limit: 20,
      };

      mockMoviesService.search.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle different search queries', async () => {
      const searchDto: SearchMovieDto = {
        query: 'inception',
        page: 2,
        limit: 10,
      };

      mockMoviesService.search.mockResolvedValue(mockPaginatedResponse);

      await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockMoviesService.findOne.mockResolvedValue(mockMovieResponse);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockMovieResponse);
      expect(result.id).toBe(id);
    });

    it('should handle different movie IDs', async () => {
      const id = '507f191e810c19729de860ea';

      mockMoviesService.findOne.mockResolvedValue(mockMovieResponse);

      await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
