import { Task } from '../models/Task';

export interface ITaskRepository {
    createTask(taskData: any): Task;
    getAll(): Task[];
}

export class TaskRepository implements ITaskRepository {
    private tasks: Task[] = [];

    constructor() {

    }

    createTask(taskData: any): Task {
        const newUser = new Task(taskData.title, taskData.dueDate, taskData.description);

        this.tasks.push(newUser);
        return newUser;
    }

    getAll(): Task[] {
        return this.tasks;
    }
}
