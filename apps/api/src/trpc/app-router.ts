import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

export interface TRPCContext {
  userId: string | null;
}

const t = initTRPC.context<TRPCContext>().create();

const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { userId: ctx.userId as string } });
});

// ── Return types (plain TS, no NestJS/Prisma deps) ────────

export interface Project {
  id: string; userId: string; name: string; createdAt: string;
}

export interface App {
  id: string; projectId: string; name: string; repoUrl: string; rootDir: string;
  domain: string | null; framework: string | null; port: number;
  envVars: Record<string, string> | null; hasGitToken: boolean; createdAt: string;
  ramMb: number; cpuMilli: number; diskGb: number;
}

export interface Deployment {
  id: string; appId: string;
  status: 'QUEUED' | 'BUILDING' | 'RUNNING' | 'FAILED' | 'STOPPED';
  url: string | null; containerId: string | null; nodeId: string | null;
  commitHash: string | null; error: string | null; logs: string | null;
  createdAt: string; startedAt: string | null; finishedAt: string | null;
}

export interface Service {
  id: string; projectId: string; type: string; version: string;
  status: string; envKey: string; connectionString: string | null;
  containerId: string | null; createdAt: string;
}

export interface Node {
  id: string; name: string; ip: string; region: string | null; provider: string | null;
  status: string; cpuUsage: number; ramUsage: number; activeContainers: number;
  lastHeartbeat: string | null; totalRamMb: number; totalDiskGb: number;
}

export interface GithubRepo {
  id: number; fullName: string; name: string; private: boolean;
  url: string; defaultBranch: string;
}

// ── Deps interface ────────────────────────────────────────

export interface AppRouterDeps {
  login(d: { email: string; password: string }): Promise<{ accessToken: string }>;
  register(d: { email: string; password: string }): Promise<{ accessToken: string }>;
  getMe(userId: string): Promise<{ id: string; email: string; githubLogin: string | null }>;
  getGithubOAuthUrl(userId: string): Promise<string>;
  listGithubRepos(userId: string): Promise<GithubRepo[]>;

  listProjects(userId: string): Promise<Project[]>;
  getProject(userId: string, id: string): Promise<Project>;
  createProject(userId: string, d: { name: string }): Promise<Project>;
  updateProject(userId: string, id: string, d: { name?: string }): Promise<Project>;
  deleteProject(userId: string, id: string): Promise<void>;

  listApps(userId: string, projectId: string): Promise<App[]>;
  getApp(userId: string, projectId: string, id: string): Promise<App>;
  createApp(userId: string, projectId: string, d: {
    name: string; repoUrl: string; rootDir?: string; framework?: string;
    port?: number; envVars?: Record<string, string>; gitToken?: string;
    ramMb?: number; cpuMilli?: number; diskGb?: number;
  }): Promise<App>;
  updateApp(userId: string, projectId: string, id: string, d: {
    name?: string; repoUrl?: string; rootDir?: string; domain?: string | null; framework?: string | null;
    port?: number; envVars?: Record<string, string>; gitToken?: string | null;
    ramMb?: number; cpuMilli?: number; diskGb?: number;
  }): Promise<App>;
  deleteApp(userId: string, projectId: string, id: string): Promise<void>;

  listDeployments(userId: string, projectId: string, appId: string): Promise<Deployment[]>;
  getDeployment(userId: string, projectId: string, appId: string, id: string): Promise<Deployment>;
  createDeployment(userId: string, projectId: string, appId: string): Promise<Deployment>;
  restartDeployment(userId: string, projectId: string, appId: string, id: string): Promise<Deployment>;
  stopDeployment(userId: string, projectId: string, appId: string, id: string): Promise<Deployment>;
  getTerminalInfo(userId: string, projectId: string, appId: string, id: string): Promise<{ wsUrl: string; containerId: string; token: string }>;

  listServices(userId: string, projectId: string): Promise<Service[]>;
  createService(userId: string, projectId: string, d: { type: string; version: string; envKey: string }): Promise<Service>;
  deleteService(userId: string, projectId: string, id: string): Promise<void>;

  listNodes(): Promise<Node[]>;
}

// ── Router ────────────────────────────────────────────────

export function buildAppRouter(deps: AppRouterDeps) {
  return t.router({
    auth: t.router({
      login: t.procedure
        .input(z.object({ email: z.string().email(), password: z.string() }))
        .mutation(({ input }) => deps.login(input)),

      register: t.procedure
        .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
        .mutation(({ input }) => deps.register(input)),

      getMe: protectedProcedure
        .query(({ ctx }) => deps.getMe(ctx.userId)),
    }),

    github: t.router({
      getOAuthUrl: protectedProcedure
        .query(({ ctx }) => deps.getGithubOAuthUrl(ctx.userId).then(url => ({ url }))),

      listRepos: protectedProcedure
        .query(({ ctx }) => deps.listGithubRepos(ctx.userId)),
    }),

    projects: t.router({
      list: protectedProcedure
        .query(({ ctx }) => deps.listProjects(ctx.userId)),

      get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => deps.getProject(ctx.userId, input.id)),

      create: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(({ ctx, input }) => deps.createProject(ctx.userId, input)),

      update: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx, input: { id, ...data } }) => deps.updateProject(ctx.userId, id, data)),

      delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => deps.deleteProject(ctx.userId, input.id)),
    }),

    apps: t.router({
      list: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(({ ctx, input }) => deps.listApps(ctx.userId, input.projectId)),

      get: protectedProcedure
        .input(z.object({ projectId: z.string(), id: z.string() }))
        .query(({ ctx, input }) => deps.getApp(ctx.userId, input.projectId, input.id)),

      create: protectedProcedure
        .input(z.object({
          projectId: z.string(),
          name: z.string().min(1),
          repoUrl: z.string().url(),
          rootDir: z.string().optional(),
          framework: z.string().optional(),
          port: z.number().optional(),
          envVars: z.record(z.string(), z.string()).optional(),
          gitToken: z.string().optional(),
          ramMb: z.number().int().optional(),
          cpuMilli: z.number().int().optional(),
          diskGb: z.number().int().optional(),
        }))
        .mutation(({ ctx, input: { projectId, ...data } }) =>
          deps.createApp(ctx.userId, projectId, data)),

      update: protectedProcedure
        .input(z.object({
          projectId: z.string(),
          id: z.string(),
          name: z.string().optional(),
          repoUrl: z.string().url().optional(),
          rootDir: z.string().optional(),
          domain: z.string().nullable().optional(),
          framework: z.string().nullable().optional(),
          port: z.number().optional(),
          envVars: z.record(z.string(), z.string()).optional(),
          gitToken: z.string().nullable().optional(),
          ramMb: z.number().int().optional(),
          cpuMilli: z.number().int().optional(),
          diskGb: z.number().int().optional(),
        }))
        .mutation(({ ctx, input: { projectId, id, ...data } }) =>
          deps.updateApp(ctx.userId, projectId, id, data)),

      delete: protectedProcedure
        .input(z.object({ projectId: z.string(), id: z.string() }))
        .mutation(({ ctx, input }) => deps.deleteApp(ctx.userId, input.projectId, input.id)),
    }),

    deployments: t.router({
      list: protectedProcedure
        .input(z.object({ projectId: z.string(), appId: z.string() }))
        .query(({ ctx, input }) =>
          deps.listDeployments(ctx.userId, input.projectId, input.appId)),

      get: protectedProcedure
        .input(z.object({ projectId: z.string(), appId: z.string(), id: z.string() }))
        .query(({ ctx, input }) =>
          deps.getDeployment(ctx.userId, input.projectId, input.appId, input.id)),

      create: protectedProcedure
        .input(z.object({ projectId: z.string(), appId: z.string() }))
        .mutation(({ ctx, input }) =>
          deps.createDeployment(ctx.userId, input.projectId, input.appId)),

      restart: protectedProcedure
        .input(z.object({ projectId: z.string(), appId: z.string(), id: z.string() }))
        .mutation(({ ctx, input }) =>
          deps.restartDeployment(ctx.userId, input.projectId, input.appId, input.id)),

      stop: protectedProcedure
        .input(z.object({ projectId: z.string(), appId: z.string(), id: z.string() }))
        .mutation(({ ctx, input }) =>
          deps.stopDeployment(ctx.userId, input.projectId, input.appId, input.id)),

      getTerminalInfo: protectedProcedure
        .input(z.object({ projectId: z.string(), appId: z.string(), id: z.string() }))
        .query(({ ctx, input }) =>
          deps.getTerminalInfo(ctx.userId, input.projectId, input.appId, input.id)),
    }),

    services: t.router({
      list: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(({ ctx, input }) => deps.listServices(ctx.userId, input.projectId)),

      create: protectedProcedure
        .input(z.object({
          projectId: z.string(),
          type: z.enum(['POSTGRES', 'REDIS']),
          version: z.string(),
          envKey: z.string(),
        }))
        .mutation(({ ctx, input: { projectId, ...data } }) =>
          deps.createService(ctx.userId, projectId, data)),

      delete: protectedProcedure
        .input(z.object({ projectId: z.string(), id: z.string() }))
        .mutation(({ ctx, input }) => deps.deleteService(ctx.userId, input.projectId, input.id)),
    }),

    nodes: t.router({
      list: protectedProcedure
        .query(() => deps.listNodes()),
    }),
  });
}

export type AppRouter = ReturnType<typeof buildAppRouter>;
