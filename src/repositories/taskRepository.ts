import { Task } from '../models/Task';
import { TaskFields } from '../constants';
export interface ITaskRepository {
    createTask(taskData: any): Task;
    getTask(id: string): Task | null;
    getAll(): Task[];
    updateTaskStatus(task: Task, completed: boolean): boolean;
    updateTask(task: Task, taskFields: TaskFields): Task;
};

export class TaskRepository implements ITaskRepository {
    private tasks: Task[] = [];

    constructor() {

    }

    createTask(taskData: any): Task {
        const newUser = new Task(taskData.title, taskData.dueDate, taskData.description);

        this.tasks.push(newUser);
        return newUser;
    }

    getTask(id: string): Task | null {
        return this.tasks.find((task => task.id == id)) ?? null;
    }

    getAll(): Task[] {
        return this.tasks;
    }

    updateTaskStatus(task: Task, completed: boolean): boolean {
        return completed ? task.completeTask() : task.reopenTask();
    }

    updateTask(task: Task, taskFields: TaskFields): Task {
        return task.updateTaskFields(taskFields);
    }
}
