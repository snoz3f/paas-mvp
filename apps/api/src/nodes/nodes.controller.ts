import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@/auth/decorators/public.decorator';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { WorkerAuthGuard } from '@/deployments/guards/worker-auth.guard';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { NodeResponseDto } from './dto/node-response.dto';
import { RegisterNodeDto } from './dto/register-node.dto';
import { RegisterNodeResponseDto } from './dto/register-node-response.dto';
import { NodesService } from './nodes.service';

@ApiTags('nodes')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  @ApiOperation({ operationId: 'getNodes', summary: 'List all nodes' })
  @ApiOkResponse({ type: [NodeResponseDto] })
  findAll() {
    return this.nodesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getNodeById', summary: 'Get a node by ID' })
  @ApiOkResponse({ type: NodeResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.nodesService.findOne(id);
  }
}

@ApiTags('internal')
@Controller('internal/nodes')
export class InternalNodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Public()
  @UseGuards(WorkerAuthGuard)
  @Post('register')
  @ApiOperation({ operationId: 'registerNode', summary: 'Worker self-registration' })
  @ApiCreatedResponse({ type: RegisterNodeResponseDto })
  register(
    @Body() dto: RegisterNodeDto,
    @Headers('x-node-token') nodeToken: string,
  ) {
    return this.nodesService.register(dto, nodeToken);
  }

  @Public()
  @UseGuards(WorkerAuthGuard)
  @Post(':id/heartbeat')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'nodeHeartbeat', summary: 'Worker heartbeat' })
  @ApiNoContentResponse()
  heartbeat(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: HeartbeatDto,
    @Headers('x-node-token') nodeToken: string,
  ) {
    return this.nodesService.heartbeat(id, dto, nodeToken);
  }
}
