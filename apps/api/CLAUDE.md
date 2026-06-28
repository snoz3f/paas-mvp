# API — NestJS Control Plane

See root `CLAUDE.md` for full architecture. This file covers API-specific commands and patterns.

## Commands

```bash
pnpm run start:dev     # watch mode
pnpm run build         # SWC compile → dist/
pnpm run lint          # eslint --fix
pnpm run test          # jest unit tests
pnpm run test:e2e      # e2e (needs DB)

# Prisma
npx prisma migrate dev                    # create + apply migration (needs local PG)
npx prisma generate                       # regenerate client (no DB needed)
npx prisma migrate deploy                 # apply pending migrations in prod

# Prod migration (no local DB):
# 1. Write SQL manually in prisma/migrations/<timestamp>_<name>/migration.sql
# 2. On server: docker exec api-api-1 npx prisma migrate deploy
```

## Module structure

```
src/
  app.module.ts         ← root module, imports everything
  main.ts               ← bootstrap: port 5001, ValidationPipe, raw body for webhooks
  trpc/
    app-router.ts       ← pure TS router + all return type interfaces (no NestJS deps)
    trpc.service.ts     ← wires real services into router deps, maps to plain types
    trpc.module.ts
  auth/                 ← JWT login/register, AuthGuard, @Public() decorator
  github/               ← OAuth flow, repo listing, webhook registration
  apps/                 ← CRUD for App model, GitHub webhook auto-register on create
  projects/             ← CRUD for Project model
  deployments/          ← deploy/restart/stop, worker callback, stale reaper cron
  services/             ← Postgres/Redis provisioning via worker
  nodes/                ← worker node registration + heartbeat
  webhooks/             ← GitHub push webhook → auto-deploy
  scheduler/            ← resource-aware node selection
  worker-client/        ← sends jobs to worker via HTTP POST :4000/job
  prisma/               ← PrismaService singleton
  redis/                ← ioredis module (pub/sub for deployment logs)
  scheduler/            ← SchedulerService: picks ONLINE node with enough RAM+disk
```

## Key conventions

- **DTOs** use `class-validator` decorators; `ValidationPipe` is global with `whitelist: true`
- **Auth**: JWT Bearer in `Authorization` header; `AuthGuard` is default; use `@Public()` to skip
- **Worker callback**: `PATCH /internal/deployments/:id/status` authenticated via `x-worker-secret` header
- **Prisma client** lives in `src/generated/prisma/` (custom output path)
- **Env vars**: `DATABASE_URL`, `JWT_SECRET`, `WORKER_SECRET`, `API_URL`, `API_INTERNAL_URL`, `GH_CLIENT_ID`, `GH_CLIENT_SECRET`, `GH_CALLBACK_URL`, `REDIS_URL`
