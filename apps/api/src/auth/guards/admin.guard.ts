import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '@/auth/auth.service';
import { effectiveRole } from '@/auth/effective-role';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as JwtPayload | undefined;
    if (!user?.email || effectiveRole(user.email) !== 'admin') {
      throw new ForbiddenException();
    }
    return true;
  }
}
