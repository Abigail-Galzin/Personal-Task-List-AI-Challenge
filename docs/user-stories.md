# Spec: Task Core & Dynamic Priority

## Business Rules
- **Status:** "PENDING", "COMPLETED".
- **Priority:** Calculated dynamically based on `dueDate` ("URGENT", "NORMAL", "OVERDUE").

## Acceptance Criteria

1. **Feature 1: Task Creation**  
    As a user, I want to create a task with a title, description and due date so that I can organize and prioritize my personal work efficiently.  

    Scenario: Successful task creation with valid data  
    Given the API is running and the database is accessible  
    When a POST request is sent to /task with a valid description  
    Then the system should return a 201 Created status code  
    And the response body must include a unique ID and the initial status as "PENDING".  

    Scenario: Reject task creation with invalid data  
    When a POST request is sent to /task with an invalid field value  
    Then the system should return a 400 Bad Request status code  
    And the response body should contain a validation error message indicating valid the corresponding error.  

2. **Feature 2: State Management**  

    As a user, I want to mark a task as complete so that I can track finished work.

    Scenario: Successfully mark a task as complete  
    Given an existing task with ID {id} and status "PENDING"  
    When a PATCH request is sent to /task/{id} with the field completed: true  
    Then the system should return a 200 OK  
    And the task's status in the database must reflect "COMPLETED".  

    Scenario: Attempt to complete a non-existing task
    Given no task exists with the provided id
    When a PATCH request is sent to /task/{id}
    Then the system should return a 404 Not Found status code
    And the response body should contain an error message indicating the task was not found.

3. **Feature 3: Edit Task**  

    As a user, I want to edit the description | title | dueDate (field) of a task so that I can keep task details accurate and updated.  

    Scenario: Successfully update task (field)  
    Given an existing task with ID {id}  
    When a PUT request is sent to /task/{id} with a new (field) text  
    Then the system should return a 200 OK status code  
    And the response body should include: the same task id, updated (field), updatedAt timestamp  
    And the new description must be persisted in the database.  

    Scenario: Reject update with empty (field)  
    Given an existing task with ID {id}  
    When a PUT request is sent to /task/{id} with an empty (field)  
    Then the system should return a 400 Bad Request status code  
    And the response body should contain a validation error message.  

4. **Feature 4: Delete Task (Delete)**  

    As a user, I want to delete a task so that I can remove tasks that are no longer relevant.  

    Scenario: Successfully delete a task  
    Given an existing task with ID {id}  
    When a DELETE request is sent to /task/{id}  
    Then the system should return a 204 No Content status code  
    And the task must be permanently removed from the database.  

    Scenario: Attempt to delete a non-existing task  
    Given no task exists with ID {id}  
    When a DELETE request is sent to /task/{id}  
    Then the system should return a 404 Not Found status code  
    And the response body should contain an error message indicating the task was not found.  

5. **Feature 5: Dynamic Priority Evaluation (Due Date Constraints)**
    As a system background process  
    I want to dynamically evaluate a task's priority based on the current time and its `dueDate`  
    So that the user always sees real-time accurate urgency statuses.  
    **Business Rules & Constraints:**  
    - OVERDUE: Current Time $>$ dueDate (and status is not COMPLETED).
    - URGENT: dueDate $-$ Current Time $\le$ 24 hours.  
    - NORMAL: dueDate $-$ Current Time $>$ 24 hours.  

    Scenario: Task priority is OVERDUE when current time > `dueDate`  
    Given a task exists with a `dueDate` that has already passed  
    When a GET request is sent to /task/{id}  
    Then the system should return 200 OK status code  
    And the response body's priority field must be "OVERDUE".  

    Scenario: Task priority is URGENT when `dueDate` is within 24 hours  
    Given a task exists with a dueDate less than 24 hours from the current time  
    When a GET request is sent to /task/{id}  
    Then the system should return 200 OK status code  
    And the response body's priority field must be "URGENT".  

    Scenario: Task priority is NORMAL when `dueDate` is more than 24 hours away  
    Given a task exists with a `dueDate` more than 24 hours from current time  
    When a GET request is sent to /task/{id}  
    Then the system should return 200 OK status code  
    And the response body's priority field must be "NORMAL".  

6. **Feature 6: Retrieve Task List**  
    As a user, I want to retrieve all my tasks in a single list. So that I can see my overall workload ordered by urgency.  

    Scenario: Successfully retrieve all tasks ordered by urgency  
    Given multiple tasks exist in the system with varying due dates  
    When a GET request is sent to /task  
    Then the system should return 200 OK status code  
    And the response body must contain an array of all tasks  
    And the tasks must be automatically sorted in descending order of urgency  
        (OVERDUE $\rightarrow$ URGENT $\rightarrow$ NORMAL).  


**Valid Description (example):**  

    | title       | "Project Report"        |
    | description | "Finish project report" |
    | dueDate     | "2026-05-20T12:00:00Z"  |

**Business Rules**  
- title is required during task creation.
- Newly created tasks must start with status "PENDING".
- Dynamic priority must be calculated using getPriority().
- If dueDate < currentDateTime, priority must be "OVERDUE".
- If dueDate <= next 24 hours, priority must be "URGENT".
- Otherwise, priority must be "NORMAL".
- Status and priority are independent fields.
