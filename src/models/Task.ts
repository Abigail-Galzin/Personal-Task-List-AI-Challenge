import { Priorities, Status, TaskFields, TaskOutput, TaskInput } from '../constants';

type Status = typeof Status[keyof typeof Status];
type Priorities = typeof Priorities[keyof typeof Priorities];

export class Task {
    readonly id: string = crypto.randomUUID();
    private title: string;
    private status: Status;
    private description: string;
    private dueDate: Date;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(taskInput: TaskInput) {
        this.title = taskInput.title;
        this.dueDate = Task.toDate(taskInput.dueDate);
        this.description = taskInput.description;
        this.status = Status.Pending;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static fromJSON(data: {
        id: string;
        title: string;
        status: Status;
        description: string;
        dueDate: string;
        createdAt: string;
        updatedAt: string;
    }): Task {
        const task = Object.create(Task.prototype) as Task;
        Object.assign(task, {
            id: data.id,
            title: data.title,
            status: data.status,
            description: data.description,
            dueDate: Task.toDate(data.dueDate),
            createdAt: Task.toDate(data.createdAt),
            updatedAt: Task.toDate(data.updatedAt),
        });

        return task;
    }

    updateTaskFields(taskFields: TaskFields): TaskOutput {
        Object.entries(taskFields).forEach(([key, value]) => {
            const normalized =
                key === 'dueDate' ? Task.toDate(value as Date | string) : value;
            (this as any)[key] = normalized;
        });
        this.updatedAt = new Date();

        return this.toOutput();
    }

    completeTask(): boolean {
        if (this.status === Status.Completed) {
            return false;
        }
        this.status = Status.Completed;
        return true;
    }

    reopenTask(): boolean {
        if (this.status === Status.Pending) {
            return false;
        }
        this.status = Status.Pending;
        return true;
    }

    private static toDate(value: Date | string): Date {
        return value instanceof Date ? value : new Date(value);
    }

    getStatus(): string {
        return this.status;
    }

    getDueDate(): Date {
        return this.dueDate;
    }

    getPriority(): Priorities {
        let priority: Priorities;
        const currentDate = new Date();
        const dueDate = Task.toDate(this.dueDate);
        const difference: number = dueDate.getTime() - currentDate.getTime();
        const hours: number = difference / (1000 * 60 * 60);

        if (hours < 0) {
            priority = Priorities.overdue;
        } else if (hours <= 24) {
            priority = Priorities.urgent
        } else {
            priority = Priorities.normal;
        }

        return priority;
    }

    public toOutput(): TaskOutput {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.getPriority(),
            dueDate: Task.toDate(this.dueDate).toISOString().split('T')[0] ?? this.dueDate.toString(),
            updatedAt: this.createdAt.toISOString().split('T')[0] ?? this.createdAt.toString(),
        }
    }
}
