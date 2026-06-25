import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHmac } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';

export interface GithubRepo {
  id: number;
  fullName: string;
  name: string;
  private: boolean;
  url: string;
  defaultBranch: string;
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  get isMock(): boolean {
    return process.env.GITHUB_MOCK === 'true';
  }

  async getOAuthUrl(userId: string): Promise<string> {
    const state = await this.jwt.signAsync(
      { sub: userId, purpose: 'github-oauth' },
      { expiresIn: '10m' },
    );
    if (this.isMock) {
      return `${process.env.API_URL ?? 'http://localhost:5001'}/auth/github/mock-connect?state=${state}`;
    }
    const params = new URLSearchParams({
      client_id: process.env.GH_CLIENT_ID ?? '',
      redirect_uri: process.env.GH_CALLBACK_URL ?? '',
      scope: 'repo',
      state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async handleCallback(code: string, state: string): Promise<void> {
    let userId: string;
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; purpose: string }>(state);
      if (payload.purpose !== 'github-oauth') throw new Error('Invalid state');
      userId = payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired OAuth state');
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GH_CLIENT_ID,
        client_secret: process.env.GH_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GH_CALLBACK_URL,
      }),
    });

    const { access_token } = await tokenRes.json() as { access_token?: string };
    if (!access_token) throw new UnauthorizedException('GitHub did not return an access token');

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const { login } = await userRes.json() as { login: string };

    await this.prisma.user.update({
      where: { id: userId },
      data: { githubAccessToken: access_token, githubLogin: login },
    });

    this.logger.log(`GitHub connected for user ${userId} as @${login}`);
  }

  async handleCallbackWithMock(state: string): Promise<void> {
    const payload = await this.jwt.verifyAsync<{ sub: string; purpose: string }>(state);
    if (payload.purpose !== 'github-oauth') throw new UnauthorizedException('Invalid state');
    await this.mockConnect(payload.sub);
  }

  async mockConnect(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { githubAccessToken: 'mock', githubLogin: 'dev-user' },
    });
  }

  async getRepos(userId: string): Promise<GithubRepo[]> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.githubAccessToken) throw new UnauthorizedException('GitHub not connected');

    if (user.githubAccessToken === 'mock') {
      return MOCK_REPOS;
    }

    const res = await fetch(
      'https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator',
      {
        headers: {
          Authorization: `Bearer ${user.githubAccessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const repos = await res.json() as Array<{
      id: number;
      full_name: string;
      name: string;
      private: boolean;
      clone_url: string;
      default_branch: string;
    }>;

    return repos.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      name: r.name,
      private: r.private,
      url: r.clone_url,
      defaultBranch: r.default_branch,
    }));
  }

  async getTokenForUser(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.githubAccessToken ?? null;
  }

  generateWebhookSecret(): string {
    return randomBytes(32).toString('hex');
  }

  verifySignature(secret: string, payload: Buffer, signature: string): boolean {
    const expected = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;
    return expected === signature;
  }

  async registerWebhook(repoUrl: string, token: string, webhookSecret: string, callbackUrl: string): Promise<number | null> {
    if (token === 'mock') return null;
    const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    if (!match) return null;

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/hooks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['push'],
          config: { url: callbackUrl, content_type: 'json', secret: webhookSecret },
        }),
      });

      if (!res.ok) {
        this.logger.warn(`GitHub webhook registration failed: ${res.status}`);
        return null;
      }

      const data = await res.json() as { id: number };
      return data.id;
    } catch (err) {
      this.logger.error('Failed to register GitHub webhook', err);
      return null;
    }
  }

  async deleteWebhook(repoUrl: string, token: string, hookId: number): Promise<void> {
    if (token === 'mock') return;
    const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    if (!match) return;

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/hooks/${hookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }).catch(() => undefined);
  }
}

const MOCK_REPOS: GithubRepo[] = [
  { id: 1, fullName: 'dev-user/node-api',        name: 'node-api',        private: false, url: 'https://github.com/dev-user/node-api.git',        defaultBranch: 'main' },
  { id: 2, fullName: 'dev-user/react-frontend',  name: 'react-frontend',  private: false, url: 'https://github.com/dev-user/react-frontend.git',  defaultBranch: 'main' },
  { id: 3, fullName: 'dev-user/python-worker',   name: 'python-worker',   private: true,  url: 'https://github.com/dev-user/python-worker.git',   defaultBranch: 'main' },
  { id: 4, fullName: 'dev-user/postgres-migrations', name: 'postgres-migrations', private: true, url: 'https://github.com/dev-user/postgres-migrations.git', defaultBranch: 'main' },
  { id: 5, fullName: 'dev-user/go-gateway',      name: 'go-gateway',      private: false, url: 'https://github.com/dev-user/go-gateway.git',      defaultBranch: 'main' },
];
