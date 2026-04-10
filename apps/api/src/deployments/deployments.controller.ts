import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import type { JwtPayload } from '@/auth/auth.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { DeploymentResponseDto } from './dto/deployment-response.dto';
import { UpdateDeploymentStatusDto } from './dto/update-deployment-status.dto';
import { WorkerAuthGuard } from './guards/worker-auth.guard';
import { DeploymentsService } from './deployments.service';

@ApiTags('deployments')
@ApiBearerAuth('access-token')
@Controller('projects/:projectId/deployments')
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  @ApiOperation({ operationId: 'createDeployment', summary: 'Trigger a new deployment' })
  @ApiCreatedResponse({ type: DeploymentResponseDto })
  create(@CurrentUser() user: JwtPayload, @Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.deploymentsService.create(user.sub, projectId);
  }

  @Get()
  @ApiOperation({ operationId: 'getDeployments', summary: 'List deployments for a project' })
  @ApiOkResponse({ type: [DeploymentResponseDto] })
  findAll(@CurrentUser() user: JwtPayload, @Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.deploymentsService.findAll(user.sub, projectId);
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getDeploymentById', summary: 'Get a deployment by ID' })
  @ApiOkResponse({ type: DeploymentResponseDto })
  findOne(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deploymentsService.findOne(user.sub, projectId, id);
  }

  @Post(':id/restart')
  @ApiOperation({ operationId: 'restartDeployment', summary: 'Restart a deployment' })
  @ApiCreatedResponse({ type: DeploymentResponseDto })
  restart(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deploymentsService.restart(user.sub, projectId, id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'stopDeployment', summary: 'Stop a running deployment' })
  @ApiOkResponse({ type: DeploymentResponseDto })
  stop(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deploymentsService.stop(user.sub, projectId, id);
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
