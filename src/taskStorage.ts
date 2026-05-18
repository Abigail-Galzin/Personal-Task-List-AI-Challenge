import * as fs from 'fs';
import * as path from 'path';
import { Task } from './models/Task';

const FILE_PATH = path.join(__dirname, 'tasks.json');

export const taskStorage = {
    save(tasks: Task[]): void {
        fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
    },

    load(): Task[] {
        if (!fs.existsSync(FILE_PATH)) {
            return [];
        }
        const fileData = fs.readFileSync(FILE_PATH, 'utf-8');
        const rawTasks = JSON.parse(fileData) as Parameters<typeof Task.fromJSON>[0][];
        return rawTasks.map((data) => Task.fromJSON(data));
    }
};
