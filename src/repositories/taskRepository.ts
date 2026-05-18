import { Task } from '../models/Task';
import { TaskFields } from '../constants';
import { taskStorage } from '../taskStorage';
export interface ITaskRepository {
    createTask(taskData: any): Task;
    getTask(id: string): Task | null;
    getAll(): Task[];
    updateTaskStatus(task: Task, completed: boolean): boolean;
    updateTask(task: Task, taskFields: TaskFields): Task;
    deleteTask(id:string): boolean;
};

export class TaskRepository implements ITaskRepository {
    private tasks: Task[] = taskStorage.load();;

    constructor() {

    }

    createTask(taskData: any): Task {
        const newTask = new Task(taskData.title, taskData.dueDate, taskData.description);

        this.tasks.push(newTask);
        taskStorage.save(this.tasks);
        return newTask;
    }

    getTask(id: string): Task | null {
        return this.tasks.find((task => task.id == id)) ?? null;
    }

    getAll(): Task[] {
        return this.tasks;
    }

    updateTaskStatus(task: Task, completed: boolean): boolean {
        const updated = completed ? task.completeTask() : task.reopenTask();
        taskStorage.save(this.tasks);
        return updated;
    }

    updateTask(task: Task, taskFields: TaskFields): Task {
        const updated = task.updateTaskFields(taskFields);
        taskStorage.save(this.tasks);
        return updated;
    }

    deleteTask(id:string): boolean {
        let taskSize = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        taskStorage.save(this.tasks);
        console.log(this.tasks);
        return taskSize - 1 === this.tasks.length;
    }
}
