import { Priorities, Status, TaskFields } from '../constants';

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

  constructor(title: string, dueDate: Date, description: string = '') {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
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
      dueDate: new Date(data.dueDate),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return task;
  }

  getStatus(): string {
    return this.status;
  }

  updateTaskFields(taskFields: TaskFields): Task {
    Object.entries(taskFields).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
    this.updatedAt = new Date();

    return this;
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
}
