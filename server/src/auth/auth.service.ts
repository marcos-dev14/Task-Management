import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    return new UserDto(user);
  }

  async login(user: UserDto): Promise<AuthResponseDto> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const { name, email, password } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new UserDto(user);
  }
}
