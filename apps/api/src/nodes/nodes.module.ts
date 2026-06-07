import { Module } from '@nestjs/common';
import { InternalNodesController, NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({
  controllers: [NodesController, InternalNodesController],
  providers: [NodesService],
  exports: [NodesService],
})
export class NodesModule {}
