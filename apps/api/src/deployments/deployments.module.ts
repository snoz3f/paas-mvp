import { Module } from '@nestjs/common';
import { SchedulerModule } from '@/scheduler/scheduler.module';
import { WorkerClientModule } from '@/worker-client/worker-client.module';
import { DeploymentsController, InternalDeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';

@Module({
  imports: [SchedulerModule, WorkerClientModule],
  controllers: [DeploymentsController, InternalDeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}
