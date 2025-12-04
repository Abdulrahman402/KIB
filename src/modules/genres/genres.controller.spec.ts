import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { GenreResponseDto } from './dto';
import { PaginatedMoviesResponseDto } from '../movies/dto';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenreResponse: GenreResponseDto = {
    id: '507f1f77bcf86cd799439011',
    tmdb_id: 18,
    name: 'Drama',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockPaginatedMoviesResponse: PaginatedMoviesResponseDto = {
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  const mockGenresService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getMoviesByGenre: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all genres', async () => {
      mockGenresService.findAll.mockResolvedValue([mockGenreResponse]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockGenreResponse);
    });

    it('should return empty array when no genres found', async () => {
      mockGenresService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a genre by ID', async () => {
      mockGenresService.findOne.mockResolvedValue(mockGenreResponse);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockGenreResponse);
    });

    it('should handle different genre IDs', async () => {
      mockGenresService.findOne.mockResolvedValue(mockGenreResponse);

      await controller.findOne('507f191e810c19729de860ea');

      expect(service.findOne).toHaveBeenCalledWith('507f191e810c19729de860ea');
    });
  });

  describe('getMoviesByGenre', () => {
    it('should return paginated movies for a genre', async () => {
      mockGenresService.getMoviesByGenre.mockResolvedValue(
        mockPaginatedMoviesResponse,
      );

      const result = await controller.getMoviesByGenre(
        '507f1f77bcf86cd799439011',
        1,
        20,
      );

      expect(service.getMoviesByGenre).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        1,
        20,
      );
      expect(result).toEqual(mockPaginatedMoviesResponse);
    });

    it('should use default pagination parameters', async () => {
      mockGenresService.getMoviesByGenre.mockResolvedValue(
        mockPaginatedMoviesResponse,
      );

      await controller.getMoviesByGenre('507f1f77bcf86cd799439011');

      expect(service.getMoviesByGenre).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        1,
        20,
      );
    });

    it('should handle custom pagination', async () => {
      mockGenresService.getMoviesByGenre.mockResolvedValue(
        mockPaginatedMoviesResponse,
      );

      await controller.getMoviesByGenre('507f1f77bcf86cd799439011', 3, 50);

      expect(service.getMoviesByGenre).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        3,
        50,
      );
    });
  });
});
