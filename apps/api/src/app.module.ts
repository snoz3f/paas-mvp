import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { GithubModule } from './github/github.module';
import { NodesModule } from './nodes/nodes.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { RedisModule } from './redis/redis.module';
import { ServicesModule } from './services/services.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    GithubModule,
    ProjectsModule,
    DeploymentsModule,
    NodesModule,
    ServicesModule,
    WebhooksModule,
  ],
})
export class AppModule {}
