import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '@/prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { effectiveRole, type UserRoleName } from './effective-role';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash },
    });

    return this.signToken({ sub: user.id, email: user.email });
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken({ sub: user.id, email: user.email });
  }

  async getMe(userId: string): Promise<{
    id: string;
    email: string;
    githubLogin: string | null;
    role: UserRoleName;
  }> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const role = effectiveRole(user.email);
    if (user.role !== role) {
      try {
        await this.prisma.user.update({ where: { id: userId }, data: { role } });
      } catch {
        // write-through is best-effort; authz uses ADMIN_EMAILS only
      }
    }
    return {
      id: user.id,
      email: user.email,
      githubLogin: user.githubLogin ?? null,
      role,
    };
  }

  private async signToken(payload: JwtPayload): Promise<{ accessToken: string }> {
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}
