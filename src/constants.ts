export const Priorities = {
    overdue: "OVERDUE",
    urgent: "URGENT",
    normal: "NORMAL",
} as const;

export const Status = {
    Pending: "PENDING",
    Completed: "COMPLETED"
} as const;

export type TaskFields = { [key: string]: string | Date; };

export interface TaskInput {
    title: string,
    dueDate: Date | string,
    description: string,
}

export interface TaskInputPut {
    id: string,
    title?: string,
    dueDate?: Date,
    description?: string,
}
export interface TaskOutput {
    id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    dueDate: string,
    createdAt: string,
    updatedAt: string,
}
