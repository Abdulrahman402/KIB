import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import {
  CreateRatingDto,
  UpdateRatingDto,
  RatingResponseDto,
  PaginatedRatingsResponseDto,
} from './dto';

describe('RatingsController', () => {
  let controller: RatingsController;
  let service: RatingsService;

  const mockUserId = '507f1f77bcf86cd799439011';
  const mockRequest = { user: { userId: mockUserId } };

  const mockRatingResponse: RatingResponseDto = {
    id: '507f1f77bcf86cd799439013',
    user_id: mockUserId,
    movie: {
      id: '507f1f77bcf86cd799439012',
      title: 'Fight Club',
      poster_path: '/poster.jpg',
      tmdb_id: 550,
      release_date: new Date('1999-10-15'),
    },
    rating: 8,
    review: 'Great movie!',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockPaginatedResponse: PaginatedRatingsResponseDto = {
    data: [mockRatingResponse],
    meta: {
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  const mockRatingsService = {
    create: jest.fn(),
    getUserRatings: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        {
          provide: RatingsService,
          useValue: mockRatingsService,
        },
      ],
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createRatingDto: CreateRatingDto = {
      movie_id: '507f1f77bcf86cd799439012',
      rating: 8,
      review: 'Great movie!',
    };

    it('should create a new rating', async () => {
      mockRatingsService.create.mockResolvedValue(mockRatingResponse);

      const result = await controller.create(mockRequest, createRatingDto);

      expect(service.create).toHaveBeenCalledWith(mockUserId, createRatingDto);
      expect(result).toEqual(mockRatingResponse);
    });
  });

  describe('getUserRatings', () => {
    it('should return paginated user ratings', async () => {
      mockRatingsService.getUserRatings.mockResolvedValue(
        mockPaginatedResponse,
      );

      const result = await controller.getUserRatings(mockRequest, 1, 20);

      expect(service.getUserRatings).toHaveBeenCalledWith(mockUserId, 1, 20);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should use default pagination parameters', async () => {
      mockRatingsService.getUserRatings.mockResolvedValue(
        mockPaginatedResponse,
      );

      await controller.getUserRatings(mockRequest);

      expect(service.getUserRatings).toHaveBeenCalledWith(mockUserId, 1, 20);
    });
  });

  describe('findOne', () => {
    it('should return a rating by ID', async () => {
      mockRatingsService.findOne.mockResolvedValue(mockRatingResponse);

      const result = await controller.findOne(
        mockRequest,
        '507f1f77bcf86cd799439013',
      );

      expect(service.findOne).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        mockUserId,
      );
      expect(result).toEqual(mockRatingResponse);
    });
  });

  describe('update', () => {
    const updateRatingDto: UpdateRatingDto = {
      rating: 9,
      review: 'Updated review',
    };

    it('should update a rating', async () => {
      const updatedResponse = { ...mockRatingResponse, rating: 9 };
      mockRatingsService.update.mockResolvedValue(updatedResponse);

      const result = await controller.update(
        mockRequest,
        '507f1f77bcf86cd799439013',
        updateRatingDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        mockUserId,
        updateRatingDto,
      );
      expect(result.rating).toBe(9);
    });
  });

  describe('remove', () => {
    it('should delete a rating', async () => {
      mockRatingsService.remove.mockResolvedValue(undefined);

      await controller.remove(mockRequest, '507f1f77bcf86cd799439013');

      expect(service.remove).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        mockUserId,
      );
    });
  });
});
