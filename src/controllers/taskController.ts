import { Request, Response } from 'express';
import { ITaskService } from '../services/taskService';

export class TaskController {
    private taskService: ITaskService;

    constructor(taskService: ITaskService) {
        this.taskService = taskService;
    }

    createTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, dueDate, description } = req.body;

            //ToDo Validator
            if (!title || !dueDate) {
                res.status(400).json({ message: 'Title and dueDate are required.' });
                return;
            }
            const task = await this.taskService.createTask(title, new Date(dueDate), description);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    getAllTasks = async (req: Request, res: Response): Promise<void> => {
        try {
            const tasks = await this.taskService.getAllTasks();
            res.status(200).json(tasks);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
