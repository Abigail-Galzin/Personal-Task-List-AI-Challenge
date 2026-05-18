import {Priorities, Status } from '../constants';

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

  constructor(title: string, dueDate:Date, description: string = '') {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.status = Status.Pending;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
