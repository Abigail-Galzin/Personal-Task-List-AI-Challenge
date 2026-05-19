import { Task } from '../models/Task';
import { TaskFields, TaskInput, TaskOutput } from '../constants';
import { taskStorage } from '../taskStorage';
export interface ITaskRepository {
    createTask(taskData: TaskInput): TaskOutput;
    getTask(id: string): Task | null;
    getAll(): TaskOutput[];
    updateTaskStatus(task: Task, completed: boolean): boolean;
    updateTask(task: Task, taskFields: TaskFields): TaskOutput;
    deleteTask(id: string): boolean;
};

export class TaskRepository implements ITaskRepository {
    private tasks: Task[];

    constructor() {
        this.tasks = taskStorage.load();
    }

    createTask(taskInput: TaskInput): TaskOutput {
        const newTask = new Task(taskInput);

        this.tasks.push(newTask);
        taskStorage.save(this.tasks);
        return newTask.toOutput();
    }

    getTask(id: string): Task | null {
        return this.tasks.find((task => task.id == id)) ?? null;
    }

    getAll(): TaskOutput[] {
        return this.tasks.map(task => task.toOutput());
    }

    updateTaskStatus(task: Task, completed: boolean): boolean {
        const updated = completed ? task.completeTask() : task.reopenTask();
        taskStorage.save(this.tasks);
        return updated;
    }

    updateTask(task: Task, taskFields: TaskFields): TaskOutput {
        const updated = task.updateTaskFields(taskFields);
        taskStorage.save(this.tasks);
        return updated;
    }

    deleteTask(id: string): boolean {
        let taskSize = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        taskStorage.save(this.tasks);
        return taskSize - 1 === this.tasks.length;
    }
}
