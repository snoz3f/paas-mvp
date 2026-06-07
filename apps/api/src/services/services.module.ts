import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { SchedulerModule } from '@/scheduler/scheduler.module';
import { WorkerClientModule } from '@/worker-client/worker-client.module';
import { ServicesController, InternalServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [PrismaModule, SchedulerModule, WorkerClientModule],
  controllers: [ServicesController, InternalServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
