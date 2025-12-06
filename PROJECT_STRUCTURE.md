# Project Structure Documentation

## Visual Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KIB Project Root                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📂 src/                       Main application source code              │
│  ├── 📂 modules/              Feature-based modules (business domains)  │
│  │   ├── 🎬 movies/           Movie browsing, search, filtering         │
│  │   ├── 🎭 genres/           Genre management & caching                │
│  │   ├── ⭐ ratings/          Movie rating system (1-10 scale)          │
│  │   ├── 📋 watchlist/        Watchlist & favorites management          │
│  │   ├── 🔐 auth/            JWT authentication (login/register)        │
│  │   ├── 👤 users/           User schema & interfaces                   │
│  │   ├── 🎥 tmdb/            TMDB API integration & auto-sync           │
│  │   ├── 💚 health/          Health checks (DB, Redis)                  │
│  │   └── 🗄️  database/        Database configuration & connection       │
│  │                                                                       │
│  ├── 📂 common/              Shared utilities & cross-cutting concerns  │
│  │   ├── 🛡️  guards/          JWT auth guard, rate limiter             │
│  │   ├── 🔄 interceptors/    Cache, logging, transform                 │
│  │   ├── ⚠️  filters/         Exception handling (HTTP, Mongo)          │
│  │   ├── ✅ pipes/            Validation pipe                           │
│  │   ├── 🎯 decorators/      Custom decorators (@Public, @CurrentUser) │
│  │   ├── 🔑 strategies/      Passport JWT strategy                     │
│  │   ├── 📐 schemas/         Base schema with timestamps               │
│  │   ├── 🚨 exceptions/      Custom exceptions (Business, NotFound)    │
│  │   ├── 📡 interfaces/      Shared interfaces (API response, JWT)     │
│  │   ├── 📝 constants/       App-wide constants & messages             │
│  │   └── 🛠️  utils/           Utility functions (cron helpers)          │
│  │                                                                       │
│  ├── 📂 config/              Configuration files & validation           │
│  │   ├── app.config.ts       App settings (port, prefix, CORS)         │
│  │   ├── database.config.ts  MongoDB connection settings               │
│  │   ├── redis.config.ts     Redis cache configuration                 │
│  │   ├── jwt.config.ts       JWT secret & expiration                   │
│  │   ├── tmdb.config.ts      TMDB API credentials & endpoints          │
│  │   └── env.validation.ts   Environment variable validation           │
│  │                                                                       │
│  ├── 📄 app.module.ts        Root module (imports all feature modules) │
│  └── 📄 main.ts              Application bootstrap & setup              │
│                                                                          │
│  📂 test/                     End-to-end tests                          │
│  ├── app.e2e-spec.ts         E2E test suite                            │
│  └── jest-e2e.json           Jest E2E configuration                    │
│                                                                          │
│  📂 Root Configuration Files                                            │
│  ├── 🐳 docker-compose.yml    Multi-container setup (app, mongo, redis)│
│  ├── 🐳 Dockerfile            Production-ready container image          │
│  ├── 📦 package.json          Dependencies & scripts                   │
│  ├── 🔧 tsconfig.json         TypeScript configuration                 │
│  ├── 🔧 tsconfig.build.json   TypeScript build settings                │
│  ├── 🔧 nest-cli.json         NestJS CLI configuration                 │
│  ├── 🔒 .env                  Environment variables (gitignored)        │
│  ├── 📋 .env.example          Environment template                     │
│  └── 📚 Documentation                                                   │
│      ├── README.md            Project overview & quick start           │
│      ├── ARCHITECTURE.md      System architecture & design             │
│      ├── PROJECT_STRUCTURE.md This file - detailed structure           │
│      ├── SWAGGER_SETUP.md     API documentation guide                  │
│      └── JWT_USAGE_EXAMPLES.md Authentication examples                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Overview

```
KIB/
├── src/                          # Source code directory
│   ├── modules/                  # Feature modules (domain logic)
│   │   ├── movies/              # Movie management module
│   │   │   ├── dto/             # Data Transfer Objects for movies
│   │   │   │   ├── movie-query.dto.ts
│   │   │   │   ├── movie-response.dto.ts
│   │   │   │   ├── paginated-movies-response.dto.ts
│   │   │   │   ├── search-movie.dto.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/         # Mongoose schemas
│   │   │   │   └── movie.schema.ts
│   │   │   ├── interfaces/      # TypeScript interfaces
│   │   │   ├── movies.controller.ts      # HTTP route handlers
│   │   │   ├── movies.controller.spec.ts # Controller tests
│   │   │   ├── movies.service.ts         # Business logic
│   │   │   ├── movies.service.spec.ts    # Service tests
│   │   │   ├── movies.repository.ts      # Data access layer
│   │   │   └── movies.module.ts          # Module definition
│   │   │
│   │   ├── genres/              # Genre management module
│   │   │   ├── dto/
│   │   │   │   ├── genre-response.dto.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/
│   │   │   ├── interfaces/
│   │   │   ├── genres.controller.ts
│   │   │   ├── genres.controller.spec.ts
│   │   │   ├── genres.service.ts
│   │   │   ├── genres.service.spec.ts
│   │   │   ├── genres.repository.ts
│   │   │   └── genres.module.ts
│   │   │
│   │   ├── ratings/             # Movie rating module
│   │   │   ├── dto/
│   │   │   │   ├── create-rating.dto.ts
│   │   │   │   ├── update-rating.dto.ts
│   │   │   │   ├── rating-response.dto.ts
│   │   │   │   ├── paginated-ratings-response.dto.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/
│   │   │   ├── interfaces/
│   │   │   ├── ratings.controller.ts
│   │   │   ├── ratings.controller.spec.ts
│   │   │   ├── ratings.service.ts
│   │   │   ├── ratings.service.spec.ts
│   │   │   ├── ratings.repository.ts
│   │   │   └── ratings.module.ts
│   │   │
│   │   ├── watchlist/           # Watchlist & favorites module
│   │   │   ├── dto/
│   │   │   │   ├── add-to-watchlist.dto.ts
│   │   │   │   ├── update-watchlist.dto.ts
│   │   │   │   ├── watchlist-response.dto.ts
│   │   │   │   ├── paginated-watchlist-response.dto.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/
│   │   │   ├── interfaces/
│   │   │   ├── watchlist.controller.ts
│   │   │   ├── watchlist.controller.spec.ts
│   │   │   ├── watchlist.service.ts
│   │   │   ├── watchlist.service.spec.ts
│   │   │   ├── watchlist.repository.ts
│   │   │   └── watchlist.module.ts
│   │   │
│   │   ├── users/               # User management module (lightweight)
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts
│   │   │   └── interfaces/
│   │   │
│   │   ├── auth/                # Authentication module
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.controller.spec.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.repository.spec.ts
│   │   │   ├── auth.repository.spec.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── tmdb/                # TMDB API integration module
│   │   │   ├── interfaces/
│   │   │   ├── tmdb.service.ts
│   │   │   ├── tmdb-sync.service.ts  # Cron sync service
│   │   │   └── tmdb.module.ts
│   │   │
│   │   ├── health/              # Health check module
│   │   │   ├── dto/
│   │   │   ├── health.controller.ts
│   │   │   └── health.module.ts
│   │   │
│   │   └── database/            # Database configuration module
│   │       ├── database.module.ts
│   │       └── schemas/         # Shared database schemas
│   │
│   ├── common/                  # Shared/common utilities
│   │   ├── decorators/          # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── skip-throttle.decorator.ts
│   │   ├── filters/             # Exception filters
│   │   │   ├── all-exceptions.filter.ts
│   │   │   ├── http-exception.filter.ts
│   │   │   └── mongo-exception.filter.ts
│   │   ├── guards/              # Common guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── throttler.guard.ts
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── cache.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/               # Validation pipes
│   │   │   └── validation.pipe.ts
│   │   ├── strategies/          # Passport strategies
│   │   │   └── jwt.strategy.ts
│   │   ├── schemas/             # Base schemas
│   │   │   └── base.schema.ts
│   │   ├── exceptions/          # Custom exceptions
│   │   │   ├── business.exception.ts
│   │   │   └── not-found.exception.ts
│   │   ├── dto/                 # Shared DTOs
│   │   ├── interfaces/          # Shared interfaces
│   │   │   ├── api-response.interface.ts
│   │   │   ├── error-response.interface.ts
│   │   │   └── jwt-payload.interface.ts
│   │   ├── constants/           # Application constants
│   │   │   └── messages.constant.ts
│   │   └── utils/               # Utility functions
│   │       └── cron.utils.ts
│   │
│   ├── config/                  # Configuration files
│   │   ├── app.config.ts        # Application config
│   │   ├── database.config.ts   # MongoDB config
│   │   ├── redis.config.ts      # Redis config
│   │   ├── jwt.config.ts        # JWT config
│   │   ├── tmdb.config.ts       # TMDB API config
│   │   └── env.validation.ts    # Environment validation
│   │
│   ├── app.module.ts            # Root application module
│   └── main.ts                  # Application entry point
│
├── test/                        # E2E tests directory
│   ├── app.e2e-spec.ts         # Application E2E tests
│   └── jest-e2e.json           # Jest E2E configuration
│
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .dockerignore               # Docker ignore rules
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Multi-stage Docker build
├── nest-cli.json               # NestJS CLI configuration
├── package.json                # NPM dependencies and scripts
├── package-lock.json           # NPM lock file
├── tsconfig.json               # TypeScript configuration
├── tsconfig.build.json         # TypeScript build configuration
├── ARCHITECTURE.md             # Architecture documentation
├── PROJECT_STRUCTURE.md        # This file
├── README.md                   # Project README
├── SWAGGER_SETUP.md            # Swagger documentation guide
└── JWT_USAGE_EXAMPLES.md       # JWT authentication examples
```

## Module Descriptions

### Layered Architecture Pattern

Each feature module follows a consistent 3-layer architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT / HTTP REQUEST                        │
│                  (GET /api/v1/movies?page=1)                    │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  movies.controller.ts                                     │  │
│  │  • Route definitions (@Get, @Post, @Patch, @Delete)      │  │
│  │  • Request validation (DTOs)                              │  │
│  │  • Response formatting                                    │  │
│  │  • Guards (@UseGuards(JwtAuthGuard))                     │  │
│  │  • Swagger documentation (@ApiTags, @ApiOperation)       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  movies.service.ts                                        │  │
│  │  • Business rules & validation                            │  │
│  │  • Data transformation & mapping                          │  │
│  │  • Orchestration between repositories                     │  │
│  │  • Error handling (throw NotFoundException)              │  │
│  │  • Aggregation logic (ratings, counts)                   │  │
│  │  • Cache management decisions                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  movies.repository.ts (Optional Pattern)                  │  │
│  │  • Database query construction                            │  │
│  │  • Mongoose operations (find, create, update, delete)    │  │
│  │  • Aggregation pipelines                                  │  │
│  │  • Index optimization                                     │  │
│  │  • Transaction handling                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB (via Mongoose)                                   │  │
│  │  • movie.schema.ts - Document structure                   │  │
│  │  • Indexes for performance                                │  │
│  │  • Validation rules                                       │  │
│  │  • Virtuals & methods                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

Supporting Layers (Cross-Cutting):
┌─────────────────────────────────────────────────────────────────┐
│  DTO Layer: movie-query.dto.ts, movie-response.dto.ts          │
│  • Input validation (class-validator)                           │
│  • Output transformation (class-transformer)                    │
│  • Swagger schema generation (@ApiProperty)                     │
└─────────────────────────────────────────────────────────────────┘
```

### Feature Modules (`src/modules/`)

#### Movies Module
**Purpose**: Manages movie data, listings, search, and filtering  
**Responsibilities**:
- CRUD operations for movies
- Pagination and filtering
- Search functionality (by title, overview)
- Integration with TMDB service
- Cache management for movie data
- Genre-based filtering
- Calculate and maintain average ratings

**Key Files**:
- `movies.controller.ts`: Handles HTTP requests for movies
- `movies.service.ts`: Business logic and orchestration
- `movies.repository.ts`: MongoDB data access (optional pattern)
- `movie.schema.ts`: Mongoose schema definition
- DTOs for input validation and response formatting

#### Genres Module
**Purpose**: Manages movie genres  
**Responsibilities**:
- List all genres
- Sync genres from TMDB
- Provide genre references for movies
- Cache genre data

**Key Files**:
- `genres.controller.ts`: Genre endpoints
- `genres.service.ts`: Genre business logic
- `genre.schema.ts`: Genre document schema

#### Ratings Module
**Purpose**: Handles user ratings for movies  
**Responsibilities**:
- Create/update/delete ratings (1-10 scale)
- Prevent duplicate ratings per user per movie
- Calculate average ratings via aggregation
- Update movie's average rating
- Cache rating aggregations
- Get user's rating history

**Key Files**:
- `ratings.controller.ts`: Rating endpoints
- `ratings.service.ts`: Rating logic and aggregations
- `rating.schema.ts`: Rating document with compound index

#### Watchlist Module
**Purpose**: Manages user watchlists and favorites  
**Responsibilities**:
- Add/remove movies from watchlist
- Mark movies as favorites
- Get user's watchlist with pagination
- Filter by favorite status
- Prevent duplicates
- Populate movie details

**Key Files**:
- `watchlist.controller.ts`: Watchlist endpoints
- `watchlist.service.ts`: Watchlist management
- `watchlist.schema.ts`: Watchlist schema with references

#### Users Module
**Purpose**: Lightweight user data management  
**Responsibilities**:
- User schema definition (username, email, password)
- Used primarily by Auth module
- No dedicated controller/service (handled by auth)

**Key Files**:
- `user.schema.ts`: User document schema with password hashing hooks

#### Auth Module
**Purpose**: Authentication and authorization  
**Responsibilities**:
- User registration with validation
- User login with credentials
- JWT token generation and validation
- Password hashing (bcrypt)
- Route protection with guards
- User repository operations

**Key Files**:
- `auth.controller.ts`: Auth endpoints (register, login)
- `auth.service.ts`: Authentication logic
- `auth.repository.ts`: User data access operations
- Guards and strategies located in `common/` directory

#### TMDB Module
**Purpose**: Integration with TMDB API  
**Responsibilities**:
- Fetch movies from TMDB API
- Fetch genres from TMDB API
- Handle API rate limits
- Transform TMDB responses to app format
- Automated daily sync via cron jobs (TmdbSyncService)
- Error handling for external API

**Key Files**:
- `tmdb.service.ts`: TMDB API client
- `tmdb-sync.service.ts`: Cron-based sync service (1 AM for genres, 2 AM for movies)
- `interfaces/`: Type definitions for TMDB responses

#### Health Module
**Purpose**: Application health monitoring  
**Responsibilities**:
- Application health check endpoint
- Database connectivity check
- Redis connectivity check
- Service status monitoring

**Key Files**:
- `health.controller.ts`: Health check endpoints

#### Database Module
**Purpose**: MongoDB configuration and connection  
**Responsibilities**:
- Mongoose configuration
- Database connection management
- Connection error handling
- Connection pooling
- Global database setup

**Key Files**:
- `database.module.ts`: Database module setup
- `schemas/`: Shared database schemas

### Common Directory (`src/common/`)

#### Decorators
Custom decorators for:
- **@CurrentUser()**: Extract user from request object (after JWT auth)
- **@Public()**: Mark routes as public (skip JWT authentication)
- **@SkipThrottle()**: Skip rate limiting for specific endpoints

#### Filters
Exception filters for:
- **AllExceptionsFilter**: Catch-all exception handler with logging
- **HttpExceptionFilter**: HTTP exceptions with standardized format
- **MongoExceptionFilter**: MongoDB-specific errors (duplicate key, validation)

#### Guards
Security guards for:
- **JwtAuthGuard**: JWT authentication guard (Passport-based)
- **CustomThrottlerGuard**: Custom rate limiting (100 requests/minute)

#### Interceptors
HTTP interceptors for:
- **LoggingInterceptor**: Request/response logging with timing
- **TransformInterceptor**: Standardized response transformation
- **CacheInterceptor**: HTTP caching with Redis

#### Pipes
Validation pipes for:
- **ValidationPipe**: Global request body/query validation (configured in main.ts)

#### Strategies
Passport strategies for:
- **JwtStrategy**: JWT token validation and user extraction

#### Schemas
Base schemas:
- **BaseSchema**: Common schema configuration (timestamps, transformations)

#### Exceptions
Custom exception classes:
- **BusinessException**: Business logic exceptions
- **NotFoundException**: Resource not found exceptions

#### DTOs (Data Transfer Objects)
Shared DTOs:
- Located in module-specific dto/ folders

#### Interfaces
Shared TypeScript interfaces:
- **ApiResponse**: Standard API response structure
- **ErrorResponse**: Error response format
- **JwtPayload**: JWT token payload structure

#### Constants
Application-wide constants:
- **MESSAGES**: Success/error message templates

#### Utils
Utility functions:
- **cron.utils.ts**: Cron job helper utilities

### Configuration (`src/config/`)

Centralized configuration management using `@nestjs/config`:
- **app.config.ts**: Port, environment, API prefix, CORS settings, pagination defaults
- **database.config.ts**: MongoDB connection URI
- **redis.config.ts**: Redis connection settings (host, port, password, TTL)
- **jwt.config.ts**: JWT secret and expiration time
- **tmdb.config.ts**: TMDB API key, base URL, image base URL, sync configuration
- **env.validation.ts**: Environment variable validation schema

## File Naming Conventions

### Controllers
- Format: `{feature}.controller.ts`
- Example: `movies.controller.ts`
- Tests: `{feature}.controller.spec.ts`

### Services
- Format: `{feature}.service.ts`
- Example: `movies.service.ts`
- Tests: `{feature}.service.spec.ts`

### Modules
- Format: `{feature}.module.ts`
- Example: `movies.module.ts`

### Schemas (Mongoose)
- Format: `{entity-name}.schema.ts`
- Example: `movie.schema.ts`

### Interfaces
- Format: `{entity-name}.interface.ts`
- Example: `movie.interface.ts`

### DTOs
- Format: `{action}-{entity}.dto.ts`
- Examples: 
  - `create-rating.dto.ts`
  - `rating-response.dto.ts`
  - `movie-query.dto.ts`
  - `paginated-movies-response.dto.ts`

### Repositories
- Format: `{feature}.repository.ts`
- Example: `movies.repository.ts`

### Tests
- Format: `{filename}.spec.ts` (unit tests)
- Format: `{filename}.e2e-spec.ts` (e2e tests)

## Module Dependencies Flow

```
AppModule (Root)
├── ConfigModule (Global)
├── DatabaseModule (Global)
├── CacheModule (Global - Redis)
├── ScheduleModule (Global - Cron jobs)
├── ThrottlerModule (Global - Rate limiting)
│
├── AuthModule
│   └── Uses User schema from users/schemas
│
├── MoviesModule
│   ├── GenresModule (for genre references)
│   └── CacheModule (implicit)
│
├── RatingsModule
│   ├── MoviesModule (update average ratings)
│   └── Uses User reference
│
├── WatchlistModule
│   ├── MoviesModule (movie references)
│   └── Uses User reference
│
├── GenresModule
│   └── CacheModule (implicit)
│
├── TmdbModule
│   ├── HttpModule (Axios)
│   ├── GenresRepository
│   └── MoviesRepository
│
└── HealthModule
    ├── DatabaseModule
    └── CacheModule
```

## Mongoose Schema Patterns

### Base Schema Options
All schemas extend from BaseSchema or include standard options:
```typescript
{
  timestamps: true,  // Auto-manage createdAt and updatedAt
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
}
```

### Indexes
Define indexes for frequently queried fields:
```typescript
@Schema()
export class Movie {
  @Prop({ unique: true, index: true })
  tmdb_id: number;
  
  @Prop({ index: true })
  title: string;
  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }], index: true })
  genres: Types.ObjectId[];
}
```

### Pre/Post Hooks
Used in User schema for password hashing:
```typescript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

## Best Practices

### 1. Separation of Concerns
- Controllers: Handle HTTP, validation, and responses
- Services: Business logic and orchestration
- Repositories: Data access (optional layer)
- Schemas: Data structure and validation

### 2. DRY Principle
- Shared logic in common directory
- Reusable DTOs and interfaces
- Base classes for common functionality

### 3. Single Responsibility
- Each module handles one domain
- Each service has a clear purpose
- Each file has one export

### 4. Dependency Injection
- Use NestJS DI container
- Constructor injection
- Avoid circular dependencies

### 5. Type Safety
- Use TypeScript strictly
- Define interfaces for all data structures
- Use DTOs for input/output

### 6. Testing
- Co-locate tests with source files
- Unit test services and utilities
- Integration test controllers
- E2E test critical flows

### 7. Error Handling
- Use global exception filters
- Custom exceptions for business logic
- Proper HTTP status codes
- Meaningful error messages

### 8. Validation
- Use class-validator in DTOs
- Validate all inputs
- Sanitize user input
- Use pipes for transformation

### 9. Documentation
- JSDoc for complex functions
- Swagger decorators for API docs
- README for setup instructions
- Architecture docs for design decisions

### 10. Security
- Never store passwords in plain text
- Validate and sanitize all inputs
- Use guards for authentication/authorization
- Implement rate limiting
- Keep dependencies updated

## Development Workflow

### 1. Create New Feature Module
```bash
nest generate module modules/feature-name
nest generate controller modules/feature-name
nest generate service modules/feature-name
```

### 2. Define Schema
Create Mongoose schema in `schemas/` directory

### 3. Create DTOs
Define input/output DTOs in `dto/` directory

### 4. Implement Service
Business logic in service layer

### 5. Implement Controller
HTTP endpoints in controller

### 6. Write Tests
Unit tests for service, controller tests

### 7. Document API
Add Swagger decorators

### 8. Integration
Wire up dependencies in module

## Code Organization Tips

- Keep files small and focused (< 300 lines)
- Group related functionality together
- Use barrel exports (index.ts) for cleaner imports
- Follow consistent naming conventions
- Organize imports: external → internal → relative
- Use absolute imports with path mapping
- Keep business logic out of controllers
- Use repository pattern for complex queries
- Implement caching at service layer
- Handle errors at appropriate layers
