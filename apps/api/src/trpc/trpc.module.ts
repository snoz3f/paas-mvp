import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { GithubModule } from '@/github/github.module';
import { ProjectsModule } from '@/projects/projects.module';
import { AppsModule } from '@/apps/apps.module';
import { DeploymentsModule } from '@/deployments/deployments.module';
import { ServicesModule } from '@/services/services.module';
import { NodesModule } from '@/nodes/nodes.module';
import { TrpcService } from './trpc.service';

@Module({
  imports: [
    AuthModule,
    GithubModule,
    ProjectsModule,
    AppsModule,
    DeploymentsModule,
    ServicesModule,
    NodesModule,
  ],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
