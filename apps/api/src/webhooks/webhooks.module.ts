import { Module } from '@nestjs/common';
import { GithubModule } from '@/github/github.module';
import { DeploymentsModule } from '@/deployments/deployments.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [GithubModule, DeploymentsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
