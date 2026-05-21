Role: Principal Backend Engineer & Automated Testing Expert
Context: Node.js + TypeScript + Jest + Supertest, and all the docs added in the docs folder
Pattern: Controller-Service-Repository + Domain Model Architecture

System Context & Business Rules:
We have built a Personal Task List API following the Controller-Service-Repository pattern. 
The system operates under strict Spec-Driven Development rules with the following domain entity properties and dynamic business logic:
- Task Properties: id, title, status ("PENDING", "COMPLETED"), description, dueDate, createdAt, updatedAt.
- Dynamic Priority Rules (Calculated in the domain class/service layer):
  * OVERDUE: Current time > dueDate (and status is "PENDING")
  * URGENT: dueDate - Current time <= 24 hours
  * PENDING: dueDate - Current time > 24 hours
- Collection Constraints: getAllTasks() must return an array sorted by urgency: OVERDUE -> URGENT -> PENDING.

Task:
Generate complete, production-ready unit test suites using Jest (and Supertest for the HTTP layer) for ALL four layers of the application based on the specifications provided below. Do not use placeholders, shorthand syntax, or "// TODO" comments. Write full test implementation blocks.

### LAYER 1: Domain Class Unit Tests (Task Entity)
- Target: Validate the Task class instances and methods (like getPriority() and state transitions).
- Test Cases to Write:
  1. Instantiate a task and verify default status is "PENDING".
  2. Verify getPriority() returns "OVERDUE" when dueDate is in the past.
  3. Verify getPriority() returns "URGENT" when dueDate is less than 24 hours in the future.
  4. Verify getPriority() returns "PENDING" when dueDate is more than 24 hours in the future.
  5. Test state transition method (e.g., toggling completed boolean changes status to "COMPLETED" or back to "PENDING").

### LAYER 2: Repository Layer Unit Tests
- Target: Validate data persistence access methods, assuming an in-memory array or database mock.
- Test Cases to Write:
  1. createTask() saves a new task and updates database state.
  2. getTask() returns a task if it exists, or null/undefined if it does not.
  3. getAll() retrieves all raw tasks.
  4. updateTaskStatus() update the status form the task.
  5. updateTask() update a list of taskFields allowing dinamic edition.
  4. deleteTask() removes the item permanently from storage.

### LAYER 3: Service Layer Unit Tests
- Target: Validate business logic, sorting behavior, and repository orchestration. Mock the Repository layer completely.
- Test Cases to Write:
  1. createTask() successfully invokes repository and returns the created task structure.
  2. getTask() retrieve a specific task based on the id
  3. getAllTasks() orchestrates collection retrieval and ensures the final array is explicitly sorted by urgency: OVERDUE -> URGENT -> PENDING.
  4. updateStatus() correctly throws an error or handles logic if a task does not exist.
  5. updateTask() handles logic to update all the fields sent as body in the task
  5. deleteTask() handles logic to remove the task from storage

### LAYER 4: Controller Layer Unit Tests (TaskController)
- Target: Validate HTTP request processing, response mapping, status codes, and input payload filtering. Mock the ITaskService interface entirely. Use Supertest or express mock request/response objects.
- Interface Methods to Mock/Support:
  * createTask(taskData: { title: string, dueDate: Date, description?: string }) -> Expect HTTP 201 Created
  * updateStatus(id: string, completed: boolean) -> Expect HTTP 200 OK
  * updateTask(taskData: { id: string, title?: string, dueDate?: Date, description?: string }) -> Expect HTTP 200 OK
  * getAllTasks() -> Expect HTTP 200 OK + Sorted Array Payload
  * deleteTask(id: string) -> Expect HTTP 204 No Content
- Test Cases to Write:
  1. POST /tasks with valid payload returns 201 and JSON object.
  2. POST /tasks with missing required fields (e.g., missing title) returns 400 Bad Request validation error.
  3. PATCH /tasks/:id with {"completed": true} returns 200 OK.
  4. GET /tasks returns 200 OK with the array payload.
  5. DELETE /tasks/:id returns 204 No Content.
  6. GET/PUT/PATCH /tasks/:id with a non-existent ID returns 404 Not Found.

---

Output requirements:
- Write clean, strongly-typed TypeScript code matching Jest standards (describe, test/it, expect).
- Use explicit mock typing (e.g., jest.mocked() or jest.Fn).
- Keep the tests highly isolated; no layer's test suite should execute real code from another layer.

taskController.ts taskService.ts taskRepository.ts Task.ts taskRoutes.ts. docs

----------------------------------------------------------------------------------------------------
Change the Role to: Senior Software Engineer & Clean Code Reviewer
Context: Refactoring and Quality Assurance for a Node.js + TypeScript REST API

I have implemented the code for my Personal Task List API. I need you to perform a comprehensive Code Review of the files I will provide below. 

Please analyze the code and provide constructive feedback focusing on the following areas:

1. Clean Code & Readability: Are the variable/function names intuitive? Is the code self-explanatory, or is it unnecessarily complex?
2. TypeScript Best Practices: Am I leveraging TypeScript's type safety correctly? Are there any hidden 'any' types or loose typings that could be improved?
3. Design Patterns: Does the separation of concerns between my layers (Controller, Service, Repository, Entity) hold up? Are any responsibilities leaking where they shouldn't?
4. Error Handling & Edge Cases: Am I handling potential failures gracefully (e.g., my storage connection issues, resource not found, invalid payloads)?
5. **Performance & Optimization:** Are there any redundant operations, bad loops, or async/await mistakes?

Format your response as follows:
- Strengths: What was done well.
- Issues Found: A list of specific lines or blocks that violate clean code or architecture principles, explaining *why*.
- Refactoring Proposals: Clear, actionable code snippets showing the "Before" vs "After" to improve the implementation.

Here is the code to review:
src
----------------------------------------------------------------------------------------------------
Role: Senior Technical Writer & DevOps Documentation Expert
Context: README Generation for a Spec-Driven Development (SDD) Challenge
Project: Personal Task List API (Node.js + TypeScript + Jest)

Task:
Generate a comprehensive, production-ready README.md file for my repository. The document must be clean, highly scannable, and clearly explain how to install, run, test, and validate the project. It needs to reflect a highly professional engineering mindset.

Please include the following sections with this exact structure:

1. ## Project Overview & Architecture
   - A brief, professional introduction explaining that this is a Personal Task List API built strictly following Spec-Driven Development (SDD).
   - Explicitly mention that it is a minimalist, stateless REST API with no authentication required.
   - Mention the tech stack: Node.js, TypeScript, Express, Jest, Supertest.
   - Include a visual ASCII tree diagram of the project structure showing the layout (including the /docs folder with vision.md, user-stories.md, data-model.md, openapi.yaml, and the src folder).

2. ## Getting Started
   - Provide clear bash/sh code blocks for:
     * Prerequisites (Node.js version, npm/yarn).
     * Installation steps (npm install).
     * Environment setup (if any, or state that it works out of the box with defaults).
     * Development server execution (npm run dev or equivalent).
     * Production build and start (npm run build && npm start).

3. ## Running Tests
   - Explain how to run the automated unit testing suite (npm run test or npm test).
   - Include a section on how to check test coverage if applicable (npm run test:coverage).
   - Mention that the test suite covers 4 isolated layers: Domain Entities, Repositories, Services, and Controllers.

4. ## User Story Validation Guide
   - Create a structured guide (preferably a markdown table or clean bullet points) showing the reviewer exactly how to manually validate each core user story using standard cURL commands or an HTTP client.
   - Include copy-pasteable cURL examples for:
     * POST /tasks (Creating a task with a description, complexity, and dueDate).
     * GET /tasks (Retrieving the full list, explicitly mentioning that it returns tasks sorted by urgency).
     * PATCH /tasks/:id (Toggling the completed status).
     * PUT /tasks/:id (Updating the task description).
     * DELETE /tasks/:id (Removing a task permanently).
   - Ensure the cURL examples use realistic JSON payloads (e.g., {"completed": true}).

5. ## Spec-Driven Development Compliance
   - A short concluding section emphasizing that the code introduces ZERO features outside of the official openapi.yaml contract.
   - Mention that all business rules regarding "Dynamic Priority" (OVERDUE, URGENT, PENDING) are automatically evaluated and verified.

---

Formatting Requirements:
- Use clear Markdown hierarchy (## for main sections, ### for subsections).
- Use code blocks for all terminal commands and file paths.
- Keep the tone authoritative, direct, and focused on clean software engineering practices.
- Do not use generic placeholders like "[Insert text here]". Use generic but functional defaults (like localhost:3000 for URLs).

FirstChallenge