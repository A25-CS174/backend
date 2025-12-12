# Backend API Documentation

This is the backend API for the Student Learning Progress Visualization application, built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (version 20 or higher)
- MySQL (for running without Docker)
- Docker and Docker Compose (for running with Docker)

## Running the Application

### Option 1: Running with Docker (Recommended)

1. Ensure Docker and Docker Compose are installed on your system.

2. From the root project directory (where `docker-compose.yml` is located), run:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build and start the MySQL database container
   - Build and start the backend API container
   - The API will be available at `http://localhost:5000`

3. To stop the containers:
   ```bash
   docker-compose down
   ```

### Option 2: Running without Docker

1. **Setup Database:**
   - Install and start MySQL on your local machine
   - Create a database named `student_learning_db`
   - Run the SQL script located at `backend/db/student_learning_db.sql` to set up the tables and initial data

2. **Configure Environment:**
   - Copy `.env` file and update the database configuration:
     ```
     DB_HOST=localhost  # Change from 'db' to 'localhost'
     DB_USER=your_mysql_username
     DB_PASS=your_mysql_password
     DB_NAME=student_learning_db
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=1d
     PORT=5000
     ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Application:**
   - For development (with auto-restart):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

   The API will be available at `http://localhost:5000`

## API Endpoints

All endpoints return JSON responses. Authentication is required for most endpoints (marked with 🔐).

### Root
- **GET /** - Test endpoint to check if API is running
  - Response: `{ "message": "Backend API running..." }`

### Authentication
- **POST /api/auth/register** - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string", "city": "string }`
- **POST /api/auth/login** - Login user
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token", "user": {...} }`

### Users 🔐
- **GET /api/users/** - Get all users
- **GET /api/users/chart/:id** - Get chart data for a specific user
- **POST /api/users/** - Add a new user
  - Body: User data

### Progress 🔐
- **GET /api/progress/overview** - Get progress overview (percentage, milestones, modules, recommendations)
- **POST /api/progress/module/:moduleId/update** - Update progress for a specific module
- **GET /api/progress/chart** - Get time-series chart data
- **GET /api/progress/modules/bar** - Get bar chart data per module

### Modules 🔐
- **GET /api/modules/** - Get all modules
- **GET /api/modules/:moduleId** - Get specific module details
- **GET /api/modules/:moduleId/chapters** - Get all chapters for a module
- **GET /api/modules/:moduleId/chapters/:chapterId** - Get chapter content with subchapters
- **GET /api/modules/:moduleId/chapters/:chapterId/subchapters** - Get all subchapters of a chapter
- **GET /api/modules/:moduleId/chapters/:chapterId/subchapters/:subchapterId** - Get specific subchapter content
- **PUT /api/modules/:moduleId/chapters/:chapterId/subchapters/:subchapterId** - Update subchapter content

### Learning Paths 🔐
- **GET /api/learning-paths/** - Get all learning paths with their modules
- **GET /api/learning-paths/:learningpathId** - Get specific learning path with its modules

### Subscriptions (Langganan)
- **GET /api/langganan/** - Get all subscriptions
- **POST /api/langganan/** - Add a new subscription
- **PATCH /api/langganan/:id** - Update a subscription
- **DELETE /api/langganan/:id** - Delete a subscription

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Database Schema

The database schema is defined in `backend/db/student_learning_db.sql`. It includes tables for users, modules, chapters, subchapters, progress tracking, and more.

## Development

- The application uses ES6 modules (`"type": "module"` in package.json)
- CORS is enabled for cross-origin requests
- Input validation is implemented using express-validator
- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
