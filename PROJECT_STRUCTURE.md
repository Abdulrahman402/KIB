# Project Structure Documentation

## Directory Overview

```
KIB/
├── src/                          # Source code directory
│   ├── modules/                  # Feature modules (domain logic)
│   │   ├── movies/              # Movie management module
│   │   │   ├── dto/             # Data Transfer Objects for movies
│   │   │   │   ├── create-movie.dto.ts
│   │   │   │   ├── update-movie.dto.ts
│   │   │   │   ├── movie-filter.dto.ts
│   │   │   │   ├── movie-query.dto.ts
│   │   │   │   └── movie-response.dto.ts
│   │   │   ├── schemas/         # Mongoose schemas
│   │   │   │   └── movie.schema.ts
│   │   │   ├── interfaces/      # TypeScript interfaces
│   │   │   │   └── movie.interface.ts
│   │   │   ├── movies.controller.ts      # HTTP route handlers
│   │   │   ├── movies.controller.spec.ts # Controller tests
│   │   │   ├── movies.service.ts         # Business logic
│   │   │   ├── movies.service.spec.ts    # Service tests
│   │   │   ├── movies.repository.ts      # Data access layer
│   │   │   └── movies.module.ts          # Module definition
│   │   │
│   │   ├── genres/              # Genre management module
│   │   │   ├── dto/
│   │   │   │   └── genre-response.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── genre.schema.ts
│   │   │   ├── interfaces/
│   │   │   │   └── genre.interface.ts
│   │   │   ├── genres.controller.ts
│   │   │   ├── genres.controller.spec.ts
│   │   │   ├── genres.service.ts
│   │   │   ├── genres.service.spec.ts
│   │   │   └── genres.module.ts
│   │   │
│   │   ├── ratings/             # Movie rating module
│   │   │   ├── dto/
│   │   │   │   ├── create-rating.dto.ts
│   │   │   │   ├── update-rating.dto.ts
│   │   │   │   └── rating-response.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── rating.schema.ts
│   │   │   ├── interfaces/
│   │   │   │   └── rating.interface.ts
│   │   │   ├── ratings.controller.ts
│   │   │   ├── ratings.controller.spec.ts
│   │   │   ├── ratings.service.ts
│   │   │   ├── ratings.service.spec.ts
│   │   │   └── ratings.module.ts
│   │   │
│   │   ├── watchlist/           # Watchlist & favorites module
│   │   │   ├── dto/
│   │   │   │   ├── add-to-watchlist.dto.ts
│   │   │   │   ├── watchlist-query.dto.ts
│   │   │   │   └── watchlist-response.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── watchlist.schema.ts
│   │   │   ├── interfaces/
│   │   │   │   └── watchlist.interface.ts
│   │   │   ├── watchlist.controller.ts
│   │   │   ├── watchlist.controller.spec.ts
│   │   │   ├── watchlist.service.ts
│   │   │   ├── watchlist.service.spec.ts
│   │   │   └── watchlist.module.ts
│   │   │
│   │   ├── users/               # User management module
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts
│   │   │   ├── interfaces/
│   │   │   │   └── user.interface.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.controller.spec.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.service.spec.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── auth/                # Authentication module
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── interfaces/
│   │   │   │   └── jwt-payload.interface.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.controller.spec.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── tmdb/                # TMDB API integration module
│   │   │   ├── interfaces/
│   │   │   │   ├── tmdb-movie.interface.ts
│   │   │   │   ├── tmdb-genre.interface.ts
│   │   │   │   ├── tmdb-response.interface.ts
│   │   │   │   └── tmdb-config.interface.ts
│   │   │   ├── tmdb.service.ts
│   │   │   ├── tmdb.service.spec.ts
│   │   │   └── tmdb.module.ts
│   │   │
│   │   ├── cache/               # Redis caching module
│   │   │   ├── cache.service.ts
│   │   │   ├── cache.service.spec.ts
│   │   │   └── cache.module.ts
│   │   │
│   │   └── database/            # Database configuration module
│   │       ├── database.module.ts
│   │       └── database.providers.ts
│   │
│   ├── common/                  # Shared/common utilities
│   │   ├── decorators/          # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── api-paginated-response.decorator.ts
│   │   ├── filters/             # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── all-exceptions.filter.ts
│   │   │   └── mongo-exception.filter.ts
│   │   ├── guards/              # Common guards
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── timeout.interceptor.ts
│   │   │   └── cache.interceptor.ts
│   │   ├── pipes/               # Validation pipes
│   │   │   ├── validation.pipe.ts
│   │   │   ├── parse-objectid.pipe.ts
│   │   │   └── trim.pipe.ts
│   │   ├── dto/                 # Shared DTOs
│   │   │   ├── pagination.dto.ts
│   │   │   ├── pagination-response.dto.ts
│   │   │   └── base-response.dto.ts
│   │   ├── interfaces/          # Shared interfaces
│   │   │   ├── paginated-result.interface.ts
│   │   │   ├── api-response.interface.ts
│   │   │   └── user-request.interface.ts
│   │   ├── constants/           # Application constants
│   │   │   ├── cache-keys.constant.ts
│   │   │   ├── roles.constant.ts
│   │   │   ├── messages.constant.ts
│   │   │   └── regex.constant.ts
│   │   └── utils/               # Utility functions
│   │       ├── helpers.util.ts
│   │       └── date.util.ts
│   │
│   ├── config/                  # Configuration files
│   │   ├── app.config.ts        # Application config
│   │   ├── database.config.ts   # MongoDB config
│   │   ├── redis.config.ts      # Redis config
│   │   ├── jwt.config.ts        # JWT config
│   │   ├── tmdb.config.ts       # TMDB API config
│   │   └── validation.config.ts # Validation config
│   │
│   ├── app.module.ts            # Root application module
│   ├── app.controller.ts        # Root controller (health check)
│   ├── app.service.ts           # Root service
│   └── main.ts                  # Application entry point
│
├── test/                        # E2E tests directory
│   ├── app.e2e-spec.ts         # Application E2E tests
│   ├── movies.e2e-spec.ts      # Movies E2E tests
│   ├── auth.e2e-spec.ts        # Auth E2E tests
│   ├── ratings.e2e-spec.ts     # Ratings E2E tests
│   ├── watchlist.e2e-spec.ts   # Watchlist E2E tests
│   └── jest-e2e.json           # Jest E2E configuration
│
├── .env.example                 # Environment variables template
├── .gitignore                  # Git ignore rules
├── nest-cli.json               # NestJS CLI configuration
├── package.json                # NPM dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.build.json         # TypeScript build configuration
├── ARCHITECTURE.md             # Architecture documentation
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Project README
```

## Module Descriptions

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
**Purpose**: User management  
**Responsibilities**:
- User CRUD operations
- User profile management
- Password hashing and validation
- User data sanitization (exclude password)
- Unique email/username validation

**Key Files**:
- `users.controller.ts`: User endpoints
- `users.service.ts`: User operations
- `user.schema.ts`: User document schema with pre-save hooks

#### Auth Module
**Purpose**: Authentication and authorization  
**Responsibilities**:
- User registration with validation
- User login with credentials
- JWT token generation and validation
- Password hashing (bcrypt)
- Route protection with guards
- Token refresh (optional)
- Role-based access control

**Key Files**:
- `auth.controller.ts`: Auth endpoints (register, login)
- `auth.service.ts`: Authentication logic
- `jwt.strategy.ts`: Passport JWT strategy
- `jwt-auth.guard.ts`: Protect routes
- `roles.guard.ts`: Role-based authorization

#### TMDB Module
**Purpose**: Integration with TMDB API  
**Responsibilities**:
- Fetch movies from TMDB API
- Fetch genres from TMDB API
- Handle API rate limits
- Transform TMDB responses to app format
- Sync data periodically
- Error handling for external API

**Key Files**:
- `tmdb.service.ts`: TMDB API client
- `tmdb-*.interface.ts`: Type definitions for TMDB responses

#### Cache Module
**Purpose**: Redis caching layer  
**Responsibilities**:
- Cache frequently accessed data
- Cache invalidation strategies
- TTL management
- Cache key generation
- Get/set/delete operations
- Pattern-based deletion

**Key Files**:
- `cache.service.ts`: Redis operations wrapper

#### Database Module
**Purpose**: MongoDB configuration and connection  
**Responsibilities**:
- Mongoose configuration
- Database connection management
- Connection error handling
- Connection pooling

**Key Files**:
- `database.module.ts`: Database setup
- `database.providers.ts`: Database providers (optional)

### Common Directory (`src/common/`)

#### Decorators
Custom decorators for:
- **@CurrentUser()**: Extract user from request object
- **@Roles()**: Define required roles for routes
- **@Public()**: Mark routes as public (skip auth)
- **@ApiPaginatedResponse()**: Swagger pagination decorator

#### Filters
Exception filters for:
- **HttpExceptionFilter**: HTTP exceptions with custom format
- **AllExceptionsFilter**: Catch-all exception handler
- **MongoExceptionFilter**: MongoDB-specific errors (duplicate key, validation)

#### Guards
Security guards for:
- **ThrottleGuard**: Rate limiting
- Authentication guard (in auth module)
- Authorization guard (in auth module)

#### Interceptors
HTTP interceptors for:
- **LoggingInterceptor**: Request/response logging
- **TransformInterceptor**: Response transformation
- **TimeoutInterceptor**: Request timeout handling
- **CacheInterceptor**: HTTP caching

#### Pipes
Validation pipes for:
- **ValidationPipe**: Request body/query validation
- **ParseObjectIdPipe**: Validate and parse MongoDB ObjectIds
- **TrimPipe**: Trim string inputs

#### DTOs (Data Transfer Objects)
Shared DTOs:
- **PaginationDto**: Query params for pagination (page, limit, sort)
- **PaginationResponseDto**: Paginated response wrapper
- **BaseResponseDto**: Standard API response format

#### Interfaces
Shared TypeScript interfaces:
- **PaginatedResult**: Generic paginated data structure
- **ApiResponse**: Standard response structure
- **UserRequest**: Extended Express Request with user

#### Constants
Application-wide constants:
- **CACHE_KEYS**: Cache key patterns
- **ROLES**: User role definitions
- **MESSAGES**: Success/error messages
- **REGEX**: Regular expressions for validation

#### Utils
Utility functions:
- **helpers.util.ts**: Common helper functions
- **date.util.ts**: Date manipulation utilities

### Configuration (`src/config/`)

Centralized configuration management using `@nestjs/config`:
- **app.config.ts**: Port, environment, API prefix
- **database.config.ts**: MongoDB connection URI
- **redis.config.ts**: Redis connection settings
- **jwt.config.ts**: JWT secret and expiration
- **tmdb.config.ts**: TMDB API key and base URL
- **validation.config.ts**: Global validation pipe config

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
  - `create-movie.dto.ts`
  - `movie-response.dto.ts`
  - `movie-query.dto.ts`

### Tests
- Format: `{filename}.spec.ts` (unit tests)
- Format: `{filename}.e2e-spec.ts` (e2e tests)

## Module Dependencies Flow

```
AppModule (Root)
├── ConfigModule (Global)
├── DatabaseModule (Global)
├── CacheModule (Global)
│
├── AuthModule
│   └── UsersModule
│
├── MoviesModule
│   ├── GenresModule
│   ├── TMDBModule
│   └── CacheModule
│
├── RatingsModule
│   ├── MoviesModule
│   └── UsersModule
│
├── WatchlistModule
│   ├── MoviesModule
│   └── UsersModule
│
└── GenresModule
    └── TMDBModule
```

## Mongoose Schema Patterns

### Base Schema Options
All schemas should include:
```typescript
{
  timestamps: true,  // Auto-manage createdAt and updatedAt
  versionKey: false, // Disable __v field
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

### Virtual Properties
Use virtuals for computed fields that don't need to be stored:
```typescript
// Example: Full name virtual
schema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

### Indexes
Define indexes for frequently queried fields:
```typescript
@Schema()
export class Movie {
  @Prop({ unique: true, index: true })
  tmdbId: number;
  
  @Prop({ index: true })
  title: string;
}
```

### Pre/Post Hooks
Use hooks for business logic:
```typescript
// Hash password before saving
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
