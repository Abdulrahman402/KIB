# TMDB Application Architecture

## Overview
This is a RESTful API application built with NestJS that integrates with The Movie Database (TMDB) API to provide movie information, ratings, and watchlist functionality.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│                    (Web Browser, Mobile App, Postman)                        │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ HTTP/HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  NestJS Main (Port 8080)                                             │   │
│  │  • CORS Middleware                                                   │   │
│  │  • Global Exception Filters                                          │   │
│  │  • Validation Pipe                                                   │   │
│  │  • Logging Interceptor                                               │   │
│  │  • Transform Interceptor                                             │   │
│  │  • Rate Limiting (100 req/min)                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION LAYER                                 │
│  ┌──────────────────┐      ┌──────────────────┐                            │
│  │  JWT Strategy    │◄─────│  Auth Module     │                            │
│  │  (Passport.js)   │      │  • Login         │                            │
│  └──────────────────┘      │  • Register      │                            │
│                            │  • JWT Guard     │                            │
│                            └──────────────────┘                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Movies   │  │ Genres   │  │ Ratings  │  │Watchlist │  │  Health  │    │
│  │ Module   │  │ Module   │  │ Module   │  │ Module   │  │  Module  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │             │             │           │
│       ▼             ▼              ▼             ▼             ▼           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Controller│  │Controller│  │Controller│  │Controller│  │Controller│    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │             │             │           │
│       ▼             ▼              ▼             ▼             ▼           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │ Service  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │             │             │           │
│       ▼             ▼              ▼             ▼             ▼           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Repository│  │Repository│  │Repository│  │Repository│                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼──────────────┼─────────────┼──────────────────────────┘
        │             │              │             │
        └─────────────┴──────────────┴─────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CACHING LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Redis Cache (cache-manager-redis-yet)                              │   │
│  │  • TTL: 120 seconds (configurable)                                  │   │
│  │  • Cache Interceptor for GET requests                               │   │
│  │  • Genre caching (2 min TTL)                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE LAYER                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  MongoDB (Mongoose ODM)                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   Movies    │  │   Genres    │  │   Ratings   │  │  Watchlist  │ │  │
│  │  │ Collection  │  │ Collection  │  │ Collection  │  │ Collection  │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  │  ┌─────────────┐                                                     │  │
│  │  │    Users    │                                                     │  │
│  │  │ Collection  │                                                     │  │
│  │  └─────────────┘                                                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES LAYER                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  TMDB API (The Movie Database)                                        │  │
│  │  • Fetch Popular Movies                                               │  │
│  │  • Fetch Genres                                                       │  │
│  │  • Auto-sync via Cron (Daily at 2 AM UTC)                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKGROUND JOBS LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Cron Jobs (@nestjs/schedule)                                         │  │
│  │  • Sync Genres: 0 1 * * * (1 AM UTC daily)                           │  │
│  │  • Sync Movies: 0 2 * * * (2 AM UTC daily, 50 pages)                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Architecture Pattern
The application follows a **modular monolithic architecture** with clear separation of concerns:
- **Layered Architecture**: Controller → Service → Repository
- **Domain-Driven Design**: Organized by business domains (movies, ratings, watchlist)
- **Dependency Injection**: NestJS built-in DI container
- **Repository Pattern**: Data access abstraction

## Tech Stack

### Backend Framework
- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe development
- **Express**: HTTP server (under the hood)

### Database & ODM
- **MongoDB**: NoSQL document database
- **Mongoose**: Object Data Modeling (ODM) library
- **Redis**: Caching layer

### External Services
- **TMDB API**: Movie data source

### Authentication & Security
- **Passport.js**: Authentication middleware
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

### Documentation
- **Swagger/OpenAPI**: API documentation
- **Compodoc**: Code documentation

### Testing
- **Jest**: Unit and integration testing
- **Supertest**: E2E testing

## Project Structure

```
src/
├── modules/                  # Feature modules
│   ├── movies/              # Movie management
│   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── movie-query.dto.ts
│   │   │   ├── movie-response.dto.ts
│   │   │   ├── paginated-movies-response.dto.ts
│   │   │   ├── search-movie.dto.ts
│   │   │   └── index.ts
│   │   ├── schemas/         # Mongoose schemas
│   │   │   └── movie.schema.ts
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── movies.controller.ts
│   │   ├── movies.controller.spec.ts
│   │   ├── movies.service.ts
│   │   ├── movies.service.spec.ts
│   │   ├── movies.repository.ts
│   │   └── movies.module.ts
│   │
│   ├── genres/              # Genre management
│   │   ├── dto/
│   │   │   ├── genre-response.dto.ts
│   │   │   └── index.ts
│   │   ├── schemas/
│   │   ├── interfaces/
│   │   ├── genres.controller.ts
│   │   ├── genres.controller.spec.ts
│   │   ├── genres.service.ts
│   │   ├── genres.service.spec.ts
│   │   ├── genres.repository.ts
│   │   └── genres.module.ts
│   │
│   ├── ratings/             # Movie rating system
│   │   ├── dto/
│   │   │   ├── create-rating.dto.ts
│   │   │   ├── update-rating.dto.ts
│   │   │   ├── rating-response.dto.ts
│   │   │   ├── paginated-ratings-response.dto.ts
│   │   │   └── index.ts
│   │   ├── schemas/
│   │   ├── interfaces/
│   │   ├── ratings.controller.ts
│   │   ├── ratings.controller.spec.ts
│   │   ├── ratings.service.ts
│   │   ├── ratings.service.spec.ts
│   │   ├── ratings.repository.ts
│   │   └── ratings.module.ts
│   │
│   ├── watchlist/           # Watchlist & favorites
│   │   ├── dto/
│   │   │   ├── add-to-watchlist.dto.ts
│   │   │   ├── update-watchlist.dto.ts
│   │   │   ├── watchlist-response.dto.ts
│   │   │   ├── paginated-watchlist-response.dto.ts
│   │   │   └── index.ts
│   │   ├── schemas/
│   │   ├── interfaces/
│   │   ├── watchlist.controller.ts
│   │   ├── watchlist.controller.spec.ts
│   │   ├── watchlist.service.ts
│   │   ├── watchlist.service.spec.ts
│   │   ├── watchlist.repository.ts
│   │   └── watchlist.module.ts
│   │
│   ├── users/               # User management (lightweight)
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   └── interfaces/
│   │
│   ├── auth/                # Authentication
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.repository.spec.ts
│   │   └── auth.module.ts
│   │
│   ├── tmdb/                # TMDB API integration
│   │   ├── interfaces/      # TMDB response types
│   │   ├── tmdb.service.ts
│   │   ├── tmdb-sync.service.ts  # Cron sync service
│   │   └── tmdb.module.ts
│   │
│   ├── health/              # Health check module
│   │   ├── dto/
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   │
│   └── database/            # Database configuration
│       ├── database.module.ts
│       └── schemas/         # Shared schemas
│
├── common/                  # Shared utilities
│   ├── decorators/          # Custom decorators
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── skip-throttle.decorator.ts
│   ├── filters/             # Exception filters
│   │   ├── all-exceptions.filter.ts
│   │   ├── http-exception.filter.ts
│   │   └── mongo-exception.filter.ts
│   ├── guards/              # Common guards
│   │   ├── jwt-auth.guard.ts
│   │   └── throttler.guard.ts
│   ├── interceptors/        # HTTP interceptors
│   │   ├── cache.interceptor.ts
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/               # Validation pipes
│   │   └── validation.pipe.ts
│   ├── strategies/          # Passport strategies
│   │   └── jwt.strategy.ts
│   ├── schemas/             # Base schemas
│   │   └── base.schema.ts
│   ├── exceptions/          # Custom exceptions
│   │   ├── business.exception.ts
│   │   └── not-found.exception.ts
│   ├── dto/                 # Shared DTOs
│   ├── interfaces/          # Shared interfaces
│   │   ├── api-response.interface.ts
│   │   ├── error-response.interface.ts
│   │   └── jwt-payload.interface.ts
│   ├── constants/           # Constants
│   │   └── messages.constant.ts
│   └── utils/               # Utility functions
│       └── cron.utils.ts
│
├── config/                  # Configuration
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   ├── tmdb.config.ts
│   └── env.validation.ts
│
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## Request Flow Diagrams

### Authentication Flow
```
┌──────────┐
│  Client  │
└─────┬────┘
      │ POST /api/v1/auth/register
      │ { username, email, password }
      ▼
┌─────────────────────┐
│  Auth Controller    │
└─────┬───────────────┘
      │ Validate DTO
      ▼
┌─────────────────────┐
│   Auth Service      │
└─────┬───────────────┘
      │ 1. Check if user exists
      │ 2. Hash password (bcrypt)
      │ 3. Create user
      ▼
┌─────────────────────┐
│  Auth Repository    │
└─────┬───────────────┘
      │ Save to DB
      ▼
┌─────────────────────┐
│     MongoDB         │
│  (users collection) │
└─────┬───────────────┘
      │ Return user
      ▼
┌─────────────────────┐
│   Auth Service      │
│ Generate JWT Token  │
└─────┬───────────────┘
      │ Return { access_token, user }
      ▼
┌──────────┐
│  Client  │
└──────────┘
```

### Protected Endpoint Flow (with JWT)
```
┌──────────┐
│  Client  │
└─────┬────┘
      │ GET /api/v1/movies
      │ Headers: { Authorization: Bearer <token> }
      ▼
┌─────────────────────────────┐
│  JWT Auth Guard             │
│  1. Extract token           │
│  2. Verify with JWT_SECRET  │
│  3. Decode payload          │
└─────┬───────────────────────┘
      │ Valid? ✓
      ▼
┌─────────────────────────────┐
│  Rate Limiter Guard         │
│  Check: 100 req/min         │
└─────┬───────────────────────┘
      │ Allowed? ✓
      ▼
┌─────────────────────────────┐
│  Movies Controller          │
│  @Get()                     │
└─────┬───────────────────────┘
      │ Parse query params
      ▼
┌─────────────────────────────┐
│  Cache Interceptor          │
│  Check Redis cache          │
└─────┬───────────────────────┘
      │ Cache miss?
      ▼
┌─────────────────────────────┐
│  Movies Service             │
│  Apply filters & sorting    │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│  Movies Repository          │
│  Build MongoDB query        │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Find & aggregate           │
└─────┬───────────────────────┘
      │ Return documents
      ▼
┌─────────────────────────────┐
│  Transform Interceptor      │
│  Format response            │
└─────┬───────────────────────┘
      │ Store in Redis cache
      ▼
┌─────────────────────────────┐
│  Logging Interceptor        │
│  Log request/response       │
└─────┬───────────────────────┘
      │ Return JSON
      ▼
┌──────────┐
│  Client  │
└──────────┘
```

### Rating a Movie Flow
```
┌──────────┐
│  Client  │
└─────┬────┘
      │ POST /api/v1/ratings
      │ { movie_id, rating: 8, review: "Great!" }
      │ Headers: { Authorization: Bearer <token> }
      ▼
┌─────────────────────────────┐
│  JWT Auth Guard             │
│  Extract user_id from token │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│  Ratings Controller         │
│  @Post()                    │
└─────┬───────────────────────┘
      │ Validate DTO
      ▼
┌─────────────────────────────┐
│  Ratings Service            │
│  1. Check movie exists      │
│  2. Check duplicate rating  │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│  Ratings Repository         │
│  Save rating document       │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Insert into ratings        │
└─────┬───────────────────────┘
      │ Success
      ▼
┌─────────────────────────────┐
│  Ratings Service            │
│  updateMovieAverageRating() │
└─────┬───────────────────────┘
      │ 1. Calculate average
      │ 2. Count total ratings
      ▼
┌─────────────────────────────┐
│  Movies Repository          │
│  updateAverageRating()      │
└─────┬───────────────────────┘
      │ Update movie document
      ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Update movies collection   │
└─────┬───────────────────────┘
      │ Return updated rating
      ▼
┌──────────┐
│  Client  │
└──────────┘
```

### TMDB Auto-Sync Flow (Cron Job)
```
┌─────────────────────────────┐
│  Cron Scheduler             │
│  Daily at 2 AM UTC          │
└─────┬───────────────────────┘
      │ Trigger
      ▼
┌─────────────────────────────┐
│  TMDB Sync Service          │
│  syncMovies()               │
└─────┬───────────────────────┘
      │ Loop: 50 pages
      ▼
┌─────────────────────────────┐
│  TMDB Service               │
│  fetchMovies(page)          │
└─────┬───────────────────────┘
      │ HTTP GET
      ▼
┌─────────────────────────────┐
│  TMDB API                   │
│  /movie/popular?page=N      │
└─────┬───────────────────────┘
      │ Return movies array
      ▼
┌─────────────────────────────┐
│  TMDB Sync Service          │
│  Transform & validate       │
└─────┬───────────────────────┘
      │ For each movie
      ▼
┌─────────────────────────────┐
│  Movies Repository          │
│  upsert (update or insert)  │
└─────┬───────────────────────┘
      │ Check by tmdb_id
      ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Update or create document  │
└─────┬───────────────────────┘
      │ Success
      ▼
┌─────────────────────────────┐
│  Logger                     │
│  Log sync completion        │
└─────────────────────────────┘
```

## Module Dependency Graph

```
┌──────────────────────────────────────────────────────────────────────┐
│                           AppModule (Root)                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Global Modules:                                                 │ │
│  │  • ConfigModule (env variables)                                │ │
│  │  • CacheModule (Redis)                                         │ │
│  │  • ThrottlerModule (Rate limiting)                             │ │
│  │  • ScheduleModule (Cron jobs)                                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ DatabaseModule   │   │   AuthModule     │   │  HealthModule    │
│                  │   │                  │   │                  │
│ • MongoDB setup  │   │ • JWT Strategy   │   │ • DB check       │
│ • Mongoose       │   │ • Login/Register │   │ • Redis check    │
└────────┬─────────┘   └────────┬─────────┘   └──────────────────┘
         │                      │
         │                      │ (uses)
         │                      ▼
         │             ┌──────────────────┐
         │             │ Common/Strategies│
         │             │ Common/Guards    │
         │             └──────────────────┘
         │
         │ (imported by all feature modules)
         │
         ├──────────┬──────────┬──────────┬──────────┐
         ▼          ▼          ▼          ▼          ▼
   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
   │ Movies  ││ Genres  ││ Ratings ││Watchlist││  TMDB   │
   │ Module  ││ Module  ││ Module  ││ Module  ││ Module  │
   └────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘
        │          │          │          │          │
        │          │          ├──────────┤          │
        │          │          │  depends │          │
        │          │          ▼          ▼          │
        │          │     MoviesModule (shared)      │
        │          │                                 │
        │          └─────────────┬───────────────────┘
        │                        │ (uses for sync)
        └────────────────────────┘

Dependencies:
• RatingsModule → MoviesModule (update average rating)
• WatchlistModule → MoviesModule (validate movie exists)
• TMDBModule → MoviesModule, GenresModule (sync data)
• All modules → DatabaseModule (MongoDB connection)
• All modules → ConfigModule (environment variables)
```

## Data Flow Patterns

### 1. Initial TMDB Sync
```
TMDB API → TMDB Service → Movies/Genres Service → Repository → MongoDB
```

### 2. Cached Movie Listing
```
Client → Controller → Redis (Cache Hit) → Return Data
                          ↓ (Cache Miss)
                    Service → Repository → MongoDB → Cache Result
```

### 3. Rating with Average Calculation
```
Client → Rating Service → Create Rating → Update Movie Average
                              ↓                    ↓
                          MongoDB             MongoDB
                        (ratings)             (movies)
```

## MongoDB Schema Design

### Collections

#### 1. **users**
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **movies**
```javascript
{
  _id: ObjectId,
  tmdbId: Number (unique, required, indexed),
  title: String (required, indexed),
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: Date (indexed),
  runtime: Number,
  popularity: Number (indexed),
  voteAverage: Number,
  voteCount: Number,
  genres: [ObjectId] (ref: 'Genre'),
  averageRating: Number (calculated field),
  ratingsCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **genres**
```javascript
{
  _id: ObjectId,
  tmdbId: Number (unique, required),
  name: String (required, unique, indexed),
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **ratings**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, indexed),
  movieId: ObjectId (ref: 'Movie', required, indexed),
  rating: Number (required, min: 1, max: 10),
  createdAt: Date,
  updatedAt: Date
}
// Compound unique index on (userId, movieId)
```

#### 5. **watchlists**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, indexed),
  movieId: ObjectId (ref: 'Movie', required, indexed),
  isFavorite: Boolean (default: false),
  addedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
// Compound unique index on (userId, movieId)
```

#### 6. **synclogs**
```javascript
{
  _id: ObjectId,
  entityType: String (enum: ['movies', 'genres']),
  lastSyncDate: Date,
  status: String (enum: ['success', 'failed', 'in-progress']),
  totalSynced: Number,
  errorMessage: String,
  createdAt: Date
}
```

### Indexes Strategy

**movies collection:**
- `tmdbId`: unique index
- `title`: text index for search
- `releaseDate`: descending index
- `popularity`: descending index
- `genres`: array index

**ratings collection:**
- Compound index: `(userId, movieId)` - unique
- `movieId`: index for aggregations
- `userId`: index for user ratings

**watchlists collection:**
- Compound index: `(userId, movieId)` - unique
- `userId`: index for user watchlist
- `isFavorite`: index for favorites filtering

**users collection:**
- `email`: unique index
- `username`: unique index

**genres collection:**
- `tmdbId`: unique index
- `name`: unique index

## Caching Strategy

### Cache Keys Pattern
```
movies:list:{page}:{limit}:{filters}
movies:detail:{movieId}
movies:rating:{movieId}
movies:search:{query}:{page}
genres:all
watchlist:user:{userId}
```

### Cache Invalidation
- **On TMDB Sync**: Clear all movie-related caches
- **On New Rating**: Clear specific movie's rating cache and recalculate average
- **On Movie Update**: Clear specific movie cache
- **On Watchlist Update**: Clear user's watchlist cache

### TTL Strategy
- Genres list: 2 minutes (120 seconds) - cached with CacheInterceptor
- Global Redis TTL: 120 seconds (configurable via REDIS_TTL)
- Cache invalidation on data mutations (ratings, watchlist changes)
- Strategic caching for read-heavy endpoints

## API Endpoints

### Movies
- `GET /api/v1/movies` - List movies (paginated, filterable by genre, year, rating)
- `GET /api/v1/movies/search` - Search movies by title
- `GET /api/v1/movies/:id` - Get movie details by ID

### Ratings
- `POST /api/v1/ratings` - Rate a movie (1-10 scale)
- `GET /api/v1/ratings` - Get user's ratings
- `GET /api/v1/ratings/:id` - Get rating by ID
- `PATCH /api/v1/ratings/:id` - Update rating
- `DELETE /api/v1/ratings/:id` - Delete rating
- `GET /api/v1/ratings/movie/:movieId` - Get all ratings for a movie

### Watchlist
- `POST /api/v1/watchlist` - Add movie to watchlist
- `GET /api/v1/watchlist` - Get user's watchlist (filter by favorites)
- `GET /api/v1/watchlist/:id` - Get watchlist item by ID
- `PATCH /api/v1/watchlist/:id/favorite` - Toggle favorite status
- `PATCH /api/v1/watchlist/:id` - Update watchlist item
- `DELETE /api/v1/watchlist/:id` - Remove from watchlist

### Genres
- `GET /api/v1/genres` - List all genres (cached)
- `GET /api/v1/genres/:id` - Get genre by ID

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Health
- `GET /api/v1/health` - Application health check
- `GET /api/v1/health/database` - Database connectivity check
- `GET /api/v1/health/redis` - Redis connectivity check

## Security

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt (10 salt rounds)
- Token expiration (7 days default)
- Refresh token mechanism (optional)

### Authorization
- Role-based access control (User, Admin)
- Route guards for protected endpoints
- Admin-only routes for sync operations

### Best Practices
- Input validation with class-validator
- NoSQL injection prevention
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js for security headers
- Request size limits
- XSS protection

## Performance Optimization

### 1. Database Optimization
- **Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Select only needed fields with projection
- **Pagination**: Limit results with skip/limit
- **Aggregation Pipeline**: Efficient data processing
- **Lean Queries**: Return plain JavaScript objects when possible

### 2. Caching
- Redis for frequently accessed data
- Cache-aside pattern
- Smart invalidation strategy
- TTL-based expiration

### 3. Background Jobs
- Async TMDB sync using Bull Queue
- Scheduled tasks for data updates (cron jobs)
- Rating aggregation in background
- Batch processing for bulk operations

### 4. API Optimization
- Response compression (gzip)
- Pagination for all list endpoints
- Field filtering (sparse fieldsets)
- ETags for conditional requests

## MongoDB Aggregation Examples

### Calculate Average Rating
```javascript
db.ratings.aggregate([
  { $match: { movieId: ObjectId("...") } },
  { $group: { 
      _id: "$movieId", 
      avgRating: { $avg: "$rating" },
      count: { $sum: 1 }
  }}
])
```

### Get Popular Movies with Ratings
```javascript
db.movies.aggregate([
  { $lookup: {
      from: "ratings",
      localField: "_id",
      foreignField: "movieId",
      as: "ratings"
  }},
  { $addFields: {
      averageRating: { $avg: "$ratings.rating" },
      ratingsCount: { $size: "$ratings" }
  }},
  { $sort: { popularity: -1 } },
  { $limit: 20 }
])
```

## Testing Strategy

### Unit Tests
- Service layer logic (85%+ coverage)
- Repository layer
- Utility functions
- Custom decorators/pipes
- Guards and strategies

### Integration Tests
- Controller endpoints
- Database operations
- External API integration
- Cache operations

### E2E Tests
- Complete user flows
- Authentication flows
- Critical business processes
- Movie rating workflow
- Watchlist management

### Coverage Target
- Minimum 85% code coverage
- 100% coverage for critical paths

## TMDB Sync Strategy

### Initial Population
1. Fetch popular movies (20-50 pages from TMDB)
2. Sync all genres (one-time operation)
3. Store sync metadata in synclogs collection

### Scheduled Sync (Cron Job)
- **Daily genre sync** (1 AM UTC): Update genres from TMDB
- **Daily movie sync** (2 AM UTC): Sync 50 pages of popular movies (configurable via TMDB_SYNC_PAGES)
- Incremental updates with upsert operations
- Batch processing with rate limiting

### Sync Process
1. Check last sync log
2. Fetch data from TMDB API
3. Transform TMDB data to app schema
4. Upsert movies/genres (update if exists, insert if new)
5. Update sync log with status
6. Clear relevant caches

### TMDB Endpoints Used
- `/genre/movie/list` - Get all genres
- `/movie/popular` - Get popular movies
- `/movie/{movie_id}` - Get movie details
- `/discover/movie` - Discover with filters

## Error Handling

### Error Types
1. **Validation Errors** (400): Invalid input data
2. **Authentication Errors** (401): Invalid/missing token
3. **Authorization Errors** (403): Insufficient permissions
4. **Not Found Errors** (404): Resource not found
5. **Conflict Errors** (409): Duplicate resources
6. **Server Errors** (500): Internal server errors
7. **External API Errors** (502/503): TMDB API issues

### Global Exception Filter
- Centralized error handling
- Consistent error response format
- Error logging
- Stack trace in development only

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["rating must be between 1 and 10"],
  "timestamp": "2025-12-03T10:00:00.000Z",
  "path": "/api/v1/movies/123/rate"
}
```

## Monitoring & Logging

### Logging Strategy
- **Winston** for structured logging
- Log levels: error, warn, info, debug
- Request/response logging
- Error stack traces
- Rotation policy for log files

### Metrics to Monitor
- API response times
- Database query performance
- Cache hit/miss ratio
- TMDB API call count
- Error rates
- Active users

### Health Checks
- Database connection status
- Redis connection status
- TMDB API availability
- Memory usage
- Uptime

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Redis for session storage
- Load balancer compatible

### Database Scaling
- MongoDB sharding (by tmdbId)
- Read replicas for read-heavy operations
- Connection pooling

### Caching Scaling
- Redis cluster for distributed caching
- Cache replication

## Future Enhancements
- GraphQL API support
- Real-time updates with WebSockets
- Movie recommendations engine (ML-based)
- Social features (follow users, share lists)
- Advanced search with full-text search
- Multi-language support
- Image optimization and CDN
- Mobile app API support
- Notification system
- Movie reviews and comments
