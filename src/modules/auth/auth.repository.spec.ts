import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthRepository } from './auth.repository';
import { User } from '../users/schemas/user.schema';

describe('AuthRepository', () => {
  let repository: AuthRepository;

  const mockUser = {
    _id: '123',
    id: '123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    save: jest.fn(),
  };

  const mockUserModel = function (this: any, data: any) {
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
    this.save = jest.fn().mockResolvedValue(mockUser);
    return this;
  };

  mockUserModel.findOne = jest.fn();
  mockUserModel.exec = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const email = 'test@example.com';
      const username = 'testuser';
      const password = 'password123';

      const result = await repository.create(email, username, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(result.username).toBe(username);
    });
  });

  describe('findByEmail', () => {
    it('should find and return a user by email', async () => {
      const email = 'test@example.com';

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await repository.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
