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

            if (typeof title !== 'string' || title.trim() === '') {
                res.status(400).json({ message: 'Title is required.' });
                return;
            }

            if (typeof dueDate !== 'string' || Number.isNaN(Date.parse(dueDate))) {
                res.status(400).json({ message: 'dueDate must be a valid date string.' });
                return;
            }

            const task = await this.taskService.createTask({
                title: title.trim(),
                dueDate: dueDate,
                description: typeof description === 'string' ? description.trim() : ''
            });
            res.status(201).json(task);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    getTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: 'Invalid data request.' });
                return;
            }

            const task = await this.taskService.getTask(id?.toString());

            if (!task) {
                res.status(404).json({ message: 'Task not found.' });
                return;
            }

            res.status(200).json(task);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { completed } = req.body;

            const updated = await this.taskService.updateStatus(id?.toString() ?? '', completed);

            if (updated === null) {
                res.status(404).json({ message: 'Task not found.' });
                return;
            }

            const status = completed ? Status.Completed : Status.Pending;
            if (!updated) {
                res.status(400).json({ message: `Invalid request: Task already ${status}.` });
                return;
            }
            res.status(200).json({ message: `Task updated to ${status}.` });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    updateTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, dueDate, description } = req.body;

            if (!id || (!title && !dueDate && !description)) {
                res.status(400).json({ message: 'Invalid data request.' });
                return;
            }

            const taskUpdated = await this.taskService.updateTask({
                id: id?.toString() ?? '',
                title,
                dueDate,
                description
            });

            if (taskUpdated === null) {
                res.status(404).json({ message: 'Task not found.' });
                return;
            }

            res.status(200).json(taskUpdated);
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

    deleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: 'Invalid data request.' });
                return;
            }

            const deleted = await this.taskService.deleteTask(id?.toString() ?? '');

            if (deleted === null) {
                res.status(404).json({ message: 'Task not found.' });
                return;
            }
            deleted ? res.sendStatus(204) : res.status(500).json({ message: 'Task was not deleted.' });
            return;
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
