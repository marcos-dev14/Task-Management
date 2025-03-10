import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '1dasdasdfdsafdfdfd', description: 'ID do usuário' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'E-mail do usuário' })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z', description: 'Data de criação do usuário' })
  created_at: Date;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z', description: 'Data de atualização do usuário' })
  updated_at: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}