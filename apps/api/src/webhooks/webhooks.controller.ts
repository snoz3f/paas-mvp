import {
  BadRequestException,
  Controller,
  Headers,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { GithubService } from '@/github/github.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DeploymentsService } from '@/deployments/deployments.service';

interface GithubPushPayload {
  ref: string;
  repository?: { default_branch?: string };
  head_commit?: { id: string; message: string };
}

@ApiExcludeController()
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly github: GithubService,
    private readonly prisma: PrismaService,
    private readonly deployments: DeploymentsService,
  ) {}

  @Post('github/:appId')
  async handleGithubPush(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Headers('x-hub-signature-256') signature: string,
    @Headers('x-github-event') event: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) throw new UnauthorizedException('Missing signature');

    const app = await this.prisma.app.findUnique({ where: { id: appId } });
    if (!app?.webhookSecret) throw new BadRequestException('App has no webhook configured');

    const rawBody = req.rawBody;
    if (!rawBody) throw new BadRequestException('No raw body');

    const valid = this.github.verifySignature(app.webhookSecret, rawBody, signature);
    if (!valid) throw new UnauthorizedException('Invalid signature');

    if (event !== 'push') return { ignored: true };

    const payload = JSON.parse(rawBody.toString()) as GithubPushPayload;
    const defaultBranch = payload.repository?.default_branch ?? 'main';
    const pushedBranch = payload.ref.replace('refs/heads/', '');

    if (pushedBranch !== defaultBranch) {
      this.logger.log(`Ignoring push to non-default branch ${pushedBranch}`);
      return { ignored: true };
    }

    const commitHash = payload.head_commit?.id;
    this.logger.log(`GitHub push for app ${appId} commit ${commitHash}`);

    const deployment = await this.deployments.createFromWebhook(appId, commitHash);
    return { deploymentId: deployment.id };
  }
}
