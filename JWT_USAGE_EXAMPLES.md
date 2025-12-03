# JWT Token Management - Usage Examples

## Overview
The JWT infrastructure is now set up and ready to use. Here's how to use it in your modules.

## Components Created

### 1. **JwtTokenService** (`src/common/services/jwt.service.ts`)
Central service for encoding and decoding JWT tokens.

### 2. **JwtStrategy** (`src/common/strategies/jwt.strategy.ts`)
Passport strategy for automatic JWT validation.

### 3. **JwtAuthGuard** (`src/common/guards/jwt-auth.guard.ts`)
Guard to protect routes with JWT authentication.

### 4. **Decorators**
- `@Public()` - Mark routes as public (no authentication required)
- `@CurrentUser()` - Extract authenticated user from request

---

## Usage Examples

### 1. Generate JWT Token

```typescript
import { Injectable } from '@nestjs/common';
import { JwtTokenService } from '../common/services/jwt.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class SomeService {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async generateToken(userId: string, email: string, username: string) {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
      username: username,
    };

    // Generate single access token
    const accessToken = this.jwtTokenService.generateAccessToken(payload);

    // OR generate token pair (access + refresh)
    const tokens = this.jwtTokenService.generateTokenPair(payload);
    
    return {
      access_token: accessToken,
      // or
      ...tokens // { access_token, refresh_token }
    };
  }
}
```

### 2. Verify and Decode Token

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from '../common/services/jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async verifyToken(token: string) {
    try {
      // Verify and decode (throws error if invalid/expired)
      const payload = await this.jwtTokenService.verifyToken(token);
      console.log('User ID:', payload.sub);
      console.log('Email:', payload.email);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Decode without verification (useful for getting info from expired tokens)
  decodeToken(token: string) {
    const payload = this.jwtTokenService.decodeToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token format');
    }
    return payload;
  }
}
```

### 3. Protect Routes with Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Controller('movies')
export class MoviesController {
  // Protected route - requires JWT token
  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@CurrentUser() user: JwtPayload) {
    console.log('User ID:', user.sub);
    console.log('Email:', user.email);
    // user is automatically extracted from JWT token
    return { userId: user.sub };
  }

  // Another way - extract specific field
  @Get('watchlist')
  @UseGuards(JwtAuthGuard)
  async getWatchlist(@CurrentUser('sub') userId: string) {
    console.log('User ID:', userId);
    return { userId };
  }
}
```

### 4. Public Routes (No Authentication)

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('movies')
export class MoviesController {
  // Public route - anyone can access
  @Get()
  @Public()
  async getAllMovies() {
    return { message: 'Public endpoint - no auth needed' };
  }

  // Another public route
  @Get(':id')
  @Public()
  async getMovie() {
    return { message: 'Public movie details' };
  }
}
```

### 5. Global Authentication (Optional)

To protect ALL routes by default and mark specific ones as public:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // All routes protected by default
    },
  ],
})
export class AppModule {}
```

Then use `@Public()` decorator on routes that should be accessible without authentication.

---

## Token Flow

### Registration/Login Flow
```typescript
// 1. User registers/logs in
const payload: JwtPayload = {
  sub: user.id,
  email: user.email,
  username: user.username,
};

// 2. Generate token
const token = this.jwtTokenService.generateAccessToken(payload);

// 3. Return to client
return {
  access_token: token,
  user: { id: user.id, email: user.email }
};
```

### Protected Request Flow
```
Client Request → Include header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

↓

JwtAuthGuard → Extracts token from header

↓

JwtStrategy → Verifies token signature and expiration

↓

Controller → @CurrentUser() decorator provides decoded payload

↓

Response sent to client
```

---

## Error Handling

The `JwtAuthGuard` handles common JWT errors:

```typescript
// Token expired
throw new UnauthorizedException('Token has expired');

// Invalid token
throw new UnauthorizedException('Invalid token');

// Token not yet valid
throw new UnauthorizedException('Token not active');

// No token provided
throw new UnauthorizedException('Unauthorized');
```

---

## Configuration

JWT settings are loaded from environment variables:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

Accessed via:
```typescript
this.configService.get<string>('jwt.secret')
this.configService.get<string>('jwt.expiresIn')
```

---

## Next Steps

When you're ready to implement full authentication:

1. Create Auth module with login/register endpoints
2. Create Users service to manage user data
3. Use `JwtTokenService` to generate tokens on successful login
4. Protect routes with `@UseGuards(JwtAuthGuard)` or make it global
5. Use `@CurrentUser()` to access authenticated user in controllers

The JWT infrastructure is ready - you just need to create the authentication endpoints!
