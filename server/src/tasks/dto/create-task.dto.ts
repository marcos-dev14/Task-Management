import { IsString, IsOptional, IsDateString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in progress",
  COMPLETED = "completed",
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Fazer compras', description: 'Título da tarefa' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Comprar leite e pão', description: 'Descrição da tarefa', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2023-10-15T10:00:00Z', description: 'Data da tarefa' })
  @IsDateString()
  date: Date;
  
  @ApiProperty({ example: 'pending', description: 'Status da tarefa', enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}