import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import {
  AddToWatchlistDto,
  UpdateWatchlistDto,
  WatchlistResponseDto,
  PaginatedWatchlistResponseDto,
} from './dto';

describe('WatchlistController', () => {
  let controller: WatchlistController;
  let service: WatchlistService;

  const mockUserId = '507f1f77bcf86cd799439011';
  const mockRequest = { user: { userId: mockUserId } };

  const mockWatchlistResponse: WatchlistResponseDto = {
    id: '507f1f77bcf86cd799439013',
    user_id: mockUserId,
    movie: {
      id: '507f1f77bcf86cd799439012',
      title: 'Fight Club',
      poster_path: '/poster.jpg',
      tmdb_id: 550,
      release_date: new Date('1999-10-15'),
    },
    is_favorite: false,
    added_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockPaginatedResponse: PaginatedWatchlistResponseDto = {
    data: [mockWatchlistResponse],
    meta: {
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  const mockWatchlistService = {
    addToWatchlist: jest.fn(),
    getUserWatchlist: jest.fn(),
    findOne: jest.fn(),
    updateFavorite: jest.fn(),
    removeFromWatchlist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
    service = module.get<WatchlistService>(WatchlistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWatchlist', () => {
    const addToWatchlistDto: AddToWatchlistDto = {
      movie_id: '507f1f77bcf86cd799439012',
      is_favorite: false,
    };

    it('should add movie to watchlist', async () => {
      mockWatchlistService.addToWatchlist.mockResolvedValue(
        mockWatchlistResponse,
      );

      const result = await controller.addToWatchlist(
        mockRequest,
        addToWatchlistDto,
      );

      expect(service.addToWatchlist).toHaveBeenCalledWith(
        mockUserId,
        addToWatchlistDto,
      );
      expect(result).toEqual(mockWatchlistResponse);
    });
  });

  describe('getUserWatchlist', () => {
    it('should return paginated watchlist', async () => {
      mockWatchlistService.getUserWatchlist.mockResolvedValue(
        mockPaginatedResponse,
      );

      const result = await controller.getUserWatchlist(mockRequest, 1, 20);

      expect(service.getUserWatchlist).toHaveBeenCalledWith(
        mockUserId,
        1,
        20,
        undefined,
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should filter by favorites', async () => {
      mockWatchlistService.getUserWatchlist.mockResolvedValue(
        mockPaginatedResponse,
      );

      await controller.getUserWatchlist(mockRequest, 1, 20, true);

      expect(service.getUserWatchlist).toHaveBeenCalledWith(
        mockUserId,
        1,
        20,
        true,
      );
    });

    it('should use default pagination parameters', async () => {
      mockWatchlistService.getUserWatchlist.mockResolvedValue(
        mockPaginatedResponse,
      );

      await controller.getUserWatchlist(mockRequest);

      expect(service.getUserWatchlist).toHaveBeenCalledWith(
        mockUserId,
        1,
        20,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should return watchlist item by ID', async () => {
      mockWatchlistService.findOne.mockResolvedValue(mockWatchlistResponse);

      const result = await controller.findOne(
        mockRequest,
        '507f1f77bcf86cd799439013',
      );

      expect(service.findOne).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        mockUserId,
      );
      expect(result).toEqual(mockWatchlistResponse);
    });
  });

  describe('updateFavorite', () => {
    const updateDto: UpdateWatchlistDto = {
      is_favorite: true,
    };

    it('should update favorite status', async () => {
      const updatedResponse = { ...mockWatchlistResponse, is_favorite: true };
      mockWatchlistService.updateFavorite.mockResolvedValue(updatedResponse);

      const result = await controller.updateFavorite(
        mockRequest,
        '507f1f77bcf86cd799439013',
        updateDto,
      );

      expect(service.updateFavorite).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        mockUserId,
        updateDto,
      );
      expect(result.is_favorite).toBe(true);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove item from watchlist', async () => {
      mockWatchlistService.removeFromWatchlist.mockResolvedValue(undefined);

      await controller.removeFromWatchlist(
        mockRequest,
        '507f1f77bcf86cd799439013',
      );

      expect(service.removeFromWatchlist).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        mockUserId,
      );
    });
  });
});
