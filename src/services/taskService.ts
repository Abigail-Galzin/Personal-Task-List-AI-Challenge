import { ITaskRepository } from '../repositories/taskRepository';
import { Task } from '../models/Task';
import { TaskInput, TaskInputPut, TaskOutput } from '../constants';

export interface ITaskService {
    createTask(taskInput: TaskInput): Promise<TaskOutput>;
    getAllTasks(): Promise<TaskOutput[]>;
    updateStatus(id: string, completed: boolean): Promise<boolean | null>;
    updateTask(taskInput: TaskInputPut): Promise<TaskOutput | null>;
    deleteTask(id: string): Promise<boolean | null>;
}

export class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(taskInput: TaskInput): Promise<TaskOutput> {
        return await this.taskRepository.createTask(taskInput);
    }

    async getTask(id: string): Promise<Task | null> {
        if (id.length === 0) {
            return null;
        }
        return await this.taskRepository.getTask(id);
    }

    async getAllTasks(): Promise<TaskOutput[]> {
        return await this.taskRepository.getAll();
    }

    async updateStatus(id: string, completed: boolean): Promise<boolean | null> {
        const currentTask = await this.getTask(id);

        if (!currentTask) {
            return null;
        }

        return await this.taskRepository.updateTaskStatus(currentTask, completed);
    }

    async updateTask(taskInput: TaskInputPut): Promise<TaskOutput | null> {
        const currentTask = await this.getTask(taskInput.id);

        if (!currentTask) {
            return null;
        }

        const taskFields = Object.fromEntries(
            Object.entries(taskInput)
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
