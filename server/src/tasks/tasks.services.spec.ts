import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

describe('TasksService', () => {
  let tasksService: TasksService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    // Mock do PrismaService
    prismaService = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  describe('createTask', () => {
    it('deve criar uma tarefa corretamente', async () => {
      const userId = 'user-id';
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa de Teste',
        description: 'Descrição da tarefa',
        date: new Date(),
        status: TaskStatus.PENDING,
      };

      ( prismaService.task.create as jest.Mock).mockReturnValue({
        id: 'task-id',
        title: createTaskDto.title,
        description: createTaskDto.description,
        date: createTaskDto.date,
        status: createTaskDto.status,
        created_at: new Date(),
        updated_at: new Date(),
        userId,
      })

      const task = await tasksService.createTask(userId, createTaskDto);

      expect(task).toBeDefined();
      expect(task.title).toEqual(createTaskDto.title);
      expect(prismaService.task.create as jest.Mock).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          userId,
        },
      });
    });
  });

  describe('findAllTasks', () => {
    it('deve retornar todas as tarefas do usuário', async () => {
      const userId = 'user-id';
      const mockTasks = [
        {
          id: 'task-id-1',
          title: 'Tarefa 1',
          description: 'Descrição da Tarefa 1',
          date: new Date(),
          status: TaskStatus.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
          userId,
        },
        {
          id: 'task-id-2',
          title: 'Tarefa 2',
          description: 'Descrição da Tarefa 2',
          date: new Date(),
          status: TaskStatus.COMPLETED,
          created_at: new Date(),
          updated_at: new Date(),
          userId,
        },
      ];

      (prismaService.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const tasks = await tasksService.findAllTasks(userId);

      expect(tasks).toBeDefined();
      expect(tasks.length).toEqual(2);
      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('deve aplicar filtros na listagem de tarefas', async () => {
      const userId = 'user-id';
      const filters = {
        status: TaskStatus.PENDING,
        date: new Date(),
        title: 'Tarefa',
      };

      const mockTasks = [
        {
          id: 'task-id-1',
          title: 'Tarefa 1',
          description: 'Descrição da Tarefa 1',
          date: filters.date,
          status: filters.status,
          created_at: new Date(),
          updated_at: new Date(),
          userId,
        },
      ];

      (prismaService.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const tasks = await tasksService.findAllTasks(userId, filters);

      expect(tasks).toBeDefined();
      expect(tasks.length).toEqual(1);
      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          status: filters.status,
          date: filters.date,
          title: { contains: filters.title, mode: 'insensitive' },
        },
      });
    });
  });

  describe('findTaskById', () => {
    it('deve retornar uma tarefa pelo ID', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const mockTask = {
        id: taskId,
        title: 'Tarefa de Teste',
        description: 'Descrição da tarefa',
        date: new Date(),
        status: TaskStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
        userId,
      };

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const task = await tasksService.findTaskById(userId, taskId);

      expect(task).toBeDefined();
      expect(task.id).toEqual(taskId);
      (expect(prismaService.task.findUnique as jest.Mock)).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
    });

    it('deve lançar uma exceção se a tarefa não for encontrada', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(tasksService.findTaskById(userId, taskId))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('updateTask', () => {
    it('deve atualizar uma tarefa corretamente', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa Atualizada',
        status: TaskStatus.COMPLETED,
      };

      const mockTask = {
        id: taskId,
        title: updateTaskDto.title,
        description: 'Descrição da tarefa',
        date: new Date(),
       status: TaskStatus.COMPLETED,
        created_at: new Date(),
        updated_at: new Date(),
        userId,
      };

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      (prismaService.task.update as jest.Mock).mockResolvedValue(mockTask);

      const task = await tasksService.updateTask(userId, taskId, updateTaskDto);

      expect(task).toBeDefined();
      expect(task.title).toEqual(updateTaskDto.title);
      expect(task.status).toEqual(updateTaskDto.status);
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
        include: { user: true },
      });
    });

    it('deve lançar uma exceção se a tarefa não for encontrada', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa Atualizada',
      };

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(tasksService.updateTask(userId, taskId, updateTaskDto))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('deleteTask', () => {
    it('deve excluir uma tarefa corretamente', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const mockTask = {
        id: taskId,
        title: 'Tarefa de Teste',
        description: 'Descrição da tarefa',
        date: new Date(),
        status: TaskStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
        userId,
      };

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      (prismaService.task.delete as jest.Mock).mockResolvedValue(mockTask);

      await tasksService.deleteTask(userId, taskId);

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('deve lançar uma exceção se a tarefa não for encontrada', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';

      (prismaService.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(tasksService.deleteTask(userId, taskId))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});