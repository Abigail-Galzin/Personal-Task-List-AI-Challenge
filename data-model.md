classDiagram
class Task {
    -String id
    -String title
    -String status
    -String description
    -DateTime dueDate
    -DateTime createdAt
    -DateTime updatedAt
    +create()
    +update()
    +delete()
    +getPriority()
}
