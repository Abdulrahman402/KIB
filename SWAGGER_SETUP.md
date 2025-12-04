# Swagger/OpenAPI Documentation Setup

## Overview
Swagger/OpenAPI documentation has been successfully integrated into the TMDB Movie API. The documentation provides interactive API exploration and testing capabilities.

## Access Points

Once the application is running, access the Swagger documentation at:
- **Swagger UI**: `http://localhost:8080/api/docs`
- **Main Application**: `http://localhost:8080/api/v1`

## What Was Added

### 1. Package Installation
```bash
npm install --save @nestjs/swagger --legacy-peer-deps
```

### 2. Main Configuration (`src/main.ts`)
- Imported Swagger modules
- Created DocumentBuilder configuration with:
  - API title and description
  - Version information
  - JWT Bearer authentication scheme
  - Organized tags for each resource (auth, movies, genres, ratings, watchlist)
- Mounted Swagger UI at `/api/docs`
- Enhanced with custom styling and CDN resources

### 3. Controller Decorators
All controllers now include comprehensive Swagger decorators:

#### Auth Controller (`@ApiTags('auth')`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

#### Movies Controller (`@ApiTags('movies')`, `@ApiBearerAuth('JWT-auth')`)
- `GET /movies` - List all movies with filters
- `GET /movies/search` - Search movies
- `GET /movies/genre/:genreId` - Get movies by genre
- `GET /movies/tmdb/:tmdbId` - Get movie by TMDB ID
- `GET /movies/:id` - Get movie by ID

#### Ratings Controller (`@ApiTags('ratings')`, `@ApiBearerAuth('JWT-auth')`)
- `POST /ratings` - Create a movie rating
- `GET /ratings` - Get user's ratings
- `GET /ratings/:id` - Get rating by ID
- `PATCH /ratings/:id` - Update a rating
- `DELETE /ratings/:id` - Delete a rating

#### Watchlist Controller (`@ApiTags('watchlist')`, `@ApiBearerAuth('JWT-auth')`)
- `POST /watchlist` - Add movie to watchlist
- `GET /watchlist` - Get user's watchlist
- `GET /watchlist/:id` - Get watchlist item by ID
- `PATCH /watchlist/:id/favorite` - Update favorite status
- `DELETE /watchlist/:id` - Remove from watchlist

#### Genres Controller (`@ApiTags('genres')`, `@ApiBearerAuth('JWT-auth')`)
- `GET /genres` - Get all genres
- `GET /genres/:id` - Get genre by ID
- `GET /genres/:id/movies` - Get movies by genre

### 4. DTO Decorators
All DTOs now include `@ApiProperty` and `@ApiPropertyOptional` decorators with:
- Field descriptions
- Example values
- Data type information
- Validation constraints (min, max, length, etc.)

#### Updated DTOs:
**Auth Module:**
- `LoginDto`
- `RegisterDto`

**Movies Module:**
- `MovieQueryDto` - Query parameters for filtering/pagination
- `SearchMovieDto` - Search parameters
- `MovieResponseDto` - Movie data structure
- `PaginatedMoviesResponseDto` - Paginated movie list

**Ratings Module:**
- `CreateRatingDto`
- `UpdateRatingDto`
- `RatingResponseDto`
- `PaginatedRatingsResponseDto`

**Watchlist Module:**
- `AddToWatchlistDto`
- `UpdateWatchlistDto`
- `WatchlistResponseDto`
- `PaginatedWatchlistResponseDto`

**Genres Module:**
- `GenreResponseDto`

### 5. Response Documentation
Each endpoint includes:
- `@ApiOperation` - Endpoint summary and description
- `@ApiResponse` - Success and error responses with status codes
- `@ApiParam` - Path parameter descriptions
- `@ApiQuery` - Query parameter descriptions
- Example response schemas

## Authentication in Swagger

1. Click the **"Authorize"** button (🔓) in the top-right of Swagger UI
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize"
4. All protected endpoints will now include the JWT token in requests

Alternatively, you can:
1. First call `POST /auth/login` or `POST /auth/register`
2. Copy the `access_token` from the response
3. Use it in the Authorize dialog

## Features

### Interactive Testing
- Test all API endpoints directly from the browser
- View request/response examples
- See real-time validation errors
- Explore schema definitions

### Auto-generated Documentation
- Automatically synced with code changes
- Type-safe DTOs ensure accuracy
- Validation rules visible in UI

### Security Documentation
- JWT authentication clearly indicated
- Protected vs public endpoints differentiated
- Authentication flow documented

## Example Usage

### 1. Register a New User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

### 2. Authenticate
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Browse Movies (Authenticated)
```http
GET /api/v1/movies?page=1&limit=20&genre=507f1f77bcf86cd799439011&minRating=7
Authorization: Bearer <your-jwt-token>
```

### 4. Rate a Movie (Authenticated)
```http
POST /api/v1/ratings
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "movie_id": "507f1f77bcf86cd799439011",
  "rating": 8,
  "review": "Great movie!"
}
```

## Development Notes

### Adding New Endpoints
When adding new endpoints, include:
1. `@ApiOperation()` - Clear summary
2. `@ApiResponse()` - All possible status codes
3. `@ApiParam()` / `@ApiQuery()` - Parameter documentation
4. Proper tagging with `@ApiTags()`

### Adding New DTOs
For new DTOs, add:
1. `@ApiProperty()` for required fields
2. `@ApiPropertyOptional()` for optional fields
3. Example values
4. Clear descriptions

### Response Types
Always specify response types in controller methods:
```typescript
@ApiResponse({ status: 200, type: MovieResponseDto })
async findOne(): Promise<MovieResponseDto> { ... }
```

## Customization

The Swagger configuration in `src/main.ts` can be customized:
- Update API title, description, version
- Add custom tags
- Modify authentication schemes
- Add contact information, terms of service, license

## Best Practices

1. **Keep documentation up-to-date** - Swagger is auto-generated from decorators
2. **Use descriptive summaries** - Help API consumers understand endpoints
3. **Provide examples** - Makes testing easier
4. **Document all status codes** - Include success and error responses
5. **Tag logically** - Group related endpoints together

## Validation

Swagger UI shows validation rules from class-validator decorators:
- `@IsString()`, `@IsNumber()`, `@IsEmail()`
- `@Min()`, `@Max()`, `@MinLength()`, `@MaxLength()`
- `@IsOptional()`, `@IsNotEmpty()`

All validation is enforced at runtime by NestJS validation pipes.

## Production Considerations

For production deployment:
1. Consider restricting Swagger access (e.g., only in dev/staging)
2. Use environment variables to toggle Swagger availability
3. Add proper CORS configuration
4. Ensure JWT secrets are secure

## Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
