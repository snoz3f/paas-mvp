import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SchedulerService } from '@/scheduler/scheduler.service';
import { WorkerClientService } from '@/worker-client/worker-client.service';
import { ServiceStatus } from '@/generated/prisma/client.js';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { UpdateServiceStatusDto } from './dto/update-service-status.dto';

const DEFAULT_VERSIONS: Record<string, string> = {
  POSTGRES: '16',
  REDIS: '7',
};

function generatePassword(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function buildConnectionString(type: string, serviceId: string, password: string): string {
  const host = `svc-${serviceId.slice(0, 8)}`;
  if (type === 'POSTGRES') {
    return `postgresql://forge:${password}@${host}:5432/forge`;
  }
  if (type === 'REDIS') {
    return `redis://${host}:6379`;
  }
  throw new Error(`Unknown service type: ${type}`);
}

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduler: SchedulerService,
    private readonly workerClient: WorkerClientService,
  ) {}

  async create(userId: string, projectId: string, dto: CreateServiceDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

    const version = dto.version ?? DEFAULT_VERSIONS[dto.type] ?? 'latest';
    const password = generatePassword();

    const service = await this.prisma.service.create({
      data: { projectId, type: dto.type, version, envKey: dto.envKey },
    });

    // Inject connection string into project envVars immediately
    const connectionString = buildConnectionString(dto.type, service.id, password);
    const currentEnv = (project.envVars ?? {}) as Record<string, string>;
    await this.prisma.project.update({
      where: { id: projectId },
      data: { envVars: { ...currentEnv, [dto.envKey]: connectionString } },
    });

    void this.provision(service.id, projectId, dto.type, version, password);
    return service;
  }

  findAll(userId: string, projectId: string) {
    return this.prisma.service.findMany({
      where: { projectId, project: { userId } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async remove(userId: string, projectId: string, id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    if (service.project.userId !== userId) throw new ForbiddenException();
    if (service.projectId !== projectId) throw new NotFoundException('Service not found');

    // Remove env var from project
    const project = await this.prisma.project.findUniqueOrThrow({ where: { id: projectId } });
    const currentEnv = (project.envVars ?? {}) as Record<string, string>;
    const { [service.envKey]: _, ...rest } = currentEnv;
    await this.prisma.project.update({ where: { id: projectId }, data: { envVars: rest } });

    // Dispatch removal job if container exists
    if (service.containerId && service.nodeId) {
      const node = await this.prisma.node.findUnique({ where: { id: service.nodeId } });
      if (node) {
        await this.workerClient.sendServiceJob(node, {
          type: 'remove-service',
          serviceId: service.id,
          containerId: service.containerId,
          projectId,
          callbackUrl: `${process.env.API_URL}/internal/services/${service.id}/status`,
        });
      }
    }

    await this.prisma.service.delete({ where: { id } });
  }

  async updateStatus(id: string, dto: UpdateServiceStatusDto) {
    return this.prisma.service.update({
      where: { id },
      data: {
        status: dto.status,
        containerId: dto.containerId,
      },
    });
  }

  private async provision(
    serviceId: string,
    projectId: string,
    type: string,
    version: string,
    password: string,
  ) {
    try {
      const node = await this.scheduler.selectNode();
      if (!node) {
        await this.prisma.service.update({
          where: { id: serviceId },
          data: { status: ServiceStatus.FAILED },
        });
        return;
      }

      await this.prisma.service.update({
        where: { id: serviceId },
        data: { nodeId: node.id },
      });

      await this.workerClient.sendServiceJob(node, {
        type: 'provision-service',
        serviceId,
        projectId,
        serviceType: type,
        version,
        password,
        callbackUrl: `${process.env.API_URL}/internal/services/${serviceId}/status`,
      });
    } catch (err) {
      this.logger.error(`Failed to provision service ${serviceId}`, err);
      await this.prisma.service.update({
        where: { id: serviceId },
        data: { status: ServiceStatus.FAILED },
      });
    }
  }
}
