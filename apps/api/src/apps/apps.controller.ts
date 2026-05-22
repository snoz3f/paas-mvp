import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '@/auth/auth.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AppResponseDto } from './dto/app-response.dto';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { AppsService } from './apps.service';

@ApiTags('apps')
@ApiBearerAuth('access-token')
@Controller('projects/:projectId/apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @ApiOperation({ operationId: 'createApp', summary: 'Create a new app in a project' })
  @ApiCreatedResponse({ type: AppResponseDto })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateAppDto,
  ) {
    return this.appsService.create(user.sub, projectId, dto);
  }

  @Get()
  @ApiOperation({ operationId: 'getApps', summary: 'List apps in a project' })
  @ApiOkResponse({ type: [AppResponseDto] })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.appsService.findAll(user.sub, projectId);
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAppById', summary: 'Get an app by ID' })
  @ApiOkResponse({ type: AppResponseDto })
  findOne(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.appsService.findOne(user.sub, projectId, id);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateApp', summary: 'Update an app' })
  @ApiOkResponse({ type: AppResponseDto })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAppDto,
  ) {
    return this.appsService.update(user.sub, projectId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'deleteApp', summary: 'Delete an app' })
  @ApiNoContentResponse()
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.appsService.remove(user.sub, projectId, id);
  }
}
