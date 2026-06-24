import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import type { JwtPayload } from '@/auth/auth.service';
import { GithubService, type GithubRepo } from './github.service';

@ApiTags('github')
@Controller()
export class GithubController {
  constructor(private readonly github: GithubService) {}

  @Get('auth/github/url')
  @ApiOperation({ operationId: 'getGithubOAuthUrl', summary: 'Get GitHub OAuth authorization URL' })
  @ApiOkResponse({ schema: { properties: { url: { type: 'string' } } } })
  async getOAuthUrl(@CurrentUser() user: JwtPayload): Promise<{ url: string }> {
    const url = await this.github.getOAuthUrl(user.sub);
    return { url };
  }

  @Public()
  @Get('auth/github/callback')
  @ApiOperation({ operationId: 'githubCallback', summary: 'GitHub OAuth callback' })
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.github.handleCallback(code, state);
    res.redirect(`${process.env.FRONTEND_URL ?? 'https://infral.dev'}/dashboard/projects/new?github=connected`);
  }

  @Public()
  @Get('auth/github/mock-connect')
  @ApiOperation({ operationId: 'githubMockConnect', summary: 'Instantly connect GitHub (dev mock only)' })
  async mockConnect(
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!this.github.isMock) {
      res.status(404).send('Not found');
      return;
    }
    await this.github.handleCallbackWithMock(state);
    res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/dashboard/projects/new?github=connected`);
  }

  @Get('github/repos')
  @ApiOperation({ operationId: 'listGithubRepos', summary: 'List GitHub repositories for current user' })
  @ApiOkResponse({ schema: { type: 'array', items: { properties: { id: { type: 'number' }, fullName: { type: 'string' }, name: { type: 'string' }, private: { type: 'boolean' }, url: { type: 'string' }, defaultBranch: { type: 'string' } } } } })
  async listRepos(@CurrentUser() user: JwtPayload): Promise<GithubRepo[]> {
    return this.github.getRepos(user.sub);
  }
}
