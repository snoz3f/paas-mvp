import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { GithubService } from '@/github/github.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
  ) {}

  async create(userId: string, dto: CreateProjectDto) {
    const gitToken = await this.github.getTokenForUser(userId);

    const project = await this.prisma.project.create({
      data: { ...dto, userId, gitToken },
    });

    if (gitToken && project.repoUrl.includes('github.com')) {
      const webhookSecret = this.github.generateWebhookSecret();
      const callbackUrl = `${process.env.API_URL}/webhooks/github/${project.id}`;
      const hookId = await this.github.registerWebhook(project.repoUrl, gitToken, webhookSecret, callbackUrl);

      if (hookId) {
        await this.prisma.project.update({ where: { id: project.id }, data: { webhookSecret } });
        this.logger.log(`Registered GitHub webhook ${hookId} for project ${project.id}`);
      }
    }

    return this.toSafe(await this.prisma.project.findUniqueOrThrow({ where: { id: project.id } }));
  }

  async findAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map((p) => this.toSafe(p));
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();
    return this.toSafe(project);
  }

  async findOneRaw(id: string) {
    return this.prisma.project.findUniqueOrThrow({ where: { id } });
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.findOne(userId, id);
    const updated = await this.prisma.project.update({ where: { id }, data: dto });
    return this.toSafe(updated);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.project.delete({ where: { id } });
  }

  private toSafe(project: { gitToken?: string | null; webhookSecret?: string | null; [key: string]: unknown }) {
    const { gitToken, webhookSecret, ...safe } = project;
    return { ...safe, hasGitToken: !!gitToken };
  }
}
