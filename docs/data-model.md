classDiagram
class Task {
    -String id
    -String title
    -String status // "PENDING" | "COMPLETED"
    -String description
    -DateTime dueDate
    -DateTime createdAt
    -DateTime updatedAt
    +create()
    +update()
    +delete()
    +getPriority() // returns "OVERDUE" | "URGENT" | "NORMAL"
}
