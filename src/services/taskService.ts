import { ITaskRepository } from '../repositories/taskRepository';
import { Task } from '../models/Task';

export interface ITaskService {
    createTask(title: string, dueDate: Date, description: string): Promise<Task>;
    getAllTasks(): Promise<Task[]>;
}

export class TaskService implements ITaskService{
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

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.getAll();
    }
}
