import { createHash } from 'crypto';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { secretsEqual } from '@/common/secrets-equal';
import { NodeStatus } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { parseAllowedNodeNames } from './allowed-names';
import type { HeartbeatDto } from './dto/heartbeat.dto';
import type { RegisterNodeDto } from './dto/register-node.dto';

const OFFLINE_THRESHOLD_MS = 90_000;

const NODE_PUBLIC_SELECT = {
  id: true,
  name: true,
  ip: true,
  region: true,
  provider: true,
  status: true,
  cpuUsage: true,
  ramUsage: true,
  activeContainers: true,
  lastHeartbeat: true,
  totalRamMb: true,
  totalDiskGb: true,
} as const;

function hashNodeToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

@Injectable()
export class NodesService {
  private readonly logger = new Logger(NodesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterNodeDto, nodeToken: string): Promise<{ nodeId: string }> {
    if (typeof nodeToken !== 'string' || nodeToken === '') {
      throw new UnauthorizedException();
    }

    const allowed = parseAllowedNodeNames(process.env.ALLOWED_NODE_NAMES);
    if (!allowed.includes(dto.name)) {
      throw new ForbiddenException();
    }

    const tokenHash = hashNodeToken(nodeToken);
    const existing = await this.prisma.node.findUnique({ where: { name: dto.name } });

    if (existing?.tokenHash) {
      if (!secretsEqual(tokenHash, existing.tokenHash)) {
        throw new UnauthorizedException();
      }
      const node = await this.prisma.node.update({
        where: { id: existing.id },
        data: {
          ip: dto.ip,
          region: dto.region,
          provider: dto.provider,
          totalRamMb: dto.totalRamMb,
          totalDiskGb: dto.totalDiskGb,
          status: NodeStatus.ONLINE,
          lastHeartbeat: new Date(),
        },
      });
      return { nodeId: node.id };
    }

    if (process.env.ALLOW_NODE_FIRST_BIND !== 'true') {
      throw new UnauthorizedException();
    }

    if (existing) {
      const node = await this.prisma.node.update({
        where: { id: existing.id },
        data: {
          ip: dto.ip,
          region: dto.region,
          provider: dto.provider,
          totalRamMb: dto.totalRamMb,
          totalDiskGb: dto.totalDiskGb,
          tokenHash,
          status: NodeStatus.ONLINE,
          lastHeartbeat: new Date(),
        },
      });
      return { nodeId: node.id };
    }

    const node = await this.prisma.node.create({
      data: {
        name: dto.name,
        ip: dto.ip,
        region: dto.region,
        provider: dto.provider,
        totalRamMb: dto.totalRamMb,
        totalDiskGb: dto.totalDiskGb,
        tokenHash,
        status: NodeStatus.ONLINE,
        lastHeartbeat: new Date(),
      },
    });
    return { nodeId: node.id };
  }

  async heartbeat(nodeId: string, dto: HeartbeatDto, nodeToken: string): Promise<void> {
    if (typeof nodeToken !== 'string' || nodeToken === '') {
      throw new UnauthorizedException();
    }

    const node = await this.prisma.node.findUnique({ where: { id: nodeId } });
    if (!node) throw new NotFoundException('Node not found');

    const tokenHash = hashNodeToken(nodeToken);
    if (!node.tokenHash || !secretsEqual(tokenHash, node.tokenHash)) {
      throw new UnauthorizedException();
    }

    await this.prisma.node.update({
      where: { id: nodeId },
      data: {
        cpuUsage: dto.cpuUsage,
        ramUsage: dto.ramUsage,
        activeContainers: dto.activeContainers,
        totalRamMb: dto.totalRamMb,
        totalDiskGb: dto.totalDiskGb,
        status: NodeStatus.ONLINE,
        lastHeartbeat: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.node.findMany({
      orderBy: { name: 'asc' },
      select: NODE_PUBLIC_SELECT,
    });
  }

  async findOne(id: string) {
    const node = await this.prisma.node.findUnique({
      where: { id },
      select: NODE_PUBLIC_SELECT,
    });
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
