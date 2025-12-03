import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let jwtService: JwtService;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    comparePassword: jest.fn(),
  };

  const mockAuthRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123',
    };

    it('should successfully register a new user', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(null);
      mockAuthRepository.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(registerDto);

      expect(repository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(repository.create).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.username,
        registerDto.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
      expect(result).toEqual({
        data: {
          access_token: 'mock-jwt-token',
          user: {
            id: mockUser.id,
            email: mockUser.email,
            username: mockUser.username,
            is_active: mockUser.is_active,
          },
        },
        message: 'Registered successfully',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should successfully login a user', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(loginDto);

      expect(repository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
      expect(result).toEqual({
        data: {
          access_token: 'mock-jwt-token',
          user: {
            id: mockUser.id,
            email: mockUser.email,
            username: mockUser.username,
            is_active: mockUser.is_active,
          },
        },
        message: 'Successfully logged in',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const inactiveUser = { ...mockUser, is_active: false };
      inactiveUser.comparePassword = jest.fn().mockResolvedValue(true);
      mockAuthRepository.findByEmail.mockResolvedValue(inactiveUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'User account is inactive',
      );
    });
  });
});
