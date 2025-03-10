import { Body, Controller, Post, Get, Param, Put, Delete, UseGuards, Req, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskDto } from "./dto/task.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso', type: TaskDto })
  async createTask(@Req() req, @Body() createTaskDto: CreateTaskDto): Promise<TaskDto> {
    return this.tasksService.createTask(req.user.id, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas', type: [TaskDto] })
  async findAllTasks(
    @Req() req,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('title') title?: string,
  ): Promise<TaskDto[]> {
    const filters = {
      ...(status && { status }),
      ...(date && { date: new Date(date) }),
      ...(title && { title }),
    };

    return this.tasksService.findAllTasks(req.user.id, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma tarefa pelo ID' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada', type: TaskDto })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async findTaskById(@Req() req, @Param('id') taskId: string): Promise<TaskDto> {
    return this.tasksService.findTaskById(req.user.id, taskId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa pelo ID' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada', type: TaskDto })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async updateTask(
    @Req() req,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    return this.tasksService.updateTask(req.user.id, taskId, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma tarefa pelo ID' })
  @ApiResponse({ status: 204, description: 'Tarefa excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async deleteTask(@Req() req, @Param('id') taskId: string): Promise<void> {
    return this.tasksService.deleteTask(req.user.id, taskId);
  }
}
