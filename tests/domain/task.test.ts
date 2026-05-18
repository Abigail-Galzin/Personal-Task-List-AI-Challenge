import { Task } from '../../src/models/Task';
import { Priorities, Status } from '../../src/constants';

describe('Task entity', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-05-18T12:00:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const buildTask = (overrides: Partial<{ title: string; dueDate: Date | string; description: string }> = {}): Task => {
        return new Task({
            title: overrides.title ?? 'Project report',
            dueDate: overrides.dueDate ?? '2026-05-20T12:00:00.000Z',
            description: overrides.description ?? 'Finish the quarterly report',
        });
    };

    it('instantiates a task with PENDING status by default', () => {
        const task = buildTask();

        expect(task.getStatus()).toBe(Status.Pending);
    });

    it('returns OVERDUE when the due date is in the past', () => {
        const task = buildTask({
            dueDate: '2026-05-18T11:00:00.000Z',
        });

        expect(task.getPriority()).toBe(Priorities.overdue);
    });

    it('returns URGENT when the due date is within the next 24 hours', () => {
        const task = buildTask({
            dueDate: '2026-05-19T08:00:00.000Z',
        });

        expect(task.getPriority()).toBe(Priorities.urgent);
    });

    it('returns NORMAL when the due date is more than 24 hours away', () => {
        const task = buildTask({
            dueDate: '2026-05-20T15:00:00.000Z',
        });

        expect(task.getPriority()).toBe(Priorities.normal);
    });

    it('moves from PENDING to COMPLETED and back using the state transition methods', () => {
        const task = buildTask();

        expect(task.completeTask()).toBe(true);
        expect(task.getStatus()).toBe(Status.Completed);

        expect(task.reopenTask()).toBe(true);
        expect(task.getStatus()).toBe(Status.Pending);
    });
});
