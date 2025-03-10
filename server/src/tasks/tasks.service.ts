import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  async findAllTasks(userId: string): Promise<TaskDto[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId }
    })

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      date: task.date,
      status: task.status,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }))
  }

  async findTaskById(userId: string, taskId: string): Promise<TaskDto> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId, userId }
    })

    if (!task) {
      throw new Error('Tarefa não encontrada');
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
      throw new Error('Tarefa não encontrada');
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
      throw new Error('Tarefa não encontrada');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
