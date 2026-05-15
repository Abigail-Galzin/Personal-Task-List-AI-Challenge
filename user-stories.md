# Spec: Task Core & Dynamic Priority

## Business Rules
- **Complexity:** "LOW", "MEDIUM", "HIGH" (Default: "LOW").
- **Priority:** Calculated dynamically based on `dueDate` ("URGENT" < 24h, "HIGH" < 72h, etc.).

## Acceptance Criteria

1. **Feature 1: Task Creation**  
    As a user, I want to create a task with a title, description, complexity, and due date so that I can organize and prioritize my personal work efficiently.  

    Scenario: Successful task creation with valid data  
    Given the API is running and the database is accessible  
    When a POST request is sent to /tasks with a valid description  
    Then the system should return a 201 Created status code  
    And the response body must include a unique ID and the initial status as "PENDING".  

    Scenario: Reject task creation with invalid data  
    When a POST request is sent to /tasks with an invalid complexity value  
    Then the system should return a 400 Bad Request status code  
    And the response body should contain a validation error message indicating valid the corresponding error.  

2. **Feature 2: State Management**  

    As a user, I want to mark a task as complete so that I can track finished work.

    Scenario: Successfully mark a task as complete  
    Given an existing task with ID {id} and status "PENDING"  
    When a PATCH request is sent to /tasks/{id} with the field completed: true  
    Then the system should return a 200 OK  
    And the task's status in the database must reflect "COMPLETED".  

    Scenario: Attempt to complete a non-existing task
    Given no task exists with the provided id
    When a PATCH request is sent to /tasks/{id}
    Then the system should return a 404 Not Found status code
    And the response body should contain an error message indicating the task was not found.

3. **Feature 3: Edit Task**  

    As a user, I want to edit the description/title/status(field) of a task so that I can keep task details accurate and updated.  

    Scenario: Successfully update task (field)  
    Given an existing task with ID {id}  
    When a PUT request is sent to /tasks/{id} with a new (field) text  
    Then the system should return a 200 OK status code  
    And the response body should include: the same task id, updated (field), updatedAt timestamp.  
    And the new description must be persisted in the database.  

    Scenario: Reject update with empty (field)  
    Given an existing task with ID {id}  
    When a PUT request is sent to /tasks/{id} with an empty (field)  
    Then the system should return a 400 Bad Request status code  
    And the response body should contain a validation error message.  

4. **Feature 4: Delete Task (Delete)**  

    As a user, I want to delete a task so that I can remove tasks that are no longer relevant.  

    Scenario: Successfully delete a task  
    Given an existing task with ID {id}  
    When a DELETE request is sent to /tasks/{id}  
    Then the system should return a 204 No Content status code  
    And the task must be permanently removed from the database.  

    Scenario: Attempt to delete a non-existing task  
    Given no task exists with ID {id}  
    When a DELETE request is sent to /tasks/{id}  
    Then the system should return a 404 Not Found status code  
    And the response body should contain an error message indicating the task was not found.  

5. **Feature 5: Retrieve Task with Dynamic Priority**  
    As a user, I want the system to automatically calculate task priority based on the due date so that I can immediately identify urgent or overdue tasks.  

    Scenario: Task priority is URGENT when due date is within 24 hours  
    Given a task exists with a `dueDate` less than 24 hours from the current system time  
    When a GET request is sent to /tasks/{id}  
    Then the system should return 200 OK status code  
    And the response body should include:  
       - the task information  
       - the calculated priority as "URGENT"  

    Scenario: Task priority is OVERDUE when due date has passed  
    Given a task exists with a `dueDate` earlier than the current system time  
    When a GET request is sent to /tasks/{id}  
    Then the system should return 200 OK status code  
    And the response body should include:  
       - the task information  
       - the calculated priority as "OVERDUE".  

    Scenario: Task priority is PENDING when due date is more than 24 hours away  
    Given a task exists with a `dueDate` egreater than 24 hours from the current system time  
    When a GET request is sent to /tasks/{id}  
    Then the system should return 200 OK status code  
    And the response body should include:  
       - the task information  
       - the calculated priority as "PENDING".  

**Valid Description:**  

    | description | "Finish project report" |
    | complexity  | "HIGH"                  |
    | dueDate     | "2026-05-20T12:00:00Z"  |

**Business Rules**  
- title is required during task creation.
- complexity only accepts:
    LOW
    MEDIUM
    HIGH
- Newly created tasks must start with status "PENDING".
- Dynamic priority must be calculated at request time using getPriority().
- If dueDate < currentDateTime, priority must be "OVERDUE".
- If dueDate <= next 24 hours, priority must be "URGENT".
- Otherwise, priority must be "PENDING".