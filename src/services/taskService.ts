import { ITaskRepository } from '../repositories/taskRepository';
import { Task } from '../models/Task';

export interface ITaskService {
    createTask(title: string, dueDate: Date, description: string): Promise<Task>;
    getAllTasks(): Promise<Task[]>;
    updateStatus(id: string, completed: boolean): Promise<boolean | null>;
    updateTask(id: string, title: string, dueDate: Date, description: string): Promise<Task | null>;
    deleteTask(id: string): Promise<boolean | null>;
}

export class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(title: string, dueDate: Date, description: string): Promise<Task> {
        const taskData = {
            title: title,
            dueDate: dueDate,
            description: description
        }

        return await this.taskRepository.createTask(taskData);
    }

    async getTask(id: string): Promise<Task | null> {
        if (id.length === 0) {
            return null;
        }
        return await this.taskRepository.getTask(id);
    }

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.getAll();
    }

    async updateStatus(id: string, completed: boolean): Promise<boolean | null> {
        const currentTask = await this.getTask(id);

        if (!currentTask) {
            return null;
        }

        return await this.taskRepository.updateTaskStatus(currentTask, completed);
    }

    async updateTask(id: string, title: string, dueDate: Date, description: string): Promise<Task | null> {
        const currentTask = await this.getTask(id);

        if (!currentTask) {
            return null;
        }

        const taskFields = Object.fromEntries(
            Object.entries({ title, dueDate, description })
                .filter(([_, val]) => val !== null && val !== undefined)
        );

        return await this.taskRepository.updateTask(currentTask, taskFields);
    }

    async deleteTask(id: string): Promise<boolean | null> {
        const currentTask = await this.getTask(id);

        if (!currentTask) {
            return null;
        }

        return await this.taskRepository.deleteTask(id);
    }
}
