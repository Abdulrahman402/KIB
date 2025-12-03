import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ERROR_MESSAGES } from '../../common/constants/messages.constant';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Check if email already exists
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.authRepository.create(email, username, password);

    const payload: JwtPayload = {
      sub: user.id,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      data: {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          is_active: user.is_active,
        },
      },
      message: 'Registered successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.authRepository.findByEmail(email);

    if (!user)
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid)
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);

    if (!user.is_active)
      throw new UnauthorizedException('User account is inactive');

    const payload: JwtPayload = {
      sub: user.id,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      data: {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          is_active: user.is_active,
        },
      },
      message: 'Successfully logged in',
    };
  }
}
