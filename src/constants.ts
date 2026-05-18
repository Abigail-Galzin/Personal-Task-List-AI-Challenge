export const Priorities = {
    overdue : "OVERDUE",
    urgent : "URGENT",
    normal : "NORMAL",
} as const;

export const Status = {
    Pending: "PENDING",
    Completed: "COMPLETED"
} as const;

export type TaskFields = { [key: string]: string | Date; };
