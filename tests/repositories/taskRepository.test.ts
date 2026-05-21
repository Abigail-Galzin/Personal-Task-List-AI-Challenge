import { Task } from '../../src/models/Task';
import { taskStorage } from '../../src/taskStorage';
import { TaskRepository } from '../../src/repositories/taskRepository';
import { Status, Priorities } from '../../src/constants';

jest.mock('../../src/taskStorage', () => ({
    taskStorage: {
        load: jest.fn(),
        save: jest.fn(),
    },
}));

const mockedTaskStorage = jest.mocked(taskStorage);

describe('TaskRepository', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-05-18T12:00:00.000Z'));
        mockedTaskStorage.load.mockReturnValue([]);
        mockedTaskStorage.save.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    const buildTask = (overrides: Partial<{ title: string; dueDate: Date | string; description: string }> = {}): Task => {
        return new Task({
            title: overrides.title ?? 'Project report',
            dueDate: overrides.dueDate ?? '2026-05-20T12:00:00.000Z',
            description: overrides.description ?? 'Finish the quarterly report',
        });
    };

    it('createTask saves a new task and updates the storage state', () => {
        const repository = new TaskRepository();

        const output = repository.createTask({
            title: 'Write tests',
            dueDate: '2026-05-19T12:00:00.000Z',
            description: 'Cover the full API surface',
        });

        expect(output).toMatchObject({
            title: 'Write tests',
            description: 'Cover the full API surface',
            status: Status.Pending,
            priority: Priorities.urgent,
        });
        expect(mockedTaskStorage.save).toHaveBeenCalledTimes(1);

        const savedTasks = mockedTaskStorage.save.mock.calls[0][0];
        expect(savedTasks).toHaveLength(1);
        expect(savedTasks[0]).toBeInstanceOf(Task);
        expect(savedTasks[0].toOutput()).toMatchObject({
            title: 'Write tests',
        });
    });

    it('getTask returns an existing task or null when it is missing', () => {
        const existingTask = buildTask({
            title: 'Existing task',
        });
        mockedTaskStorage.load.mockReturnValue([existingTask]);

        const repository = new TaskRepository();

        expect(repository.getTask(existingTask.id)).toBe(existingTask);
        expect(repository.getTask('missing-id')).toBeNull();
    });

    it('getAll retrieves every stored task as raw task outputs', () => {
        const taskOne = buildTask({
            title: 'Task one',
            dueDate: '2026-05-20T12:00:00.000Z',
        });
        const taskTwo = buildTask({
            title: 'Task two',
            dueDate: '2026-05-19T08:00:00.000Z',
        });
        mockedTaskStorage.load.mockReturnValue([taskOne, taskTwo]);

        const repository = new TaskRepository();
        const results = repository.getAll();

        expect(results).toHaveLength(2);
        expect(results).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: taskOne.id,
                    title: 'Task one',
                    status: Status.Pending,
                }),
                expect.objectContaining({
                    id: taskTwo.id,
                    title: 'Task two',
                    status: Status.Pending,
                }),
            ]),
        );
    });

    it('updateTaskStatus updates the task status and persists the array', () => {
        const task = buildTask({
            title: 'Toggle status',
        });
        mockedTaskStorage.load.mockReturnValue([task]);

        const repository = new TaskRepository();
        const updated = repository.updateTaskStatus(task, true);

        expect(updated).toBe(true);
        expect(task.getStatus()).toBe(Status.Completed);
        expect(mockedTaskStorage.save).toHaveBeenCalledTimes(1);

        const savedTasks = mockedTaskStorage.save.mock.calls[0][0];
        expect(savedTasks[0].getStatus()).toBe(Status.Completed);
    });

    it('updateTask updates dynamic task fields and refreshes updatedAt', () => {
        const task = buildTask({
            title: 'Old title',
            description: 'Old description',
            dueDate: '2026-05-20T12:00:00.000Z',
        });
        mockedTaskStorage.load.mockReturnValue([task]);

        const repository = new TaskRepository();
        const beforeUpdate = task.toOutput();
        jest.setSystemTime(new Date('2026-05-18T13:30:00.000Z'));

        const updated = repository.updateTask(task, {
            title: 'New title',
            description: 'New description',
            dueDate: new Date('2026-05-21T12:00:00.000Z'),
        });

        expect(updated).toMatchObject({
            title: 'New title',
            description: 'New description',
            priority: Priorities.normal,
        });
        expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
            new Date(beforeUpdate.updatedAt).getTime(),
        );
        expect(mockedTaskStorage.save).toHaveBeenCalledTimes(1);
    });

    it('deleteTask removes the task from storage permanently', () => {
        const taskOne = buildTask({
            title: 'Delete me',
        });
        const taskTwo = buildTask({
            title: 'Keep me',
            dueDate: '2026-05-21T12:00:00.000Z',
        });
        mockedTaskStorage.load.mockReturnValue([taskOne, taskTwo]);

        const repository = new TaskRepository();
        const deleted = repository.deleteTask(taskOne.id);

        expect(deleted).toBe(true);
        expect(repository.getTask(taskOne.id)).toBeNull();
        expect(mockedTaskStorage.save).toHaveBeenCalledTimes(1);

        const persistedTasks = mockedTaskStorage.save.mock.calls[0][0];
        expect(persistedTasks).toHaveLength(1);
        expect(persistedTasks[0].id).toBe(taskTwo.id);
    });
});
