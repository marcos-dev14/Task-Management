import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskDto } from "./dto/task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<TaskDto> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      }
    })
  
    return {
      id: task.id,
      title: task.title,
      description: task.description || '',
      date: task.date,
      status: task.status,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }
  }

  async findAllTasks(
    userId: string,
    filters?: {
      status?: string;
      date?: Date;
      title?: string;
    },
  ): Promise<TaskDto[]> {
    const { status, date, title } = filters || {};

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(date && { date }),
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
      },
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      date: task.date,
      status: task.status,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));
  }

  async findTaskById(userId: string, taskId: string): Promise<TaskDto> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId, userId }
    })

    if (!task) {
      throw new UnauthorizedException('Tarefa não encontrada');
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description || '',
      date: task.date,
      status: task.status,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }
  }

  async updateTask(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<TaskDto> {
    const existingTask = await this.prisma.task.findUnique({
      where: { id: taskId, userId }
    })

    if (!existingTask) {
      throw new UnauthorizedException('Tarefa não encontrada');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskDto,
      include: { user: true },
    });

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description || '',
      date: updatedTask.date,
      status: updatedTask.status,
      created_at: updatedTask.created_at,
      updated_at: updatedTask.updated_at,
    };
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new UnauthorizedException('Tarefa não encontrada');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
