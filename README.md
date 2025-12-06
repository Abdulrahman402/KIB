<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

TMDB Movie API - A comprehensive RESTful API for movie database management with ratings and watchlist functionality. Built with NestJS and powered by The Movie Database (TMDB) API.

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND FRAMEWORK                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  NestJS    │  │ TypeScript │  │  Node.js   │  │  Express   │   │
│  │  v10.x     │  │   v5.x     │  │   v20.x    │  │   HTTP     │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE & CACHING                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  MongoDB   │  │  Mongoose  │  │   Redis    │                    │
│  │   v7.0     │  │  ODM v8.x  │  │   v7.x     │                    │
│  │  (Primary) │  │            │  │  (Cache)   │                    │
│  └────────────┘  └────────────┘  └────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION & SECURITY                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ Passport.js│  │    JWT     │  │   bcrypt   │  │  Throttler │   │
│  │  Strategy  │  │  Tokens    │  │  Hashing   │  │ Rate Limit │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  TMDB API  │  │   Axios    │  │  @nestjs/  │                    │
│  │  (Source)  │  │   HTTP     │  │  schedule  │                    │
│  │            │  │  Client    │  │  (Cron)    │                    │
│  └────────────┘  └────────────┘  └────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    DOCUMENTATION & TESTING                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  Swagger   │  │    Jest    │  │ Supertest  │  │ class-     │   │
│  │  OpenAPI   │  │   Unit     │  │    E2E     │  │ validator  │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT & DEVOPS                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │   Docker   │  │  docker-   │  │  Multi-    │                    │
│  │ Container  │  │  compose   │  │  stage     │                    │
│  │            │  │            │  │  Build     │                    │
│  └────────────┘  └────────────┘  └────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Features

- 🎬 **Movie Management** - Browse, search, and filter movies from TMDB
- ⭐ **Rating System** - Rate movies from 1-10 with optional reviews
- 📋 **Watchlist** - Add movies to watchlist and mark favorites
- 🎭 **Genre Filtering** - Filter movies by genre (Action, Thriller, Horror, etc.)
- 🔒 **JWT Authentication** - Secure API endpoints with JWT tokens
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 🔄 **Auto-Sync** - Automated synchronization with TMDB data
- ✅ **Comprehensive Testing** - Unit tests with 85%+ coverage

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Project setup

```bash
$ npm install
```

### Environment Configuration

Create a `.env` file in the root directory (see `.env.example` for reference):


## Docker Deployment (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Start all services (MongoDB, Redis, Application)
$ docker-compose up

# Start in detached mode
$ docker-compose up -d

# Stop all services
$ docker-compose down

# View logs
$ docker-compose logs -f app
```

Once running, the application will be available at:
- **API Base URL**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:8080/api/docs`

## Local Development

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

**Prerequisites for local development:**
- MongoDB running on `mongodb://localhost:27017`
- Redis running on `localhost:6379`

## API Documentation

The API includes interactive Swagger documentation. Once the application is running, visit:

**http://localhost:8080/api/docs**

Here you can:
- Explore all available endpoints
- Test API calls directly from the browser
- View request/response schemas
- Authenticate with JWT tokens

### API Endpoints Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    API BASE: /api/v1                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔓 PUBLIC ENDPOINTS (No Authentication Required)                   │
│  ├── POST   /auth/register      Create new user account             │
│  └── POST   /auth/login         Get JWT access token                │
│                                                                      │
│  🔒 PROTECTED ENDPOINTS (JWT Token Required)                        │
│                                                                      │
│  🎬 MOVIES                                                           │
│  ├── GET    /movies             List all movies (pagination)        │
│  ├── GET    /movies/search      Search movies by title              │
│  ├── GET    /movies/:id         Get movie by ID                     │
│  └── [Filters: ?genre=Action&year=2024&minRating=7]                │
│                                                                      │
│  🎭 GENRES                                                           │
│  ├── GET    /genres             List all genres (cached)            │
│  └── GET    /genres/:id         Get genre details                   │
│                                                                      │
│  ⭐ RATINGS                                                          │
│  ├── POST   /ratings            Rate a movie (1-10 scale)           │
│  ├── GET    /ratings            Get user's ratings                  │
│  ├── GET    /ratings/:id        Get rating details                  │
│  ├── PATCH  /ratings/:id        Update a rating                     │
│  └── DELETE /ratings/:id        Delete a rating                     │
│                                                                      │
│  📋 WATCHLIST                                                        │
│  ├── POST   /watchlist          Add movie to watchlist              │
│  ├── GET    /watchlist          Get user's watchlist                │
│  ├── GET    /watchlist/:id      Get watchlist item                  │
│  ├── PATCH  /watchlist/:id      Update favorite status              │
│  └── DELETE /watchlist/:id      Remove from watchlist               │
│                                                                      │
│  💚 HEALTH CHECK                                                     │
│  └── GET    /health             Check API & DB status               │
│                                                                      │
│  📚 DOCUMENTATION                                                    │
│  └── GET    /api/docs           Swagger UI (this page)              │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
   ```json
   {
     "email": "user@example.com",
     "username": "johndoe",
     "password": "password123"
   }
   ```

2. **Login**: `POST /api/v1/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. Copy the `access_token` from the response

4. Click "Authorize" in Swagger UI and enter: `Bearer <your-token>`

### Example API Calls

**Movies**
- `GET /api/v1/movies` - List movies (with filters)
- `GET /api/v1/movies/search?query=inception` - Search movies
- `GET /api/v1/movies?genre=Action&year=2024&minRating=7` - Filtered list
- `GET /api/v1/movies/:id` - Get movie details

**Ratings**
- `POST /api/v1/ratings` - Rate a movie (1-10)
- `GET /api/v1/ratings` - Get your ratings
- `PATCH /api/v1/ratings/:id` - Update a rating

**Watchlist**
- `POST /api/v1/watchlist` - Add to watchlist
- `GET /api/v1/watchlist` - Get your watchlist
- `PATCH /api/v1/watchlist/:id/favorite` - Mark as favorite

**Genres**
- `GET /api/v1/genres` - List all genres
- `GET /api/v1/genres/:id/movies` - Movies by genre

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed project structure guide
- **[SWAGGER_SETUP.md](./SWAGGER_SETUP.md)** - Swagger/OpenAPI documentation guide
- **[JWT_USAGE_EXAMPLES.md](./JWT_USAGE_EXAMPLES.md)** - Authentication examples

## Technology Stack

- **Framework**: NestJS 10.x
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB 7.0 with Mongoose ODM
- **Cache**: Redis 7.x with cache-manager-redis-yet
- **Authentication**: JWT (Passport.js + @nestjs/jwt)
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Testing**: Jest with Supertest
- **HTTP Client**: Axios (@nestjs/axios)
- **Task Scheduling**: @nestjs/schedule (cron jobs)
- **Rate Limiting**: @nestjs/throttler
- **External API**: TMDB (The Movie Database)
- **Containerization**: Docker & Docker Compose

## Architecture Highlights

- **Modular Design** - Separated modules: auth, movies, ratings, watchlist, genres, tmdb, health
- **Repository Pattern** - Clean data access layer for all entities
- **DTOs** - Comprehensive request/response validation and transformation
- **JWT Guards** - Secure authentication with Passport.js JWT strategy
- **Custom Guards** - Throttler guard for rate limiting (100 requests/minute)
- **Interceptors** - Logging, response transformation, and caching
- **Exception Filters** - Global filters for HTTP, MongoDB, and all exceptions
- **Automated Sync** - Cron jobs for daily TMDB data synchronization (1 AM for genres, 2 AM for movies)
- **Redis Caching** - Global cache module with strategic TTLs
- **Health Checks** - Comprehensive health endpoints for monitoring
- **Swagger Documentation** - Interactive API documentation with JWT authentication
- **Docker Support** - Multi-stage Dockerfile with docker-compose for full stack

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
