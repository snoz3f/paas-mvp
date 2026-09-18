import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import Redis from 'ioredis';
import { REDIS } from '@/redis/redis.module';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { JwtPayload } from '@/auth/auth.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { DeploymentResponseDto } from './dto/deployment-response.dto';
import { TerminalInfoResponseDto } from './dto/terminal-info-response.dto';
import { UpdateDeploymentStatusDto } from './dto/update-deployment-status.dto';
import { WorkerAuthGuard } from './guards/worker-auth.guard';
import { DeploymentsService } from './deployments.service';
import { assertTerminalRestEnabled } from './terminal-enabled';

@ApiTags('deployments')
@ApiBearerAuth('access-token')
@Controller('projects/:projectId/apps/:appId/deployments')
export class DeploymentsController {
  constructor(
    private readonly deploymentsService: DeploymentsService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  @Post()
  @ApiOperation({ operationId: 'createDeployment', summary: 'Trigger a new deployment' })
  @ApiCreatedResponse({ type: DeploymentResponseDto })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
  ) {
    return this.deploymentsService.create(user.sub, projectId, appId);
  }

  @Get()
  @ApiOperation({ operationId: 'getDeployments', summary: 'List deployments for an app' })
  @ApiOkResponse({ type: [DeploymentResponseDto] })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
  ) {
    return this.deploymentsService.findAll(user.sub, projectId, appId);
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getDeploymentById', summary: 'Get a deployment by ID' })
  @ApiOkResponse({ type: DeploymentResponseDto })
  findOne(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deploymentsService.findOne(user.sub, projectId, appId, id);
  }

  @Post(':id/restart')
  @ApiOperation({ operationId: 'restartDeployment', summary: 'Restart a deployment' })
  @ApiCreatedResponse({ type: DeploymentResponseDto })
  restart(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deploymentsService.restart(user.sub, projectId, appId, id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'stopDeployment', summary: 'Stop a running deployment' })
  @ApiOkResponse({ type: DeploymentResponseDto })
  stop(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deploymentsService.stop(user.sub, projectId, appId, id);
  }

  @Get(':id/logs')
  @ApiOperation({ operationId: 'streamDeploymentLogs', summary: 'Stream deployment logs (SSE)' })
  @ApiOkResponse({ schema: { type: 'string' }, description: 'text/event-stream SSE response' })
  async streamLogs(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const deployment = await this.deploymentsService.findOne(user.sub, projectId, appId, id);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    if (deployment.status === 'RUNNING' && deployment.containerId && deployment.nodeId) {
      const { node } = await this.deploymentsService.getWorkerForDeployment(
        user.sub, projectId, appId, id,
      );
      const workerUrl = `http://${node.ip}:4000/containers/${deployment.containerId}/logs`;
      const upstream = await fetch(workerUrl, {
        headers: { 'x-worker-secret': process.env.WORKER_SECRET ?? '' },
      });
      if (!upstream.ok || !upstream.body) {
        res.write('data: [failed to connect to worker]\n\n');
        res.write('event: end\ndata: done\n\n');
        res.end();
        return;
      }
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      res.on('close', () => reader.cancel());
      (async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) { res.end(); break; }
          res.write(decoder.decode(value, { stream: true }));
        }
      })();
      return;
    }

    const finished = ['FAILED', 'STOPPED'].includes(deployment.status);
    if (finished) {
      if (deployment.logs) {
        for (const line of deployment.logs.split('\n').filter(Boolean)) {
          res.write(`data: ${line}\n\n`);
        }
      }
      res.write('event: end\ndata: done\n\n');
      res.end();
      return;
    }

    const channel = `deployment:${id}:logs`;
    const historyKey = `deployment:${id}:log_history`;
    const sub = this.redis.duplicate();

    const cleanup = () => {
      void sub.unsubscribe(channel);
      sub.disconnect();
    };

    res.on('close', cleanup);

    const history = await this.redis.lrange(historyKey, 0, -1);
    for (const line of history) {
      res.write(`data: ${line}\n\n`);
    }

    await sub.subscribe(channel);
    sub.on('message', (_ch, line: string) => {
      if (line === '__done__') {
        res.write('event: end\ndata: done\n\n');
        res.end();
        cleanup();
        return;
      }
      res.write(`data: ${line}\n\n`);
    });
  }

  @Get(':id/terminal-info')
  @ApiOperation({ operationId: 'getTerminalInfo', summary: 'Get worker WebSocket URL for terminal' })
  @ApiOkResponse({ type: TerminalInfoResponseDto })
  async getTerminalInfo(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    assertTerminalRestEnabled();
    const { node, containerId } = await this.deploymentsService.getWorkerForDeployment(
      user.sub, projectId, appId, id,
    );
    return {
      wsUrl: `ws://${node.ip}:4000/containers/terminal`,
      containerId,
    };
  }
}

@ApiTags('internal')
@Controller('internal/deployments')
export class InternalDeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Public()
  @UseGuards(WorkerAuthGuard)
  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'updateDeploymentStatus',
    summary: 'Worker callback to update deployment status',
  })
  @ApiNoContentResponse()
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDeploymentStatusDto) {
    return this.deploymentsService.updateStatus(id, dto);
  }
}
