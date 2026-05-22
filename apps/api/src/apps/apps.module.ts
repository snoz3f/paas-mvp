import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { GithubModule } from '@/github/github.module';

@Module({
  imports: [GithubModule],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService],
})
export class AppsModule {}
