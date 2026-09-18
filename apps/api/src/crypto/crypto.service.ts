import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

const PREFIX = 'enc:v1:';
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

@Injectable()
export class CryptoService implements OnModuleInit {
  private readonly logger = new Logger(CryptoService.name);
  private readonly key: Buffer;

  constructor(private readonly prisma: PrismaService) {
    const raw = process.env.ENCRYPTION_KEY;
    if (!raw) throw new Error('ENCRYPTION_KEY is required');
    const key = Buffer.from(raw, 'base64');
    if (key.length !== KEY_LEN) {
      throw new Error('ENCRYPTION_KEY must decode to 32 bytes');
    }
    this.key = key;
  }

  encrypt(plain: string): string {
    const iv = randomBytes(IV_LEN);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64');
  }

  decrypt(value: string | null | undefined): string | null {
    if (value == null || value === '') return value ?? null;
    if (!value.startsWith(PREFIX)) return value;
    const blob = Buffer.from(value.slice(PREFIX.length), 'base64');
    if (blob.length < IV_LEN + TAG_LEN) {
      throw new Error('Invalid ciphertext');
    }
    const iv = blob.subarray(0, IV_LEN);
    const tag = blob.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const ciphertext = blob.subarray(IV_LEN + TAG_LEN);
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  }

  async onModuleInit(): Promise<void> {
    let github = 0;
    let gitTokens = 0;
    let webhookSecrets = 0;

    const users = await this.prisma.user.findMany({
      where: { githubAccessToken: { not: null } },
      select: { id: true, githubAccessToken: true },
    });
    for (const user of users) {
      const token = user.githubAccessToken;
      if (token && !token.startsWith(PREFIX)) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { githubAccessToken: this.encrypt(token) },
        });
        github++;
      }
    }

    const gitRows = await this.prisma.app.findMany({
      where: { gitToken: { not: null } },
      select: { id: true, gitToken: true },
    });
    for (const app of gitRows) {
      const token = app.gitToken;
      if (token && !token.startsWith(PREFIX)) {
        await this.prisma.app.update({
          where: { id: app.id },
          data: { gitToken: this.encrypt(token) },
        });
        gitTokens++;
      }
    }

    const hookRows = await this.prisma.app.findMany({
      where: { webhookSecret: { not: null } },
      select: { id: true, webhookSecret: true },
    });
    for (const app of hookRows) {
      const secret = app.webhookSecret;
      if (secret && !secret.startsWith(PREFIX)) {
        await this.prisma.app.update({
          where: { id: app.id },
          data: { webhookSecret: this.encrypt(secret) },
        });
        webhookSecrets++;
      }
    }

    this.logger.log(
      `encrypted ${github} github tokens, ${gitTokens} gitTokens, ${webhookSecrets} webhookSecrets`,
    );
  }
}
