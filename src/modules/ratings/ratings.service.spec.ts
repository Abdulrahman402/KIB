import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsRepository } from './ratings.repository';
import { MoviesRepository } from '../movies/movies.repository';
import { CreateRatingDto, UpdateRatingDto } from './dto';

describe('RatingsService', () => {
  let service: RatingsService;
  let ratingsRepository: RatingsRepository;
  let moviesRepository: MoviesRepository;

  const mockUserId = '507f1f77bcf86cd799439011';
  const mockMovieId = '507f1f77bcf86cd799439012';

  const mockMovie = {
    _id: mockMovieId,
    id: mockMovieId,
    tmdb_id: 550,
    title: 'Fight Club',
    poster_path: '/poster.jpg',
    release_date: new Date('1999-10-15'),
    toString: () => mockMovieId,
  };

  const mockRating = {
    _id: '507f1f77bcf86cd799439013',
    user_id: { toString: () => mockUserId },
    movie_id: { ...mockMovie, toString: () => mockMovieId },
    rating: 8,
    review: 'Great movie!',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockRatingsRepository = {
    create: jest.fn(),
    findByUserAndMovie: jest.fn(),
    findById: jest.fn(),
    findByUser: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    calculateMovieAverage: jest.fn(),
    countByUser: jest.fn(),
  };

  const mockMoviesRepository = {
    findById: jest.fn(),
    updateAverageRating: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: RatingsRepository,
          useValue: mockRatingsRepository,
        },
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    ratingsRepository = module.get<RatingsRepository>(RatingsRepository);
    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createRatingDto: CreateRatingDto = {
      movie_id: mockMovieId,
      rating: 8,
      review: 'Great movie!',
    };

    it('should create a new rating', async () => {
      mockMoviesRepository.findById.mockResolvedValue(mockMovie);
      mockRatingsRepository.findByUserAndMovie.mockResolvedValue(null);
      mockRatingsRepository.create.mockResolvedValue(mockRating);
      mockRatingsRepository.calculateMovieAverage.mockResolvedValue({
        average: 8,
        count: 1,
      });

      const result = await service.create(mockUserId, createRatingDto);

      expect(moviesRepository.findById).toHaveBeenCalledWith(mockMovieId);
      expect(ratingsRepository.findByUserAndMovie).toHaveBeenCalledWith(
        mockUserId,
        mockMovieId,
      );
      expect(ratingsRepository.create).toHaveBeenCalledWith(
        mockUserId,
        mockMovieId,
        8,
        'Great movie!',
      );
      expect(ratingsRepository.calculateMovieAverage).toHaveBeenCalledWith(
        mockMovieId,
      );
      expect(result.rating).toBe(8);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockUserId, createRatingDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(mockUserId, createRatingDto)).rejects.toThrow(
        `Movie with ID ${mockMovieId} not found`,
      );
    });

    it('should throw ConflictException if rating already exists', async () => {
      mockMoviesRepository.findById.mockResolvedValue(mockMovie);
      mockRatingsRepository.findByUserAndMovie.mockResolvedValue(mockRating);

      await expect(service.create(mockUserId, createRatingDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(mockUserId, createRatingDto)).rejects.toThrow(
        'You have already rated this movie',
      );
    });
  });

  describe('getUserRatings', () => {
    it('should return paginated user ratings', async () => {
      mockRatingsRepository.findByUser.mockResolvedValue({
        ratings: [mockRating],
        total: 1,
      });

      const result = await service.getUserRatings(mockUserId, 1, 20);

      expect(ratingsRepository.findByUser).toHaveBeenCalledWith(
        mockUserId,
        1,
        20,
      );
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should handle empty results', async () => {
      mockRatingsRepository.findByUser.mockResolvedValue({
        ratings: [],
        total: 0,
      });

      const result = await service.getUserRatings(mockUserId, 1, 20);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a rating by ID', async () => {
      mockRatingsRepository.findById.mockResolvedValue(mockRating);

      const result = await service.findOne(
        '507f1f77bcf86cd799439013',
        mockUserId,
      );

      expect(ratingsRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
      );
      expect(result.id).toBe('507f1f77bcf86cd799439013');
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRatingsRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user does not own rating', async () => {
      const otherUserRating = {
        ...mockRating,
        user_id: { toString: () => 'otherUserId' },
      };
      mockRatingsRepository.findById.mockResolvedValue(otherUserRating);

      await expect(
        service.findOne('507f1f77bcf86cd799439013', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateRatingDto: UpdateRatingDto = {
      rating: 9,
      review: 'Updated review',
    };

    it('should update a rating', async () => {
      const updatedRating = {
        ...mockRating,
        rating: 9,
        review: 'Updated review',
      };
      mockRatingsRepository.findById.mockResolvedValue(mockRating);
      mockRatingsRepository.update.mockResolvedValue(updatedRating);
      mockRatingsRepository.calculateMovieAverage.mockResolvedValue({
        average: 9,
        count: 1,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439013',
        mockUserId,
        updateRatingDto,
      );

      expect(ratingsRepository.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        9,
        'Updated review',
      );
      expect(result.rating).toBe(9);
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRatingsRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', mockUserId, updateRatingDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user does not own rating', async () => {
      const otherUserRating = {
        ...mockRating,
        user_id: { toString: () => 'otherUserId' },
      };
      mockRatingsRepository.findById.mockResolvedValue(otherUserRating);

      await expect(
        service.update('507f1f77bcf86cd799439013', mockUserId, updateRatingDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a rating', async () => {
      mockRatingsRepository.findById.mockResolvedValue(mockRating);
      mockRatingsRepository.delete.mockResolvedValue(mockRating);
      mockRatingsRepository.calculateMovieAverage.mockResolvedValue({
        average: 0,
        count: 0,
      });

      await service.remove('507f1f77bcf86cd799439013', mockUserId);

      expect(ratingsRepository.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
      );
      expect(ratingsRepository.calculateMovieAverage).toHaveBeenCalledWith(
        mockMovieId,
      );
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRatingsRepository.findById.mockResolvedValue(null);

      await expect(service.remove('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
