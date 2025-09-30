# TODO List API

A simple REST API for managing a todo list, built with Node.js and Express.

## Features

- Create, read, update, and delete tasks
- Reorder tasks
- In-memory storage (data is not persisted)

## Task Structure

Each task has the following properties:
- `id` (number) - Unique identifier, auto-generated
- `task` (string) - Task description (required)
- `completed` (boolean) - Completion status (default: false)
- `completionDate` (string|null) - Optional completion date

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000` by default. You can set a custom port using the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## API Endpoints

### Get All Tasks

**GET** `/tasks`

Returns an array of all tasks.

**Example Response:**
```json
[
  {
    "id": 1,
    "task": "Buy groceries",
    "completed": false,
    "completionDate": null
  },
  {
    "id": 2,
    "task": "Finish project",
    "completed": true,
    "completionDate": "2024-01-15"
  }
]
```

### Get a Single Task

**GET** `/tasks/:id`

Returns a single task by ID.

**Example Response:**
```json
{
  "id": 1,
  "task": "Buy groceries",
  "completed": false,
  "completionDate": null
}
```

### Create a New Task

**POST** `/tasks`

Creates a new task.

**Request Body:**
```json
{
  "task": "Buy groceries",
  "completed": false,
  "completionDate": "2024-01-20"
}
```

- `task` (required): Task description
- `completed` (optional): Completion status (default: false)
- `completionDate` (optional): Completion date (default: null)

**Example Response:**
```json
{
  "id": 1,
  "task": "Buy groceries",
  "completed": false,
  "completionDate": "2024-01-20"
}
```

### Update a Task

**PUT** `/tasks/:id`

Updates an existing task.

**Request Body:**
```json
{
  "task": "Buy groceries and cook dinner",
  "completed": true,
  "completionDate": "2024-01-15"
}
```

All fields are optional. Only provided fields will be updated.

**Example Response:**
```json
{
  "id": 1,
  "task": "Buy groceries and cook dinner",
  "completed": true,
  "completionDate": "2024-01-15"
}
```

### Delete a Task

**DELETE** `/tasks/:id`

Deletes a task by ID.

**Example Response:**
```json
{
  "id": 1,
  "task": "Buy groceries",
  "completed": false,
  "completionDate": null
}
```

### Reorder Tasks

**PATCH** `/tasks/reorder`

Changes the order of tasks.

**Request Body:**
```json
{
  "order": [3, 1, 2]
}
```

- `order` (required): Array of task IDs in the desired order. Must contain all task IDs.

**Example Response:**
```json
[
  {
    "id": 3,
    "task": "Task 3",
    "completed": false,
    "completionDate": null
  },
  {
    "id": 1,
    "task": "Task 1",
    "completed": false,
    "completionDate": null
  },
  {
    "id": 2,
    "task": "Task 2",
    "completed": true,
    "completionDate": "2024-01-15"
  }
]
```

## Error Responses

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Example Error Response:**
```json
{
  "error": "Task not found"
}
```

## Testing the API

You can test the API using curl, Postman, or any HTTP client.

### Example curl commands:

```bash
# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy groceries", "completed": false}'

# Get all tasks
curl http://localhost:3000/tasks

# Get a single task
curl http://localhost:3000/tasks/1

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy groceries and cook dinner", "completed": true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1

# Reorder tasks
curl -X PATCH http://localhost:3000/tasks/reorder \
  -H "Content-Type: application/json" \
  -d '{"order": [2, 1, 3]}'
```
