# TMDB Application Architecture

## Overview
This is a RESTful API application built with NestJS that integrates with The Movie Database (TMDB) API to provide movie information, ratings, and watchlist functionality.

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
│   │   ├── schemas/         # Mongoose schemas
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── movies.controller.ts
│   │   ├── movies.service.ts
│   │   ├── movies.repository.ts
│   │   └── movies.module.ts
│   │
│   ├── genres/              # Genre management
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── genres.controller.ts
│   │   ├── genres.service.ts
│   │   └── genres.module.ts
│   │
│   ├── ratings/             # Movie rating system
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── ratings.controller.ts
│   │   ├── ratings.service.ts
│   │   └── ratings.module.ts
│   │
│   ├── watchlist/           # Watchlist & favorites
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── watchlist.controller.ts
│   │   ├── watchlist.service.ts
│   │   └── watchlist.module.ts
│   │
│   ├── users/               # User management
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── auth/                # Authentication
│   │   ├── dto/
│   │   ├── guards/          # Auth guards
│   │   ├── strategies/      # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── tmdb/                # TMDB API integration
│   │   ├── interfaces/      # TMDB response types
│   │   ├── tmdb.service.ts
│   │   └── tmdb.module.ts
│   │
│   ├── cache/               # Redis caching
│   │   ├── cache.service.ts
│   │   └── cache.module.ts
│   │
│   └── database/            # Database configuration
│       └── database.module.ts
│
├── common/                  # Shared utilities
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Common guards
│   ├── interceptors/        # HTTP interceptors
│   ├── pipes/               # Validation pipes
│   ├── dto/                 # Shared DTOs
│   ├── interfaces/          # Shared interfaces
│   └── constants/           # Constants
│
├── config/                  # Configuration
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   └── tmdb.config.ts
│
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## Data Flow

### 1. Initial TMDB Sync
```
TMDB API → TMDB Service → Movies Service → MongoDB
```

### 2. Movie Listing Request
```
Client → Controller → Cache Check → Service → Repository → MongoDB
                         ↓ (cache hit)
                      Return cached data
```

### 3. Rating a Movie
```
Client → Auth Guard → Controller → Rating Service → MongoDB
                                        ↓
                                  Clear movie cache
                                        ↓
                                  Recalculate average
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
- Movie lists: 5 minutes
- Movie details: 10 minutes
- Genres: 1 hour
- Search results: 5 minutes
- Ratings: 15 minutes
- Watchlist: 10 minutes

## API Endpoints

### Movies
- `GET /api/v1/movies` - List movies (paginated, filterable)
- `GET /api/v1/movies/:id` - Get movie details
- `GET /api/v1/movies/search` - Search movies
- `POST /api/v1/movies/sync` - Sync from TMDB (admin)
- `GET /api/v1/movies/genre/:genreId` - Filter by genre

### Ratings
- `POST /api/v1/movies/:movieId/rate` - Rate a movie
- `GET /api/v1/movies/:movieId/ratings` - Get movie ratings
- `PUT /api/v1/ratings/:id` - Update rating
- `DELETE /api/v1/ratings/:id` - Delete rating
- `GET /api/v1/users/me/ratings` - Get user's ratings

### Watchlist
- `POST /api/v1/watchlist` - Add to watchlist
- `GET /api/v1/watchlist` - Get user's watchlist
- `DELETE /api/v1/watchlist/:id` - Remove from watchlist
- `PATCH /api/v1/watchlist/:id/favorite` - Toggle favorite
- `GET /api/v1/watchlist/favorites` - Get favorites only

### Genres
- `GET /api/v1/genres` - List all genres
- `POST /api/v1/genres/sync` - Sync from TMDB (admin)

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get profile
- `PUT /api/v1/auth/profile` - Update profile

### Health
- `GET /health` - Health check endpoint

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
- **Daily sync** (2 AM): Update existing movies
- **Weekly genre sync**: Check for new genres
- Incremental updates based on last sync timestamp

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
