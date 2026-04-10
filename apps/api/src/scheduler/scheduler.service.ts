import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { WorkerNode } from '@/worker-client/worker-client.interfaces';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async selectNode(): Promise<WorkerNode | null> {
    const node = await this.prisma.node.findFirst({
      where: { status: 'ONLINE' },
      orderBy: { activeContainers: 'asc' },
    });

    if (!node) {
      this.logger.warn('No available nodes found');
      return null;
    }

    return { id: node.id, ip: node.ip };
  }
}
