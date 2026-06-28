import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { JwtPayload } from '@/auth/auth.service';
import { AuthService } from '@/auth/auth.service';
import { GithubService } from '@/github/github.service';
import { ProjectsService } from '@/projects/projects.service';
import { AppsService } from '@/apps/apps.service';
import { DeploymentsService } from '@/deployments/deployments.service';
import { ServicesService } from '@/services/services.service';
import { ServiceTypeDto } from '@/services/dto/create-service.dto';
import { NodesService } from '@/nodes/nodes.service';
import {
  buildAppRouter,
  type AppRouter,
  type App,
  type Deployment,
  type Node,
  type Project,
  type Service,
  type TRPCContext,
} from './app-router';

type SafeApp = {
  id: string; projectId: string; name: string; repoUrl: string; rootDir: string;
  domain: string | null; framework: string | null; port: number;
  envVars: unknown; createdAt: Date; hasGitToken: boolean;
  ramMb: number; cpuMilli: number; diskGb: number;
  [key: string]: unknown;
};

@Injectable()
export class TrpcService {
  readonly router: AppRouter;

  constructor(
    private readonly auth: AuthService,
    private readonly github: GithubService,
    private readonly projects: ProjectsService,
    private readonly apps: AppsService,
    private readonly deployments: DeploymentsService,
    private readonly services: ServicesService,
    private readonly nodes: NodesService,
    private readonly jwt: JwtService,
  ) {
    this.router = buildAppRouter({
      login: (d) => this.auth.login(d),
      register: (d) => this.auth.register(d),
      getMe: (userId) => this.auth.getMe(userId),
      getGithubOAuthUrl: (userId) => this.github.getOAuthUrl(userId),
      listGithubRepos: (userId) => this.github.getRepos(userId),

      listProjects: async (userId) => {
        const ps = await this.projects.findAll(userId);
        return ps.map(p => this.toProject(p));
      },
      getProject: async (userId, id) =>
        this.toProject(await this.projects.findOne(userId, id)),
      createProject: async (userId, d) =>
        this.toProject(await this.projects.create(userId, d)),
      updateProject: async (userId, id, d) =>
        this.toProject(await this.projects.update(userId, id, d)),
      deleteProject: async (userId, id) => {
        await this.projects.remove(userId, id);
      },

      listApps: async (userId, projectId) => {
        const list = await this.apps.findAll(userId, projectId) as SafeApp[];
        return list.map(a => this.toApp(a));
      },
      getApp: async (userId, projectId, id) =>
        this.toApp(await this.apps.findOne(userId, projectId, id) as SafeApp),
      createApp: async (userId, projectId, d) =>
        this.toApp(await this.apps.create(userId, projectId, d) as SafeApp),
      updateApp: async (userId, projectId, id, d) =>
        this.toApp(await this.apps.update(userId, projectId, id, {
          ...d,
          domain: d.domain ?? undefined,
          framework: d.framework ?? undefined,
          gitToken: d.gitToken ?? undefined,
        }) as SafeApp),
      deleteApp: async (userId, projectId, id) => {
        await this.apps.remove(userId, projectId, id);
      },

      listDeployments: async (userId, projectId, appId) => {
        const ds = await this.deployments.findAll(userId, projectId, appId);
        return ds.map(d => this.toDeployment(d));
      },
      getDeployment: async (userId, projectId, appId, id) =>
        this.toDeployment(await this.deployments.findOne(userId, projectId, appId, id)),
      createDeployment: async (userId, projectId, appId) =>
        this.toDeployment(await this.deployments.create(userId, projectId, appId)),
      restartDeployment: async (userId, projectId, appId, id) =>
        this.toDeployment(await this.deployments.restart(userId, projectId, appId, id)),
      stopDeployment: async (userId, projectId, appId, id) =>
        this.toDeployment(await this.deployments.stop(userId, projectId, appId, id)),
      getTerminalInfo: async (userId, projectId, appId, id) => {
        const { containerId } = await this.deployments.getWorkerForDeployment(
          userId, projectId, appId, id,
        );
        const token = await this.jwt.signAsync(
          { containerId, purpose: 'terminal' },
          { expiresIn: '5m' },
        );
        const base = process.env.WORKER_PUBLIC_URL ?? 'wss://worker.infral.dev';
        return { wsUrl: `${base}/containers/terminal`, containerId, token };
      },

      listServices: async (userId, projectId) => {
        const list = await this.services.findAll(userId, projectId);
        return list.map(s => this.toService(s));
      },
      createService: async (userId, projectId, d) =>
        this.toService(await this.services.create(userId, projectId, {
          ...d,
          type: d.type as ServiceTypeDto,
        })),
      deleteService: async (userId, projectId, id) => {
        await this.services.remove(userId, projectId, id);
      },

      listNodes: async () => {
        const ns = await this.nodes.findAll();
        return ns.map(n => this.toNode(n));
      },
    });
  }

  async createContext({ req }: { req: Request }): Promise<TRPCContext> {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) return { userId: null };
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      return { userId: payload.sub };
    } catch {
      return { userId: null };
    }
  }

  private toProject(p: { id: string; userId: string; name: string; createdAt: Date }): Project {
    return { id: p.id, userId: p.userId, name: p.name, createdAt: p.createdAt.toISOString() };
  }

  private toApp(a: {
    id: string; projectId: string; name: string; repoUrl: string; rootDir: string;
    domain: string | null; framework: string | null; port: number;
    envVars: unknown; createdAt: Date; hasGitToken: boolean;
    ramMb: number; cpuMilli: number; diskGb: number;
  }): App {
    return {
      id: a.id, projectId: a.projectId, name: a.name, repoUrl: a.repoUrl, rootDir: a.rootDir,
      domain: a.domain, framework: a.framework, port: a.port,
      envVars: a.envVars as Record<string, string> | null,
      hasGitToken: a.hasGitToken, createdAt: a.createdAt.toISOString(),
      ramMb: a.ramMb, cpuMilli: a.cpuMilli, diskGb: a.diskGb,
    };
  }

  private toDeployment(d: {
    id: string; appId: string; status: string; url: string | null;
    containerId: string | null; nodeId: string | null; commitHash: string | null;
    error: string | null; logs: string | null;
    createdAt: Date; startedAt: Date | null; finishedAt: Date | null;
  }): Deployment {
    return {
      id: d.id, appId: d.appId, status: d.status as Deployment['status'],
      url: d.url, containerId: d.containerId, nodeId: d.nodeId,
      commitHash: d.commitHash, error: d.error, logs: d.logs,
      createdAt: d.createdAt.toISOString(),
      startedAt: d.startedAt?.toISOString() ?? null,
      finishedAt: d.finishedAt?.toISOString() ?? null,
    };
  }

  private toService(s: {
    id: string; projectId: string; type: string; version: string; status: string;
    envKey: string; connectionString: string | null; containerId: string | null; createdAt: Date;
  }): Service {
    return {
      id: s.id, projectId: s.projectId, type: s.type, version: s.version,
      status: s.status, envKey: s.envKey, connectionString: s.connectionString,
      containerId: s.containerId, createdAt: s.createdAt.toISOString(),
    };
  }

  private toNode(n: {
    id: string; name: string; ip: string; region: string | null; provider: string | null;
    status: string; cpuUsage: number; ramUsage: number; activeContainers: number;
    lastHeartbeat: Date | null; totalRamMb: number; totalDiskGb: number;
  }): Node {
    return {
      id: n.id, name: n.name, ip: n.ip, region: n.region, provider: n.provider,
      status: n.status, cpuUsage: n.cpuUsage, ramUsage: n.ramUsage,
      activeContainers: n.activeContainers,
      lastHeartbeat: n.lastHeartbeat?.toISOString() ?? null,
      totalRamMb: n.totalRamMb, totalDiskGb: n.totalDiskGb,
    };
  }
}
