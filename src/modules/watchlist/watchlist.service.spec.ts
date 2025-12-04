import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistRepository } from './watchlist.repository';
import { MoviesRepository } from '../movies/movies.repository';
import { AddToWatchlistDto, UpdateWatchlistDto } from './dto';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let watchlistRepository: WatchlistRepository;
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
  };

  const mockWatchlistItem = {
    _id: '507f1f77bcf86cd799439013',
    user_id: { toString: () => mockUserId },
    movie_id: { ...mockMovie, toString: () => mockMovieId },
    is_favorite: false,
    added_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockWatchlistRepository = {
    create: jest.fn(),
    findByUserAndMovie: jest.fn(),
    findById: jest.fn(),
    findByUser: jest.fn(),
    updateFavorite: jest.fn(),
    toggleFavorite: jest.fn(),
    delete: jest.fn(),
    countByUser: jest.fn(),
  };

  const mockMoviesRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: WatchlistRepository,
          useValue: mockWatchlistRepository,
        },
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    watchlistRepository = module.get<WatchlistRepository>(WatchlistRepository);
    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWatchlist', () => {
    const addToWatchlistDto: AddToWatchlistDto = {
      movie_id: mockMovieId,
      is_favorite: false,
    };

    it('should add movie to watchlist', async () => {
      mockMoviesRepository.findById.mockResolvedValue(mockMovie);
      mockWatchlistRepository.findByUserAndMovie.mockResolvedValue(null);
      mockWatchlistRepository.create.mockResolvedValue(mockWatchlistItem);

      const result = await service.addToWatchlist(
        mockUserId,
        addToWatchlistDto,
      );

      expect(moviesRepository.findById).toHaveBeenCalledWith(mockMovieId);
      expect(watchlistRepository.findByUserAndMovie).toHaveBeenCalledWith(
        mockUserId,
        mockMovieId,
      );
      expect(watchlistRepository.create).toHaveBeenCalledWith(
        mockUserId,
        mockMovieId,
        false,
      );
      expect(result.id).toBe('507f1f77bcf86cd799439013');
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesRepository.findById.mockResolvedValue(null);

      await expect(
        service.addToWatchlist(mockUserId, addToWatchlistDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.addToWatchlist(mockUserId, addToWatchlistDto),
      ).rejects.toThrow(`Movie with ID ${mockMovieId} not found`);
    });

    it('should throw ConflictException if movie already in watchlist', async () => {
      mockMoviesRepository.findById.mockResolvedValue(mockMovie);
      mockWatchlistRepository.findByUserAndMovie.mockResolvedValue(
        mockWatchlistItem,
      );

      await expect(
        service.addToWatchlist(mockUserId, addToWatchlistDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.addToWatchlist(mockUserId, addToWatchlistDto),
      ).rejects.toThrow('Movie already in your watchlist');
    });
  });

  describe('getUserWatchlist', () => {
    it('should return paginated watchlist', async () => {
      mockWatchlistRepository.findByUser.mockResolvedValue({
        watchlist: [mockWatchlistItem],
        total: 1,
      });

      const result = await service.getUserWatchlist(mockUserId, 1, 20);

      expect(watchlistRepository.findByUser).toHaveBeenCalledWith(
        mockUserId,
        1,
        20,
        undefined,
      );
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by favorites', async () => {
      mockWatchlistRepository.findByUser.mockResolvedValue({
        watchlist: [mockWatchlistItem],
        total: 1,
      });

      await service.getUserWatchlist(mockUserId, 1, 20, true);

      expect(watchlistRepository.findByUser).toHaveBeenCalledWith(
        mockUserId,
        1,
        20,
        true,
      );
    });

    it('should handle empty results', async () => {
      mockWatchlistRepository.findByUser.mockResolvedValue({
        watchlist: [],
        total: 0,
      });

      const result = await service.getUserWatchlist(mockUserId, 1, 20);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return watchlist item by ID', async () => {
      mockWatchlistRepository.findById.mockResolvedValue(mockWatchlistItem);

      const result = await service.findOne(
        '507f1f77bcf86cd799439013',
        mockUserId,
      );

      expect(watchlistRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
      );
      expect(result.id).toBe('507f1f77bcf86cd799439013');
    });

    it('should throw NotFoundException if item not found', async () => {
      mockWatchlistRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user does not own item', async () => {
      const otherUserItem = {
        ...mockWatchlistItem,
        user_id: { toString: () => 'otherUserId' },
      };
      mockWatchlistRepository.findById.mockResolvedValue(otherUserItem);

      await expect(
        service.findOne('507f1f77bcf86cd799439013', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFavorite', () => {
    const updateDto: UpdateWatchlistDto = {
      is_favorite: true,
    };

    it('should update favorite status', async () => {
      const updatedItem = { ...mockWatchlistItem, is_favorite: true };
      mockWatchlistRepository.findById.mockResolvedValue(mockWatchlistItem);
      mockWatchlistRepository.updateFavorite.mockResolvedValue(updatedItem);

      const result = await service.updateFavorite(
        '507f1f77bcf86cd799439013',
        mockUserId,
        updateDto,
      );

      expect(watchlistRepository.updateFavorite).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        true,
      );
      expect(result.is_favorite).toBe(true);
    });

    it('should throw NotFoundException if item not found', async () => {
      mockWatchlistRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateFavorite('nonexistent', mockUserId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user does not own item', async () => {
      const otherUserItem = {
        ...mockWatchlistItem,
        user_id: { toString: () => 'otherUserId' },
      };
      mockWatchlistRepository.findById.mockResolvedValue(otherUserItem);

      await expect(
        service.updateFavorite(
          '507f1f77bcf86cd799439013',
          mockUserId,
          updateDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove item from watchlist', async () => {
      mockWatchlistRepository.findById.mockResolvedValue(mockWatchlistItem);
      mockWatchlistRepository.delete.mockResolvedValue(mockWatchlistItem);

      await service.removeFromWatchlist('507f1f77bcf86cd799439013', mockUserId);

      expect(watchlistRepository.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
      );
    });

    it('should throw NotFoundException if item not found', async () => {
      mockWatchlistRepository.findById.mockResolvedValue(null);

      await expect(
        service.removeFromWatchlist('nonexistent', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user does not own item', async () => {
      const otherUserItem = {
        ...mockWatchlistItem,
        user_id: { toString: () => 'otherUserId' },
      };
      mockWatchlistRepository.findById.mockResolvedValue(otherUserItem);

      await expect(
        service.removeFromWatchlist('507f1f77bcf86cd799439013', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
