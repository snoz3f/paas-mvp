import {
  Body,
  Controller,
  Delete,
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
import { WorkerAuthGuard } from '@/deployments/guards/worker-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth('access-token')
@Controller('projects/:projectId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ operationId: 'createService', summary: 'Add a service to a project' })
  @ApiCreatedResponse({ type: ServiceResponseDto })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.create(user.sub, projectId, dto);
  }

  @Get()
  @ApiOperation({ operationId: 'getServices', summary: 'List services for a project' })
  @ApiOkResponse({ type: [ServiceResponseDto] })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.servicesService.findAll(user.sub, projectId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'deleteService', summary: 'Remove a service from a project' })
  @ApiNoContentResponse()
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.servicesService.remove(user.sub, projectId, id);
  }
}

@ApiTags('internal')
@Controller('internal/services')
export class InternalServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @UseGuards(WorkerAuthGuard)
  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'updateServiceStatus',
    summary: 'Worker callback to update service status',
  })
  @ApiNoContentResponse()
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceStatusDto,
  ) {
    return this.servicesService.updateStatus(id, dto);
  }
}
