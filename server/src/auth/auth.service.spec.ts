import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { UserDto } from "./dto/user.dto";
import { UnauthorizedException } from "@nestjs/common";

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('deve validar um usuário corretamente', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: '123',
        email,
        password: hashedPassword,
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await authService.validateUser(email, password);

      expect(user).toBeDefined();
      expect(user.email).toEqual(email);
    });

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.validateUser('wrong@example.com', 'wrongpassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('deve lançar um erro se a senha for inválida', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash('wrongpassword', 10);

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: '112313',
        email,
        password: hashedPassword,
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.validateUser(email, password))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('deve gerar um token JWT no login', async () => {
      const user = new UserDto({ id: 'dadasdasdasds', email: 'test@example.com' });

      const token = await authService.login(user);

      expect(token).toEqual({ access_token: 'fake-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário', async () => {
      const registerDto: RegisterDto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      (prismaService.user.create as jest.Mock).mockResolvedValue({
        id: 'dadasdasdasds',
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await authService.register(registerDto);

      expect(user).toBeDefined();
      expect(user.email).toEqual(registerDto.email);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: expect.any(String),
        },
      });
    });

    it('deve lançar um erro se o registro falhar', async () => {
      const registerDto: RegisterDto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

      (prismaService.user.create as jest.Mock).mockRejectedValue(new Error('Erro ao criar usuário'));

      await expect(authService.register(registerDto))
        .rejects
        .toThrow('Erro ao criar usuário');
    });
  });
});
