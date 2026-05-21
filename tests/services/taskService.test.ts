import { Task } from '../../src/models/Task';
import { TaskService } from '../../src/services/taskService';
import { ITaskRepository } from '../../src/repositories/taskRepository';
import { Priorities, Status } from '../../src/constants';

describe('TaskService', () => {
    const createRepositoryMock = (): jest.Mocked<ITaskRepository> => ({
        createTask: jest.fn(),
        getTask: jest.fn(),
        getAll: jest.fn(),
        updateTaskStatus: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
    });

    const buildTask = (overrides: Partial<{ title: string; dueDate: Date | string; description: string }> = {}): Task => {
        return new Task({
            title: overrides.title ?? 'Project report',
            dueDate: overrides.dueDate ?? '2026-05-20T12:00:00.000Z',
            description: overrides.description ?? 'Finish the quarterly report',
        });
    };

    const buildTaskOutput = (
        overrides: Partial<{
            id: string;
            title: string;
            description: string;
            status: string;
            priority: string;
            dueDate: string;
            createdAt: string;
            updatedAt: string;
        }> = {},
    ) => ({
        id: overrides.id ?? 'task-1',
        title: overrides.title ?? 'Project report',
        description: overrides.description ?? 'Finish the quarterly report',
        status: overrides.status ?? Status.Pending,
        priority: overrides.priority ?? Priorities.normal,
        dueDate: overrides.dueDate ?? '2026-05-20T12:00:00.000Z',
        createdAt: overrides.createdAt ?? '2026-05-18T12:00:00.000Z',
        updatedAt: overrides.updatedAt ?? '2026-05-18T12:00:00.000Z',
    });

    it('createTask invokes the repository and returns the created task output', async () => {
        const repository = createRepositoryMock();
        const service = new TaskService(repository);
        const taskInput = {
            title: 'Write tests',
            dueDate: new Date('2026-05-19T12:00:00.000Z'),
            description: 'Cover the full API surface',
        };
        const createdTask = buildTaskOutput({
            id: 'task-created',
            title: taskInput.title,
            description: taskInput.description,
            dueDate: taskInput.dueDate.toISOString(),
            priority: Priorities.urgent,
        });
        repository.createTask.mockResolvedValue(createdTask);

        const result = await service.createTask(taskInput);

        expect(repository.createTask).toHaveBeenCalledWith(taskInput);
        expect(result).toEqual(createdTask);
    });

    it('getTask retrieves a task by id', async () => {
        const repository = createRepositoryMock();
        const service = new TaskService(repository);
        const task = buildTask({
            title: 'Find me',
        });
        repository.getTask.mockResolvedValue(task);

        const result = await service.getTask(task.id);

        expect(repository.getTask).toHaveBeenCalledWith(task.id);
        expect(result).toBe(task);
    });

    it('getAllTasks sorts tasks by urgency and then by due date', async () => {
        const repository = createRepositoryMock();
        const service = new TaskService(repository);
        const overdue = buildTaskOutput({
            id: 'overdue',
            priority: Priorities.overdue,
            dueDate: '2026-05-17T12:00:00.000Z',
        });
        const urgent = buildTaskOutput({
            id: 'urgent',
            priority: Priorities.urgent,
            dueDate: '2026-05-18T18:00:00.000Z',
        });
        const normal = buildTaskOutput({
            id: 'normal',
            priority: Priorities.normal,
            dueDate: '2026-05-21T12:00:00.000Z',
        });
        repository.getAll.mockResolvedValue([overdue, normal, urgent]);

        const result = await service.getAllTasks();

        expect(repository.getAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual([overdue, urgent, normal]);
    });

    it('updateStatus returns null when the task does not exist', async () => {
        const repository = createRepositoryMock();
        const service = new TaskService(repository);
        repository.getTask.mockResolvedValue(null);

        const result = await service.updateStatus('missing-id', true);

        expect(repository.getTask).toHaveBeenCalledWith('missing-id');
        expect(repository.updateTaskStatus).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('updateTask forwards all provided fields to the repository', async () => {
        const repository = createRepositoryMock();
        const service = new TaskService(repository);
        const task = buildTask({
            title: 'Original title',
        });
        const updatedTask = buildTaskOutput({
            id: task.id,
            title: 'Updated title',
            description: 'Updated description',
            dueDate: '2026-05-22T12:00:00.000Z',
            priority: Priorities.normal,
        });

        repository.getTask.mockResolvedValue(task);
        repository.updateTask.mockResolvedValue(updatedTask);

        const result = await service.updateTask({
            id: task.id,
            title: 'Updated title',
            description: 'Updated description',
            dueDate: new Date('2026-05-22T12:00:00.000Z'),
        });

        expect(repository.getTask).toHaveBeenCalledWith(task.id);
        expect(repository.updateTask).toHaveBeenCalledWith(task, {
            title: 'Updated title',
            description: 'Updated description',
            dueDate: new Date('2026-05-22T12:00:00.000Z'),
        });
        expect(result).toEqual(updatedTask);
    });

    it('deleteTask removes a task from storage when the task exists', async () => {
        const repository = createRepositoryMock();
        const service = new TaskService(repository);
        const task = buildTask({
            title: 'Remove me',
        });

        repository.getTask.mockResolvedValue(task);
        repository.deleteTask.mockResolvedValue(true);

        const result = await service.deleteTask(task.id);

        expect(repository.getTask).toHaveBeenCalledWith(task.id);
        expect(repository.deleteTask).toHaveBeenCalledWith(task.id);
        expect(result).toBe(true);
    });
});
