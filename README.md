# Personal Task List API

## Project Overview & Architecture

This repository contains a Personal Task List API built strictly following Spec-Driven Development (SDD). It is a minimalist, stateless REST API with no authentication required, designed to implement only the behavior defined in the official contract.

The service stack is intentionally focused and production-oriented:

- Node.js
- TypeScript
- Express
- Jest
- Supertest

The codebase is organized around a conventional controller-service-repository flow with local JSON-file persistence for the challenge environment.

```text
SoftwareDevelopment/FirstChallenge/
├── README.md
├── package.json
├── tsconfig.json
├── jest.config.js
├── docs/
│   ├── vision.md
│   ├── user-stories.md
│   ├── data-model.md
│   └── openapi.yaml
├── src/
│   ├── controllers/
│   │   └── taskController.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── Task.ts
│   ├── repositories/
│   │   └── taskRepository.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   ├── services/
│   │   └── taskService.ts
│   ├── taskStorage.ts
│   ├── tasks.json
│   ├── constants.ts
│   ├── server.ts
│   └── index.ts
└── tests/
    ├── domain/
    │   └── task.test.ts
    ├── repositories/
    │   └── taskRepository.test.ts
    ├── services/
    │   └── taskService.test.ts
    └── controllers/
        └── taskController.test.ts
```

## Getting Started

### Prerequisites

```bash
Node.js 20 LTS or newer
npm 10+ (bundled with Node.js)
```

```bash
node -v
npm -v
```

### Installation

```bash
cd SoftwareDevelopment/FirstChallenge
npm install
```

### Environment Setup

No required environment variables are needed to run the project. The API works out of the box with defaults.

```bash
PORT=3000
NODE_ENV=development
```

`PORT` is optional and defaults to `3000` when not provided. `NODE_ENV` is also optional and only affects the error response detail level.

### Development Server

```bash
npm run dev
```

The local server starts on:

```text
http://localhost:3000
```

### Production Build and Start

```bash
npm run build && npm start
```

## Running Tests

### Automated Test Suite

Run the full Jest suite with:

```bash
npm test
```

Or, if you prefer the explicit script form:

```bash
npm run test
```

### Coverage Report

Generate coverage data with:

```bash
npm run test:coverage
```

The test suite is intentionally isolated across 4 layers:

- Domain Entities
- Repositories
- Services
- Controllers

## User Story Validation Guide

The running application is mounted at `http://localhost:3000/api/task`. The official SDD contract is documented in `docs/openapi.yaml` under `/task`; the commands below use the local runtime URL so they can be executed immediately.

### Manual Checks

1. Create a task with a description and due date.

```bash
curl -X POST http://localhost:3000/api/task \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish quarterly report",
    "description": "Compile the final figures and submit the report.",
    "dueDate": "2026-05-20"
  }'
```

Expected result:

```text
201 Created
```

The official contract accepts `title`, `description`, and `dueDate`;

1. Retrieve the full list of tasks.

```bash
curl http://localhost:3000/api/task
```

Expected result:

```text
200 OK
```

The response returns tasks sorted by urgency: `OVERDUE` first, then `URGENT`, then `NORMAL`.

1. Toggle the completed status of a task.

```bash
curl -X PATCH http://localhost:3000/api/task/task_123 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

Expected result:

```text
200 OK
```

Use `"completed": false` to reopen the task back to `PENDING`.

1. Update the task description.

```bash
curl -X PUT http://localhost:3000/api/task/task_123 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for the task."
  }'
```

Expected result:

```text
200 OK
```

The API persists the new description and refreshes `updatedAt`.

1. Delete a task permanently.

```bash
curl -X DELETE http://localhost:3000/api/task/task_123
```

Expected result:

```text
204 No Content
```

## Spec-Driven Development Compliance

This codebase introduces zero features outside the official `docs/openapi.yaml` contract. Every implemented endpoint, response shape, and validation rule is traceable to the published specification.

The Dynamic Priority rules are automatically evaluated and verified across the codebase:

- `OVERDUE` when the due date is in the past and the task is not completed
- `URGENT` when the due date is within the next 24 hours
- `NORMAL` when the due date is more than 24 hours away

Task status remains independent from priority, with `PENDING` as the default state and `COMPLETED` as the terminal user-controlled state.
