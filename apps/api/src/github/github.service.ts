import { Injectable, Logger } from '@nestjs/common';
import { randomBytes, createHmac } from 'crypto';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  generateWebhookSecret(): string {
    return randomBytes(32).toString('hex');
  }

  verifySignature(secret: string, payload: Buffer, signature: string): boolean {
    const expected = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;
    return expected === signature;
  }

  async registerWebhook(repoUrl: string, token: string, webhookSecret: string, callbackUrl: string): Promise<number | null> {
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
          config: {
            url: callbackUrl,
            content_type: 'json',
            secret: webhookSecret,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.warn(`GitHub webhook registration failed: ${res.status} ${body}`);
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
