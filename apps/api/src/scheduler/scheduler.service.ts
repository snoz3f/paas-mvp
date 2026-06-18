import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { WorkerNode } from '@/worker-client/worker-client.interfaces';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async selectNode(appId?: string): Promise<WorkerNode | null> {
    // If no appId (e.g. managed services like Postgres/Redis), fall back to least-loaded node
    if (!appId) {
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

    // Load app resource requirements
    const app = await this.prisma.app.findUniqueOrThrow({ where: { id: appId } });

    // Load all ONLINE nodes
    const nodes = await this.prisma.node.findMany({ where: { status: 'ONLINE' } });

    if (nodes.length === 0) return null;

    // For each node, compute used RAM and disk from running deployments
    const results = await Promise.all(
      nodes.map(async (node) => {
        const deployments = await this.prisma.deployment.findMany({
          where: { nodeId: node.id, status: 'RUNNING' },
          include: { app: { select: { ramMb: true, diskGb: true } } },
        });
        const usedRamMb = deployments.reduce((sum, d) => sum + d.app.ramMb, 0);
        const usedDiskGb = deployments.reduce((sum, d) => sum + d.app.diskGb, 0);
        const freeRamMb = node.totalRamMb - usedRamMb;
        const freeDiskGb = node.totalDiskGb - usedDiskGb;
        return { node, freeRamMb, freeDiskGb };
      }),
    );

    // Filter nodes with enough free resources
    const eligible = results.filter(
      (r) => r.freeRamMb >= app.ramMb && r.freeDiskGb >= app.diskGb,
    );

    if (eligible.length === 0) {
      this.logger.warn(
        `No node with enough resources for app ${appId} (${app.ramMb}MB RAM, ${app.diskGb}GB disk)`,
      );
      return null;
    }

    // Pick node with most free RAM
    eligible.sort((a, b) => b.freeRamMb - a.freeRamMb);
    return { id: eligible[0].node.id, ip: eligible[0].node.ip };
  }
}
