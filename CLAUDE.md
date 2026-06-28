# INFRAL — PaaS MVP

Self-hosted Railway/Render alternative for the CIS market. Users deploy apps from GitHub,
provision infra services (Postgres, Redis), and get a live URL — no DevOps required.

## Repo layout

```
paas-mvp/                   ← this repo (monorepo)
  apps/api/                 ← NestJS API (control plane)
  apps/web/                 ← React + Vite frontend
  infra/api/                ← docker-compose for API + Postgres + Redis
  infra/worker/             ← docker-compose for worker + Traefik + BuildKit
  infra/traefik/            ← Traefik edge router config

paas-worker/                ← separate repo, runs on the build node
```

## Commands

```bash
# Dev
pnpm api          # API in watch mode (apps/api)
pnpm web          # Vite dev server (apps/web)

# Build
pnpm build:api
pnpm build:web

# Prisma (run inside apps/api)
npx prisma migrate dev      # local DB required
npx prisma generate         # regenerate client without DB
npx prisma studio
```

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Vanilla Extract (CSS-in-JS), tRPC client, Zustand |
| API | NestJS, tRPC server, Prisma (PostgreSQL), JWT auth, argon2 |
| Worker | NestJS, Dockerode, simple-git, Railpack (build tool) |
| Infra | Traefik v3 (reverse proxy + wildcard TLS), Redis (pub/sub for logs), BuildKit |

## Architecture

```
Browser → Traefik → API (NestJS :5001)
                     ├── tRPC router (all client-facing ops)
                     ├── REST /internal/deployments/:id/status  ← worker callback
                     ├── REST /webhooks/github/:appId           ← GitHub push hook
                     └── SSE  /projects/.../deployments/.../logs ← build log stream

API → WorkerClientService → POST http://worker:4000/job
Worker → clones repo → Railpack or Docker build → runContainer (Traefik labels)
       → PATCH /internal/deployments/:id/status (status + URL)
```

### tRPC pattern
- `apps/api/src/trpc/app-router.ts` — pure TS router, zero NestJS/Prisma imports, defines all procedures and return interfaces
- `apps/api/src/trpc/trpc.service.ts` — NestJS service, wires `buildAppRouter(deps)` to real services, maps Prisma models to plain types via `toApp()` / `toDeployment()` etc.
- `apps/web/src/lib/trpc.ts` — client init, infers types from `AppRouter`

Adding a procedure: add to `AppRouterDeps` interface + `buildAppRouter` in `app-router.ts`, implement in `trpc.service.ts`.

### Deploy flow
1. User clicks Deploy → `trpc.deployments.create` → `DeploymentsService.create()`
2. `triggerDeploy()`: picks node via `SchedulerService.selectNode()` (resource-aware), sends job to worker
3. Worker: clones repo → `buildDir = workDir + rootDir` → Railpack/Docker build → detects port from image → `docker.runContainer()` with Traefik labels
4. Worker PATCHes callback URL → `DeploymentsService.updateStatus()` → status becomes RUNNING
5. Stale deployments (BUILDING/QUEUED > 15min) reaped by `@Cron('*/5 * * * *')`

### Port detection (worker)
`DockerService.getImageExposedPort()` inspects the built image:
1. Checks `Config.ExposedPorts` — explicit EXPOSE wins
2. If command/entrypoint contains `caddy` → returns 80 (Railpack static sites)
3. Falls back to `job.port ?? 3000`

### Auth
JWT Bearer tokens. `AuthGuard` on all API routes except `@Public()`. tRPC extracts token from `Authorization` header in `createContext()`.

### GitHub integration
- OAuth flow: `GET /auth/github` → GitHub → `GET /auth/github/callback` → stores `githubAccessToken` + `githubLogin` on User
- Webhook auto-deploy: on app create with GitHub token → registers push webhook → `POST /webhooks/github/:appId` → triggers deploy on default branch push
- `GITHUB_MOCK=true` env skips real OAuth for local dev

## Data model (Prisma)

```
User → Project[] → App[] → Deployment[]
                 → Service[]        (POSTGRES | REDIS)
Node                                (worker nodes, heartbeat)
Container                           (1:1 with Deployment)
```

Key App fields: `rootDir` (default `.`), `port` (default 3000), `ramMb`, `cpuMilli`, `diskGb`, `gitToken`, `webhookSecret`, `envVars` (JSON).

## Frontend structure

```
src/
  App.tsx                   ← React Router v6 routes
  app/
    auth/                   ← LoginPage, RegisterPage
    dashboard/
      DashboardLayout.tsx   ← sidebar nav + main scroll container
      projects/
        ProjectsPage        ← list all projects
        NewProjectPage      ← create project (name only)
        ProjectPage         ← project shell: sidebar (Apps + Infra) + useOutlet()
          NewAppPage        ← nested route: pick repo + rootDir + resources
          AppPage           ← nested route: meta card + resources + deployment list
          AppSettingsModal  ← modal: edit name + rootDir
          ProjectSettingsModal ← modal: rename/delete project
          NewServicePanel   ← infra catalog: Postgres/Redis cards + config modal
        DeploymentPage      ← full-page: build logs (SSE/XTerm) + terminal (WS/XTerm)
    admin/                  ← AdminOverviewPage, AdminNodesPage
  components/ui/            ← Button, Input, Badge, ResourceSlider, XTerm
  styles/tokens.css.ts      ← Vanilla Extract design tokens (dark theme, yellow accent)
```

### Routing
```
/dashboard/projects/:id                       ← ProjectPage (sidebar always visible)
/dashboard/projects/:id/apps/new              ← NewAppPage (nested, replaces content)
/dashboard/projects/:id/apps/:appId           ← AppPage (nested, replaces content)
/dashboard/projects/:id/apps/:appId/deployments/:deploymentId  ← DeploymentPage (full-page, outside ProjectPage)
```

ProjectPage uses `useOutlet()` — renders nested route content in its `<main>` area while keeping the sidebar visible.

### CSS conventions
Vanilla Extract only — no inline styles except one-offs. All tokens from `vars` in `tokens.css.ts`:
- Colors: `vars.color.bg` (#0a0a0a), `vars.color.surface` (#111), `vars.color.accent` (#f0e468 yellow)
- Fonts: DM Sans (body), Syne (headings), Martian Mono (code/terminal)

## Infra / Deployment

Production runs on a single Contabo VPS (`vmi3306500`).

```
Traefik (infral network, ports 80/443)
  ├── api.infral.dev   → api container :5001
  ├── infral.dev / app.infral.dev → Cloudflare Pages (web)
  └── *.infral.dev     → user app containers (wildcard cert via DNS-01)

API + Postgres + Redis    → infra/api/docker-compose.yml
Worker + BuildKit + Traefik(worker) → infra/worker/docker-compose.yml
```

CI: GitHub Actions builds Docker images on push to `master`, pushes to `ghcr.io/snoz3f/`.

Worker Traefik (`traefik:v3.0`) sits on the `infral` network alongside user containers and routes `*.infral.dev` sub-domains to them. The main Traefik (`traefik:v3.7`) handles public ingress.

## What's missing / roadmap

- **Billing** — no payment system yet
- **Real-time logs on DeploymentPage** — XTerm + SSE wired up but needs verification in prod
- **Env vars UI** — stored in DB but no edit UI in AppPage yet (only set at create time via API)
- **Custom domains** — schema has `domain` field, worker supports it, but no UI
- **Auto-deploy** webhook is implemented; needs testing end-to-end
- **Multi-node** — scheduler is resource-aware but only one worker node exists
