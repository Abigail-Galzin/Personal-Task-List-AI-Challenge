import { Request, Response } from 'express';
import { TaskController } from '../../src/controllers/taskController';
import { ITaskService } from '../../src/services/taskService';
import { Priorities, Status } from '../../src/constants';

describe('TaskController', () => {
    const createServiceMock = (): jest.Mocked<ITaskService> => ({
        createTask: jest.fn(),
        getTask: jest.fn(),
        getAllTasks: jest.fn(),
        updateStatus: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
    });

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

    const createRequest = (
        body: Record<string, unknown> = {},
        params: Record<string, string> = {},
    ) => ({
        body,
        params,
    } as unknown as Request);

    const createResponse = () => {
        const res = {} as Partial<Response>;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.sendStatus = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POST /tasks with a valid payload returns 201 and the created task JSON', async () => {
        const service = createServiceMock();
        const controller = new TaskController(service);
        const createdTask = buildTaskOutput({
            id: 'task-created',
            title: 'Write tests',
            description: 'Cover the full API surface',
            priority: Priorities.urgent,
            dueDate: '2026-05-19T12:00:00.000Z',
        });
        service.createTask.mockResolvedValue(createdTask);

        const req = createRequest({
            title: 'Write tests',
            dueDate: '2026-05-19T12:00:00.000Z',
            description: 'Cover the full API surface',
        });
        const res = createResponse();

        await controller.createTask(req, res);

        expect(service.createTask).toHaveBeenCalledWith({
            title: 'Write tests',
            dueDate: '2026-05-19T12:00:00.000Z',
            description: 'Cover the full API surface',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    it('POST /tasks with a missing required field returns 400', async () => {
        const service = createServiceMock();
        const controller = new TaskController(service);
        const req = createRequest({
            dueDate: '2026-05-19T12:00:00.000Z',
            description: 'Missing title should fail',
        });
        const res = createResponse();

        await controller.createTask(req, res);

        expect(service.createTask).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Title is required.',
        });
    });

    it('PATCH /tasks/:id with completed=true returns 200 OK', async () => {
        const service = createServiceMock();
        const controller = new TaskController(service);
        service.updateStatus.mockResolvedValue(true);

        const req = createRequest({ completed: true }, { id: 'task-1' });
        const res = createResponse();

        await controller.updateTaskStatus(req, res);

        expect(service.updateStatus).toHaveBeenCalledWith('task-1', true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Task updated to COMPLETED.',
        });
    });

    it('GET /tasks returns 200 OK with the array payload', async () => {
        const service = createServiceMock();
        const controller = new TaskController(service);
        const tasks = [
            buildTaskOutput({
                id: 'overdue',
                priority: Priorities.overdue,
                dueDate: '2026-05-17T12:00:00.000Z',
            }),
            buildTaskOutput({
                id: 'urgent',
                priority: Priorities.urgent,
                dueDate: '2026-05-18T18:00:00.000Z',
            }),
        ];
        service.getAllTasks.mockResolvedValue(tasks);

        const req = createRequest();
        const res = createResponse();

        await controller.getAllTasks(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it('DELETE /tasks/:id returns 204 No Content', async () => {
        const service = createServiceMock();
        const controller = new TaskController(service);
        service.deleteTask.mockResolvedValue(true);

        const req = createRequest({}, { id: 'task-1' });
        const res = createResponse();

        await controller.deleteTask(req, res);

        expect(service.deleteTask).toHaveBeenCalledWith('task-1');
        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it.each([
        ['GET', 'getTask', null, {}],
        ['PUT', 'updateTask', null, {
            title: 'Updated title',
        }],
        ['PATCH', 'updateStatus', null, {
            completed: true,
        }],
    ] as const)('%s /tasks/:id with a non-existent id returns 404', async (_method, mockName, returnValue, body) => {
        const service = createServiceMock();
        const controller = new TaskController(service);

        if (mockName === 'getTask') {
            service.getTask.mockResolvedValue(returnValue);
        }

        if (mockName === 'updateTask') {
            service.updateTask.mockResolvedValue(returnValue);
        }

        if (mockName === 'updateStatus') {
            service.updateStatus.mockResolvedValue(returnValue);
        }

        const req = createRequest(body as Record<string, unknown>, { id: 'task-404' });
        const res = createResponse();

        if (mockName === 'getTask') {
            await controller.getTask(req, res);
        }

        if (mockName === 'updateTask') {
            await controller.updateTask(req, res);
        }

        if (mockName === 'updateStatus') {
            await controller.updateTaskStatus(req, res);
        }

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Task not found.',
        });
    });
});
