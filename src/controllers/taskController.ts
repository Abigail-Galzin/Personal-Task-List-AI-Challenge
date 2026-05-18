import { Request, Response } from 'express';
import { ITaskService } from '../services/taskService';
import { Status } from '../constants';

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

    updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { completed } = req.body;

            const updated = await this.taskService.updateStatus(id?.toString() ?? '', completed);

            if(updated === null) {
                res.status(404).json({ message: 'Task not found.' });
                return;
            }

            const status = completed ? Status.Completed : Status.Completed;
            if (!updated) {
                res.status(400).json({ message: `Task already ${status}.` });
                return;
            }
            res.status(200).json({ message:  `Task updated to ${status}.` });
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
