import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { GithubService } from '@/github/github.service';
import type { CreateAppDto } from './dto/create-app.dto';
import type { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class AppsService {
  private readonly logger = new Logger(AppsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
  ) {}

  async create(userId: string, projectId: string, dto: CreateAppDto) {
    await this.assertProjectOwner(userId, projectId);

    const gitToken = dto.gitToken ?? await this.github.getTokenForUser(userId);

    const app = await this.prisma.app.create({
      data: { ...dto, projectId, gitToken: gitToken ?? undefined },
    });

    if (gitToken && app.repoUrl.includes('github.com')) {
      const webhookSecret = this.github.generateWebhookSecret();
      const callbackUrl = `${process.env.API_URL}/webhooks/github/${app.id}`;
      const hookId = await this.github.registerWebhook(app.repoUrl, gitToken, webhookSecret, callbackUrl);

      if (hookId) {
        await this.prisma.app.update({ where: { id: app.id }, data: { webhookSecret } });
        this.logger.log(`Registered GitHub webhook ${hookId} for app ${app.id}`);
      }
    }

    return this.toSafe(await this.prisma.app.findUniqueOrThrow({ where: { id: app.id } }));
  }

  async findAll(userId: string, projectId: string) {
    await this.assertProjectOwner(userId, projectId);
    const apps = await this.prisma.app.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
    return apps.map((a) => this.toSafe(a));
  }

  async findOne(userId: string, projectId: string, id: string) {
    const app = await this.prisma.app.findUnique({ where: { id }, include: { project: true } });
    if (!app) throw new NotFoundException('App not found');
    if (app.project.userId !== userId) throw new ForbiddenException();
    if (app.projectId !== projectId) throw new NotFoundException('App not found');
    return this.toSafe(app);
  }

  async findOneRaw(id: string) {
    return this.prisma.app.findUniqueOrThrow({ where: { id }, include: { project: true } });
  }

  async update(userId: string, projectId: string, id: string, dto: UpdateAppDto) {
    await this.findOne(userId, projectId, id);
    const updated = await this.prisma.app.update({ where: { id }, data: dto });
    return this.toSafe(updated);
  }

  async remove(userId: string, projectId: string, id: string) {
    await this.findOne(userId, projectId, id);
    return this.prisma.app.delete({ where: { id } });
  }

  private async assertProjectOwner(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();
  }

  private toSafe(app: { gitToken?: string | null; webhookSecret?: string | null; [key: string]: unknown }) {
    const { gitToken, ...safe } = app;
    return { ...safe, hasGitToken: !!gitToken };
  }
}
