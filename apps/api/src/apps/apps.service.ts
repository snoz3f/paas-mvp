import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { assertSafeRootDir } from '@/common/root-dir';
import { CryptoService } from '@/crypto/crypto.service';
import { PrismaService } from '@/prisma/prisma.service';
import { GithubService } from '@/github/github.service';
import type { CreateAppDto } from './dto/create-app.dto';
import type { UpdateAppDto } from './dto/update-app.dto';

type AppRow = {
  id: string;
  projectId: string;
  name: string;
  repoUrl: string;
  rootDir: string;
  domain: string | null;
  framework: string | null;
  port: number;
  envVars: unknown;
  createdAt: Date;
  ramMb: number;
  cpuMilli: number;
  diskGb: number;
  gitToken?: string | null;
  webhookSecret?: string | null;
};

export type SafeApp = {
  id: string;
  projectId: string;
  name: string;
  repoUrl: string;
  rootDir: string;
  domain: string | null;
  framework: string | null;
  port: number;
  envVars: Record<string, string>;
  createdAt: Date;
  ramMb: number;
  cpuMilli: number;
  diskGb: number;
  hasGitToken: boolean;
};

@Injectable()
export class AppsService {
  private readonly logger = new Logger(AppsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
    private readonly crypto: CryptoService,
  ) {}

  async create(userId: string, projectId: string, dto: CreateAppDto) {
    await this.assertProjectOwner(userId, projectId);

    let rootDir: string;
    try {
      rootDir = assertSafeRootDir(dto.rootDir);
    } catch {
      throw new BadRequestException('invalid rootDir');
    }

    const gitToken = dto.gitToken ?? await this.github.getTokenForUser(userId);

    const app = await this.prisma.app.create({
      data: { ...dto, rootDir, projectId, gitToken: gitToken ? this.crypto.encrypt(gitToken) : undefined },
    });

    if (gitToken && app.repoUrl.includes('github.com')) {
      const webhookSecret = this.github.generateWebhookSecret();
      const callbackUrl = `${process.env.API_URL}/webhooks/github/${app.id}`;
      const hookId = await this.github.registerWebhook(app.repoUrl, gitToken, webhookSecret, callbackUrl);

      if (hookId) {
        await this.prisma.app.update({
          where: { id: app.id },
          data: { webhookSecret: this.crypto.encrypt(webhookSecret) },
        });
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
    const { gitToken, rootDir: rawRootDir, ...rest } = dto;

    let rootDir: string | undefined;
    if (rawRootDir !== undefined) {
      try {
        rootDir = assertSafeRootDir(rawRootDir);
      } catch {
        throw new BadRequestException('invalid rootDir');
      }
    }

    const data = {
      ...rest,
      ...(rootDir !== undefined ? { rootDir } : {}),
      ...(gitToken !== undefined
        ? { gitToken: gitToken ? this.crypto.encrypt(gitToken) : gitToken }
        : {}),
    };
    const updated = await this.prisma.app.update({ where: { id }, data });
    return this.toSafe(updated);
  }

  async remove(userId: string, projectId: string, id: string): Promise<void> {
    await this.findOne(userId, projectId, id);
    await this.prisma.app.delete({ where: { id } });
  }

  private async assertProjectOwner(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();
  }

  private toSafe(app: AppRow): SafeApp {
    return {
      id: app.id,
      projectId: app.projectId,
      name: app.name,
      repoUrl: app.repoUrl,
      rootDir: app.rootDir,
      domain: app.domain,
      framework: app.framework,
      port: app.port,
      envVars: app.envVars as Record<string, string>,
      createdAt: app.createdAt,
      ramMb: app.ramMb,
      cpuMilli: app.cpuMilli,
      diskGb: app.diskGb,
      hasGitToken: !!app.gitToken,
    };
  }
}
