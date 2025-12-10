# CRUD Server

A backend server built with ExpressJS and TypeScript that provides CRUD (Create, Read, Update, Delete) operations for managing users.

## Features

- Create a user
- List users with basic filters (username, email, name, gender)
- Get details of a user
- Update user details
- Delete a user
- SQLite database for data persistence
- Comprehensive test suite (API, Unit, Performance, Security, Scalability)

## Prerequisites

- Node.js (v22.0.0 or higher)
- npm or yarn
- nvm use

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Running the Application

### Development Mode

Run the server in development mode with hot reload:

```bash
npm run dev
```

### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Testing

The project includes comprehensive test suites:

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm run test:unit      # Unit tests
npm run test:api       # API integration tests
```

### Run Tests with Coverage
```bash
npm run test:all
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Create User
- **POST** `/users`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "gender": "male",
    "bio": "Optional bio"
  }
  ```
- **Required fields:** `username`, `email`, `name`
- **Response:** Created user object with UUID

### List Users
- **GET** `/users`
- **Query Parameters:**
  - `username` (optional): Filter by username (partial match)
  - `email` (optional): Filter by email (partial match)
  - `name` (optional): Filter by name (partial match)
  - `gender` (optional): Filter by gender (exact match)
- **Example:** `GET /users?gender=male&name=John`
- **Response:** Array of user objects

### Get User Details
- **GET** `/users/:id`
- **Parameters:** `id` (UUID)
- **Response:** User object or 404 if not found

### Update User
- **PUT** `/users/:id`
- **Parameters:** `id` (UUID)
- **Body:**
  ```json
  {
    "username": "updated_username",
    "email": "newemail@example.com",
    "name": "Updated Name",
    "gender": "female",
    "bio": "Updated bio"
  }
  ```
- **Response:** Updated user object

### Delete User
- **DELETE** `/users/:id`
- **Parameters:** `id` (UUID)
- **Response:** 204 No Content on success, 404 if not found

## Example Usage

### Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "email": "john@example.com", "name": "John Doe", "gender": "male", "bio": "Software developer"}'
```

### List all users
```bash
curl http://localhost:3000/api/users
```

### List users with filters
```bash
curl http://localhost:3000/api/users?gender=male&name=John
```

### Get user by ID (UUID)
```bash
curl http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

### Update a user
```bash
curl -X PUT http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "bio": "Updated bio"}'
```

### Delete a user
```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

## Database

The application uses SQLite file-based database (`database.sqlite`) for data persistence. The database is initialized when the server starts and creates a `users` table with the following schema:

- `id` (TEXT, PRIMARY KEY, UUID)
- `username` (TEXT, NOT NULL, UNIQUE)
- `email` (TEXT, NOT NULL, UNIQUE)
- `name` (TEXT, NOT NULL)
- `gender` (TEXT, optional)
- `bio` (TEXT, optional)
- `createdAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `updatedAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
