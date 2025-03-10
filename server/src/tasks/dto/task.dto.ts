import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da tarefa' })
  id: string;

  @ApiProperty({ example: 'Fazer compras', description: 'Título da tarefa' })
  title: string;

  @ApiProperty({ example: 'Comprar leite e pão', description: 'Descrição da tarefa', required: false })
  description?: string;

  @ApiProperty({ example: '2023-10-15T10:00:00Z', description: 'Data da tarefa' })
  date: Date;

  @ApiProperty({ example: 'pending', description: 'Status da tarefa' })
  status: string;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z', description: 'Data de criação da tarefa' })
  created_at: Date;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z', description: 'Data de atualização da tarefa' })
  updated_at: Date;
}