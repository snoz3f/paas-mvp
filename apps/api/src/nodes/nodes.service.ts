import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { NodeStatus } from '@/generated/prisma/client.js';
import type { HeartbeatDto } from './dto/heartbeat.dto';
import type { RegisterNodeDto } from './dto/register-node.dto';

const OFFLINE_THRESHOLD_MS = 90_000;

@Injectable()
export class NodesService {
  private readonly logger = new Logger(NodesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterNodeDto): Promise<{ nodeId: string }> {
    const existing = await this.prisma.node.findFirst({ where: { name: dto.name } });

    if (existing) {
      const node = await this.prisma.node.update({
        where: { id: existing.id },
        data: { ...dto, status: NodeStatus.ONLINE, lastHeartbeat: new Date() },
      });
      return { nodeId: node.id };
    }

    const node = await this.prisma.node.create({
      data: { ...dto, status: NodeStatus.ONLINE, lastHeartbeat: new Date() },
    });
    return { nodeId: node.id };
  }

  async heartbeat(nodeId: string, dto: HeartbeatDto): Promise<void> {
    const node = await this.prisma.node.findUnique({ where: { id: nodeId } });
    if (!node) throw new NotFoundException('Node not found');

    await this.prisma.node.update({
      where: { id: nodeId },
      data: {
        ...dto,
        status: NodeStatus.ONLINE,
        lastHeartbeat: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.node.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const node = await this.prisma.node.findUnique({ where: { id } });
    if (!node) throw new NotFoundException('Node not found');
    return node;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async markStaleNodesOffline(): Promise<void> {
    const threshold = new Date(Date.now() - OFFLINE_THRESHOLD_MS);

    const { count } = await this.prisma.node.updateMany({
      where: {
        status: NodeStatus.ONLINE,
        lastHeartbeat: { lt: threshold },
      },
      data: { status: NodeStatus.OFFLINE },
    });

    if (count > 0) {
      this.logger.warn(`Marked ${count} node(s) as OFFLINE due to missed heartbeat`);
    }
  }
}
