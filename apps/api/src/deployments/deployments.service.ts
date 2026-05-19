import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SchedulerService } from '@/scheduler/scheduler.service';
import { WorkerClientService } from '@/worker-client/worker-client.service';
import { DeploymentStatus } from '@/generated/prisma/client.js';
import type { UpdateDeploymentStatusDto } from './dto/update-deployment-status.dto';

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduler: SchedulerService,
    private readonly workerClient: WorkerClientService,
  ) {}

  async create(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

    const deployment = await this.prisma.deployment.create({
      data: { projectId, status: DeploymentStatus.QUEUED },
    });

    void this.triggerDeploy(deployment.id, project.id);

    return deployment;
  }

  async createFromWebhook(projectId: string, commitHash?: string) {
    const deployment = await this.prisma.deployment.create({
      data: { projectId, status: DeploymentStatus.QUEUED, commitHash },
    });

    void this.triggerDeploy(deployment.id, projectId);

    return deployment;
  }

  findAll(userId: string, projectId: string) {
    return this.prisma.deployment.findMany({
      where: { projectId, project: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, projectId: string, id: string) {
    const deployment = await this.prisma.deployment.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!deployment) throw new NotFoundException('Deployment not found');
    if (deployment.project.userId !== userId) throw new ForbiddenException();
    if (deployment.projectId !== projectId) throw new NotFoundException('Deployment not found');

    const { gitToken, webhookSecret, ...safeProject } = deployment.project;
    return { ...deployment, project: { ...safeProject, hasGitToken: !!gitToken } };
  }

  async restart(userId: string, projectId: string, id: string) {
    const current = await this.findOne(userId, projectId, id);

    const deployment = await this.prisma.deployment.create({
      data: { projectId, status: DeploymentStatus.QUEUED },
    });

    void this.triggerDeploy(deployment.id, current.projectId, current.containerId ?? undefined);

    return deployment;
  }

  async stop(userId: string, projectId: string, id: string) {
    const deployment = await this.findOne(userId, projectId, id);

    if (deployment.status !== DeploymentStatus.RUNNING) {
      throw new ForbiddenException('Only RUNNING deployments can be stopped');
    }

    const node = deployment.nodeId
      ? await this.prisma.node.findUnique({ where: { id: deployment.nodeId } })
      : null;

    if (node && deployment.containerId) {
      await this.workerClient.sendJob(
        { id: node.id, ip: node.ip },
        {
          type: 'stop',
          deploymentId: deployment.id,
          containerId: deployment.containerId,
          callbackUrl: `${process.env.API_URL}/internal/deployments/${deployment.id}/status`,
        },
      );
    }

    return this.prisma.deployment.update({
      where: { id },
      data: { status: DeploymentStatus.STOPPED, finishedAt: new Date() },
    });
  }

  async getWorkerForDeployment(userId: string, projectId: string, id: string) {
    const deployment = await this.findOne(userId, projectId, id);
    if (!deployment.nodeId || !deployment.containerId) {
      throw new NotFoundException('No active container for this deployment');
    }
    const node = await this.prisma.node.findUnique({ where: { id: deployment.nodeId } });
    if (!node) throw new NotFoundException('Node not found');
    return { node, containerId: deployment.containerId };
  }

  async updateStatus(id: string, dto: UpdateDeploymentStatusDto) {
    const now = new Date();
    const terminalStatuses: DeploymentStatus[] = [
      DeploymentStatus.RUNNING,
      DeploymentStatus.FAILED,
      DeploymentStatus.STOPPED,
    ];
    const isTerminal = terminalStatuses.includes(dto.status);

    return this.prisma.deployment.update({
      where: { id },
      data: {
        status: dto.status,
        containerId: dto.containerId,
        url: dto.url,
        error: dto.error,
        startedAt: dto.status === DeploymentStatus.BUILDING ? now : undefined,
        finishedAt: isTerminal ? now : undefined,
      },
    });
  }

  private async triggerDeploy(deploymentId: string, projectId: string, oldContainerId?: string) {
    try {
      const project = await this.prisma.project.findUniqueOrThrow({ where: { id: projectId } });
      const node = await this.scheduler.selectNode();

      if (!node) {
        await this.prisma.deployment.update({
          where: { id: deploymentId },
          data: { status: DeploymentStatus.FAILED, error: 'No available nodes' },
        });
        return;
      }

      await this.prisma.deployment.update({
        where: { id: deploymentId },
        data: { nodeId: node.id, status: DeploymentStatus.BUILDING, startedAt: new Date() },
      });

      const repoUrl = project.gitToken
        ? this.buildAuthenticatedUrl(project.repoUrl, project.gitToken)
        : project.repoUrl;

      await this.workerClient.sendJob(node, {
        type: oldContainerId ? 'restart' : 'deploy',
        deploymentId,
        repoUrl,
        port: project.port,
        domain: project.domain ?? undefined,
        containerId: oldContainerId,
        envVars: (project.envVars ?? {}) as Record<string, string>,
        projectId: project.id,
        callbackUrl: `${process.env.API_URL}/internal/deployments/${deploymentId}/status`,
      });
    } catch (err) {
      this.logger.error(`Failed to trigger deploy for ${deploymentId}`, err);
      const message = err instanceof Error ? err.message : 'Internal scheduler error';
      await this.prisma.deployment.update({
        where: { id: deploymentId },
        data: { status: DeploymentStatus.FAILED, error: message },
      });
    }
  }

  private buildAuthenticatedUrl(repoUrl: string, token: string): string {
    try {
      const url = new URL(repoUrl.replace(/^git@github\.com:/, 'https://github.com/'));
      url.username = 'x-access-token';
      url.password = token;
      return url.toString();
    } catch {
      return repoUrl;
    }
  }
}
