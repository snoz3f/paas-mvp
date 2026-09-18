import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { secretsEqual } from '@/common/secrets-equal';

@Injectable()
export class WorkerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers['x-worker-secret'];

    if (!secretsEqual(secret, process.env.WORKER_SECRET)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
