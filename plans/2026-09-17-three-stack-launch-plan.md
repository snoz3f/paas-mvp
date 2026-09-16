# Three-stack launch cut Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut INFRAL to a launchable slice: required immutable Static/Node/Python picker, hide terminal/billing/custom-domain UI, keep Postgres/Redis and the worker unchanged.

**Architecture:** Lock the stack at the tRPC/REST boundary (`framework` enum on create, omitted on update). The picker is a stored label only — Railpack/Dockerfile still decide the build. Hide extra product surfaces in the web app; do not delete worker terminal, `domain` on App, or `getTerminalInfo`.

**Tech Stack:** NestJS, tRPC v11, Zod 4, class-validator, Prisma (no migration), React 19, React Hook Form, Vanilla Extract, React Router v7, Jest (`apps/api` only).

**Spec:** `plans/2026-09-17-three-stack-launch-design.md`

## Global Constraints

- Advertised stacks only: `static`, `node`, `python`. UI labels: Static, Node, Python.
- `framework` required on create, immutable after. `null` only for apps created before this cut.
- Picker does not set port, root dir, env, or build tool.
- Do not change Prisma schema. Do not migrate existing rows.
- Do not modify `paas-worker`. Do not send `framework` in the worker job.
- Do not delete `deployments.getTerminalInfo`, terminal gateway, `App.domain`, or services (Postgres/Redis).
- `apps.update` keeps `domain`. UI must not send `domain` (not even `null`).
- No billing, no pricing table, no roadmap / Later block on the landing page.
- Vanilla Extract only in `apps/web`. Tokens from `apps/web/src/styles/tokens.css.ts`. No inline styles.
- If `apps.update` already has a domain regex in the working tree, keep it. Only remove `framework` from that input.
- Do not touch `/dashboard/settings`, `/admin`, ProjectPage infra, webhooks, scheduler.

---

## File map

| File | Responsibility |
|---|---|
| `apps/api/src/trpc/app-router.ts` | `AppFramework` type, zod create/update inputs, deps signatures |
| `apps/api/src/trpc/app-router.spec.ts` | Contract tests (create enum, update strips framework) |
| `apps/api/src/trpc/trpc.service.ts` | Stop writing `framework` on update; narrow `toApp` |
| `apps/api/src/apps/dto/create-app.dto.ts` | Required `IsIn(['static','node','python'])` |
| `apps/api/src/apps/dto/update-app.dto.ts` | Remove `framework` |
| `apps/api/src/apps/dto/create-app.dto.spec.ts` | DTO validation tests |
| `apps/api/src/apps/apps.service.ts` | No logic change if DTO no longer contains `framework` on update |
| `apps/web/src/lib/frameworks.ts` | Label map + `frameworkLabel()` |
| `apps/web/src/app/dashboard/projects/NewAppPage.tsx` | Required picker, send `framework` |
| `apps/web/src/app/dashboard/projects/NewProjectPage.css.ts` | Picker styles |
| `apps/web/src/app/dashboard/projects/AppPage.tsx` | Stack labels; drop `appDomain` prop |
| `apps/web/src/app/dashboard/projects/AppSettingsModal.tsx` | Remove custom domain; omit `domain` on save |
| `apps/web/src/app/dashboard/projects/DeploymentPage.tsx` | Logs only |
| `apps/web/src/app/dashboard/projects/DeploymentPage.css.ts` | Drop unused tab styles |
| `apps/web/src/app/dashboard/DashboardLayout.tsx` | Remove Billing nav |
| `apps/web/src/App.tsx` | `/dashboard/billing` → `/dashboard` |
| `apps/web/src/app/landing/LandingPage.tsx` | Three stacks, no prices, no terminal, no roadmap |
| `apps/web/src/app/landing/landing.css.ts` | Delete dead pricing styles |

Do not create files in `paas-worker`. Do not edit `apps/api/prisma/schema.prisma`.

---

### Task 1: API contract — framework enum

**Files:**
- Create: `apps/api/src/trpc/app-router.spec.ts`
- Create: `apps/api/src/apps/dto/create-app.dto.spec.ts`
- Modify: `apps/api/src/trpc/app-router.ts`
- Modify: `apps/api/src/trpc/trpc.service.ts`
- Modify: `apps/api/src/apps/dto/create-app.dto.ts`
- Modify: `apps/api/src/apps/dto/update-app.dto.ts`

**Interfaces:**
- Consumes: existing `buildAppRouter`, `App`, `AppRouterDeps`
- Produces:
  - `export const APP_FRAMEWORKS = ['static', 'node', 'python'] as const`
  - `export type AppFramework = (typeof APP_FRAMEWORKS)[number]`
  - `export const appFrameworkSchema = z.enum(APP_FRAMEWORKS)`
  - `export function parseAppFramework(value: string | null | undefined): AppFramework | null`
  - `export const createAppInput` / `export const updateAppInput` (zod objects used by the procedures)
  - `App.framework: AppFramework | null`
  - `createApp(..., d: { ..., framework: AppFramework; ... })`
  - `updateApp(..., d: { ... no framework ... })`

- [ ] **Step 1: Write the failing contract tests**

Create `apps/api/src/trpc/app-router.spec.ts`:

```ts
import { createAppInput, parseAppFramework, updateAppInput } from './app-router';

const baseCreate = {
  projectId: '11111111-1111-1111-1111-111111111111',
  name: 'my-app',
  repoUrl: 'https://github.com/acme/app',
};

describe('createAppInput', () => {
  it('rejects missing framework', () => {
    expect(createAppInput.safeParse(baseCreate).success).toBe(false);
  });

  it('rejects unknown framework', () => {
    expect(createAppInput.safeParse({ ...baseCreate, framework: 'go' }).success).toBe(false);
    expect(createAppInput.safeParse({ ...baseCreate, framework: 'nestjs' }).success).toBe(false);
    expect(createAppInput.safeParse({ ...baseCreate, framework: '' }).success).toBe(false);
  });

  it('accepts static, node, python', () => {
    for (const framework of ['static', 'node', 'python'] as const) {
      const parsed = createAppInput.parse({ ...baseCreate, framework });
      expect(parsed.framework).toBe(framework);
    }
  });
});

describe('updateAppInput', () => {
  it('strips framework so the stack cannot change', () => {
    const parsed = updateAppInput.parse({
      projectId: '11111111-1111-1111-1111-111111111111',
      id: '22222222-2222-2222-2222-222222222222',
      name: 'renamed',
      framework: 'python',
    });
    expect(parsed).not.toHaveProperty('framework');
    expect(parsed.name).toBe('renamed');
  });
});

describe('parseAppFramework', () => {
  it('keeps known values and maps anything else to null', () => {
    expect(parseAppFramework('python')).toBe('python');
    expect(parseAppFramework('node')).toBe('node');
    expect(parseAppFramework('static')).toBe('static');
    expect(parseAppFramework(null)).toBeNull();
    expect(parseAppFramework(undefined)).toBeNull();
    expect(parseAppFramework('nestjs')).toBeNull();
  });
});
```

Create `apps/api/src/apps/dto/create-app.dto.spec.ts`:

```ts
import { validate } from 'class-validator';
import { CreateAppDto } from './create-app.dto';
import { UpdateAppDto } from './update-app.dto';

function createDto(overrides: Partial<CreateAppDto> = {}): CreateAppDto {
  const dto = new CreateAppDto();
  dto.name = 'app';
  dto.repoUrl = 'https://github.com/acme/app';
  Object.assign(dto, overrides);
  return dto;
}

describe('CreateAppDto', () => {
  it('requires framework', async () => {
    const errors = await validate(createDto());
    expect(errors.some((e) => e.property === 'framework')).toBe(true);
  });

  it('rejects values outside static|node|python', async () => {
    const errors = await validate(createDto({ framework: 'go' as CreateAppDto['framework'] }));
    expect(errors.some((e) => e.property === 'framework')).toBe(true);
  });

  it('accepts python', async () => {
    const errors = await validate(createDto({ framework: 'python' }));
    expect(errors.filter((e) => e.property === 'framework')).toHaveLength(0);
  });
});

describe('UpdateAppDto', () => {
  it('forbids framework as a non-whitelisted property', async () => {
    const dto = new UpdateAppDto();
    dto.name = 'renamed';
    (dto as UpdateAppDto & { framework?: string }).framework = 'python';
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter api test -- app-router.spec.ts create-app.dto.spec.ts`

Expected: FAIL — `createAppInput` / `parseAppFramework` not exported, CreateAppDto.framework still optional.

- [ ] **Step 3: Implement types and schemas in `app-router.ts`**

Add after the tRPC init, before `export interface Project`:

```ts
export const APP_FRAMEWORKS = ['static', 'node', 'python'] as const;
export type AppFramework = (typeof APP_FRAMEWORKS)[number];
export const appFrameworkSchema = z.enum(APP_FRAMEWORKS);

export function parseAppFramework(value: string | null | undefined): AppFramework | null {
  if (value === 'static' || value === 'node' || value === 'python') return value;
  return null;
}
```

Change `App.framework` from `string | null` to `AppFramework | null`.

Change `AppRouterDeps.createApp` data to `framework: AppFramework` (required, not optional).

Remove `framework?: string | null` from `AppRouterDeps.updateApp`.

Export the procedure inputs (same objects the router uses — do not duplicate):

```ts
export const createAppInput = z.object({
  projectId: z.string(),
  name: z.string().min(1),
  repoUrl: z.string().url(),
  rootDir: z.string().optional(),
  framework: appFrameworkSchema,
  port: z.number().optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  gitToken: z.string().optional(),
  ramMb: z.number().int().optional(),
  cpuMilli: z.number().int().optional(),
  diskGb: z.number().int().optional(),
});

export const updateAppInput = z.object({
  projectId: z.string(),
  id: z.string(),
  name: z.string().optional(),
  repoUrl: z.string().url().optional(),
  rootDir: z.string().optional(),
  domain: z.string().regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/, 'Invalid domain').refine(d => !d.endsWith('.infral.dev') && d !== 'infral.dev', 'Cannot use infral.dev domain').nullable().optional(),
  port: z.number().optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  gitToken: z.string().nullable().optional(),
  ramMb: z.number().int().optional(),
  cpuMilli: z.number().int().optional(),
  diskGb: z.number().int().optional(),
});
```

If the current `domain` field in the file is still `z.string().nullable().optional()` with no regex, copy that version instead — do not invent a regex. Never add `framework` to `updateAppInput`.

Wire procedures:

```ts
create: protectedProcedure
  .input(createAppInput)
  .mutation(({ ctx, input: { projectId, ...data } }) =>
    deps.createApp(ctx.userId, projectId, data)),

update: protectedProcedure
  .input(updateAppInput)
  .mutation(({ ctx, input: { projectId, id, ...data } }) =>
    deps.updateApp(ctx.userId, projectId, id, data)),
```

- [ ] **Step 4: REST DTOs**

`create-app.dto.ts` — replace optional framework with:

```ts
import { IsIn, IsInt, IsObject, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator';

  @ApiProperty({ enum: ['static', 'node', 'python'], example: 'node' })
  @IsIn(['static', 'node', 'python'])
  framework: 'static' | 'node' | 'python';
```

Remove `@IsOptional()` and `@IsString()` from that field. Keep other fields as they are.

`update-app.dto.ts` — delete the `framework` property entirely (the `@ApiPropertyOptional` / `@IsString` / `@IsOptional` block). Leave `domain`.

- [ ] **Step 5: `trpc.service.ts`**

Import `parseAppFramework` and `AppFramework`.

`SafeApp.framework` stays `string | null` (Prisma). `toApp` must return `AppFramework | null`:

```ts
domain: a.domain, framework: parseAppFramework(a.framework), port: a.port,
```

`updateApp` mapping — remove `framework: d.framework ?? undefined`:

```ts
updateApp: async (userId, projectId, id, d) =>
  this.toApp(await this.apps.update(userId, projectId, id, {
    ...d,
    domain: d.domain ?? undefined,
    gitToken: d.gitToken ?? undefined,
  }) as SafeApp),
```

`createApp` already spreads `d`; `framework` is now required on `d`, so Prisma gets it. No extra mapping.

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm --filter api test -- app-router.spec.ts create-app.dto.spec.ts`

Expected: PASS, all cases green.

- [ ] **Step 7: Typecheck API**

Run: `pnpm --filter api build`

Expected: compile succeeds. If `UpdateAppDto` still has `framework` referenced in `trpc.service.ts`, the previous step missed a field.

- [ ] **Step 8: Commit**

```bash
git add apps/api/src/trpc/app-router.ts apps/api/src/trpc/app-router.spec.ts \
  apps/api/src/trpc/trpc.service.ts \
  apps/api/src/apps/dto/create-app.dto.ts apps/api/src/apps/dto/update-app.dto.ts \
  apps/api/src/apps/dto/create-app.dto.spec.ts
git commit -m "feat(api): lock app framework to static|node|python"
```

---

### Task 2: Hide billing, terminal, custom domain

**Files:**
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/app/dashboard/DashboardLayout.tsx`
- Modify: `apps/web/src/app/dashboard/projects/DeploymentPage.tsx`
- Modify: `apps/web/src/app/dashboard/projects/DeploymentPage.css.ts`
- Modify: `apps/web/src/app/dashboard/projects/AppSettingsModal.tsx`
- Modify: `apps/web/src/app/dashboard/projects/AppPage.tsx`

**Interfaces:**
- Consumes: `trpc.apps.update` without `framework` (Task 1). `getTerminalInfo` remains on the router but this task stops calling it.
- Produces: no Billing nav/route; DeploymentPage is logs-only; AppSettingsModal save payload `{ projectId, id, name, rootDir, envVars }` with no `domain`.

- [ ] **Step 1: Remove Billing from nav and routes**

In `DashboardLayout.tsx`, delete the NAV_ITEMS entry whose `to` is `'/dashboard/billing'` (label `Billing`). Leave Projects and Settings.

In `App.tsx`, replace:

```tsx
<Route path="billing" element={<Placeholder title="Billing" />} />
```

with:

```tsx
<Route path="billing" element={<Navigate to="/dashboard" replace />} />
```

Leave `<Route path="settings" element={<Placeholder title="Settings" />} />`.

- [ ] **Step 2: DeploymentPage — logs only**

Remove `type Tab`, `tab` state, and the `getTerminalInfo` query.

Delete the `<div className={s.tabs}>...</div>` block (Logs / Terminal buttons).

Keep a single panel:

```tsx
<div className={s.termPanel}>
  {logsUrl ? <XTerm logsUrl={logsUrl} /> : <div className={s.errorMsg}>No deployment selected.</div>}
</div>
```

Restart / stop / meta / SSE logs URL stay. Do not delete `XTerm` — logs still use it.

In `DeploymentPage.css.ts`, delete `tabs`, `tab`, and `tabActive` exports.

- [ ] **Step 3: AppSettingsModal — drop custom domain**

Remove `domain` from the zod schema and `defaultValues`. Remove `watch('domain')` and `domainValue`.

Delete the Custom domain `<Input>` and the CNAME / TLS hint block.

Change the props interface: remove `appDomain`.

`onSave` must not pass `domain`:

```ts
const onSave = async (data: Form) => {
  const envVars = Object.fromEntries(
    envPairs.filter((p) => p.key.trim()).map((p) => [p.key.trim(), p.value]),
  );
  await updateApp({ projectId, id: appId, name: data.name, rootDir: data.rootDir, envVars });
  await utils.apps.get.invalidate({ projectId, id: appId });
  onClose();
};
```

Keep name, rootDir, env vars rows, Add variable, Save.

- [ ] **Step 4: AppPage — stop passing domain into settings**

Remove `appDomain={app.domain}` from `<AppSettingsModal />`. Do **not** remove the meta item labeled `Domain` that renders `activeDeployment.url` — that is the live `*.infral.dev` URL.

- [ ] **Step 5: Verify hide-cut**

Run: `pnpm --filter web build`

Expected: `tsc -b && vite build` succeeds.

Then grep:

```bash
rg "dashboard/billing" apps/web/src --glob '!App.tsx'
rg "getTerminalInfo" apps/web/src
rg "Custom domain" apps/web/src
rg "label=\"Billing\"" apps/web/src
```

Expected: no Billing nav; `getTerminalInfo` unused in web; no "Custom domain" copy; `App.tsx` still contains the billing redirect route.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/App.tsx apps/web/src/app/dashboard/DashboardLayout.tsx \
  apps/web/src/app/dashboard/projects/DeploymentPage.tsx \
  apps/web/src/app/dashboard/projects/DeploymentPage.css.ts \
  apps/web/src/app/dashboard/projects/AppSettingsModal.tsx \
  apps/web/src/app/dashboard/projects/AppPage.tsx
git commit -m "fix(web): hide terminal, billing, and custom domain"
```

---

### Task 3: Required stack picker and labels

**Files:**
- Create: `apps/web/src/lib/frameworks.ts`
- Modify: `apps/web/src/app/dashboard/projects/NewAppPage.tsx`
- Modify: `apps/web/src/app/dashboard/projects/NewProjectPage.css.ts`
- Modify: `apps/web/src/app/dashboard/projects/AppPage.tsx`

**Interfaces:**
- Consumes: `AppFramework` and `APP_FRAMEWORKS` from `@api/trpc/app-router` (Task 1). `createApp` now requires `framework`.
- Produces:
  - `frameworkLabel(framework: AppFramework | null): string`
  - `FRAMEWORK_OPTIONS: { value: AppFramework; label: string }[]`
  - NewAppPage always submits `framework: 'static' | 'node' | 'python'`

- [ ] **Step 1: Shared labels**

Create `apps/web/src/lib/frameworks.ts`:

```ts
import type { AppFramework } from '@api/trpc/app-router';

export const FRAMEWORK_OPTIONS: { value: AppFramework; label: string }[] = [
  { value: 'static', label: 'Static' },
  { value: 'node', label: 'Node' },
  { value: 'python', label: 'Python' },
];

export function frameworkLabel(framework: AppFramework | null): string {
  if (!framework) return '—';
  return FRAMEWORK_OPTIONS.find((o) => o.value === framework)?.label ?? '—';
}
```

- [ ] **Step 2: Picker styles**

Append to `NewProjectPage.css.ts` (NewAppPage already imports this file):

```ts
export const stackSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const stackLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const stackGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space.sm,
});

export const stackOption = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.md} ${vars.space.sm}`,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    borderColor: vars.color.borderHover,
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const stackOptionActive = style({
  borderColor: vars.color.accent,
  color: vars.color.text,
  backgroundColor: 'rgba(240,228,104,0.06)',
  boxShadow: `inset 0 0 0 1px ${vars.color.accent}`,
});

export const stackOptionLabel = style({
  fontSize: vars.font.size.sm,
  fontWeight: '600',
});
```

- [ ] **Step 3: NewAppPage picker**

Import `siNodedotjs` and `siPython` from `simple-icons`, `FRAMEWORK_OPTIONS`, and `type AppFramework`.

Add `framework` to the form schema (required enum). Keep the existing `name` rules:

```ts
import { FRAMEWORK_OPTIONS } from '@/lib/frameworks';
import type { AppFramework } from '@api/trpc/app-router';
import { siNodedotjs, siPython } from 'simple-icons';

const schema = z.object({
  name: z
    .string()
    .min(2, 'At least 2 characters')
    .max(32, 'Max 32 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  framework: z.enum(['static', 'node', 'python']),
});
```

In `useForm`, add `setValue` and `watch` (already has `setValue` via the repo handler — use the same form):

```ts
const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
const selectedFramework = watch('framework');
```

Do not default `framework`. Do not change `ramMb` / `cpuMilli` / `diskGb` / `port` based on the stack.

Picker UI — insert in the right column **after** Root directory, **before** Resources:

```tsx
<div className={s.stackSection}>
  <span className={s.stackLabel}>Stack</span>
  <div className={s.stackGrid}>
    {FRAMEWORK_OPTIONS.map((opt) => (
      <button
        key={opt.value}
        type="button"
        className={selectedFramework === opt.value ? `${s.stackOption} ${s.stackOptionActive}` : s.stackOption}
        onClick={() => setValue('framework', opt.value, { shouldValidate: true, shouldDirty: true })}
      >
        {opt.value === 'node' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={`#${siNodedotjs.hex}`} role="img">
            <path d={siNodedotjs.path} />
          </svg>
        )}
        {opt.value === 'python' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={`#${siPython.hex}`} role="img">
            <path d={siPython.path} />
          </svg>
        )}
        {opt.value === 'static' && (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="14" height="12" rx="2" />
            <path d="M2 7h14" />
          </svg>
        )}
        <span className={s.stackOptionLabel}>{opt.label}</span>
      </button>
    ))}
  </div>
  {errors.framework && <div className={s.formError}>{errors.framework.message ?? 'Select a stack'}</div>}
</div>
```

`onSubmit` must send `framework` and must not invent a port:

```ts
const onSubmit = async (data: FormData) => {
  if (!selectedRepo) {
    setFormError('Please select a repository.');
    return;
  }
  setFormError(null);
  try {
    await createApp({
      projectId: projectId!,
      name: data.name,
      repoUrl: selectedRepo.url,
      rootDir: rootDir || '.',
      framework: data.framework,
      ramMb,
      cpuMilli,
      diskGb,
    });
    void navigate(`/dashboard/projects/${projectId}`);
  } catch {
    setFormError('Failed to create app. Try again.');
  }
};
```

Submit button stays disabled when there is no GitHub / repo. Do not disable it solely for missing framework — RHF shows the stack error instead.

- [ ] **Step 4: AppPage label**

```ts
import { frameworkLabel } from '@/lib/frameworks';
```

Replace `{app.framework ?? '—'}` with `{frameworkLabel(app.framework)}`.

Do not add a stack editor in Settings.

- [ ] **Step 5: Verify picker**

Run: `pnpm --filter web build`

Expected: success. `createApp` type error if `framework` is omitted.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/frameworks.ts \
  apps/web/src/app/dashboard/projects/NewAppPage.tsx \
  apps/web/src/app/dashboard/projects/NewProjectPage.css.ts \
  apps/web/src/app/dashboard/projects/AppPage.tsx
git commit -m "feat(web): require static|node|python stack on app create"
```

---

### Task 4: Landing — three stacks, no prices

**Files:**
- Modify: `apps/web/src/app/landing/LandingPage.tsx`
- Modify: `apps/web/src/app/landing/landing.css.ts`

**Interfaces:**
- Consumes: none from previous tasks
- Produces: public landing that promises Static / Node / Python, git-deploy, logs, env, Postgres/Redis; no pricing, no terminal, no custom domains, no roadmap

- [ ] **Step 1: Replace FEATURES and delete PRICING**

Delete the entire `PRICING` array.

Replace `FEATURES` with these six cards (same SVG stroke style as existing cards, 18×18):

```ts
const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="14" height="14" rx="3" />
        <path d="M6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Git push → deploy',
    desc: 'Подключи репо, и каждый пуш собирает образ через Railpack или Dockerfile и выкатывает контейнер.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="10" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="10" width="5" height="5" rx="1" />
      </svg>
    ),
    title: 'Static, Node, Python',
    desc: 'Три стека. Без YAML и без кластера — выбрал репо, указал стек, получил URL.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 5h12M3 9h8M3 13h10" />
      </svg>
    ),
    title: 'Лог-стриминг в реальном времени',
    desc: 'Видишь вывод билда прямо в браузере — без SSH, без tail -f.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h10v10H4z" />
        <path d="M8 2v2M10 2v2M8 14v2M10 14v2M2 8h2M2 10h2M14 8h2M14 10h2" />
      </svg>
    ),
    title: 'Env Variables',
    desc: 'Секреты и конфиги в приложении. Доступны в рантайме контейнера.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="9" cy="5" rx="6" ry="2.5" />
        <path d="M3 5v8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5" />
      </svg>
    ),
    title: 'Postgres и Redis',
    desc: 'Managed-сервисы в сети проекта. Connection string копируешь в env приложения.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" />
        <path d="M9 6v3l2 2" />
      </svg>
    ),
    title: 'История деплоев',
    desc: 'Список деплоев со статусами. Редеплой одной кнопкой.',
  },
];
```

Do not add a seventh card. Do not add a Later / roadmap section.

- [ ] **Step 2: Nav, hero, footer, delete pricing section**

Nav links — only features:

```tsx
<div className={s.navLinks}>
  <a href="#features" className={s.navLink}>Возможности</a>
</div>
```

Hero subtitle:

```tsx
<p className={s.heroSub}>
  PaaS для Static, Node и Python. Push в git — живой URL на *.infral.dev.
  Никаких YAML, никаких кластеров.
</p>
```

Keep the beta badge, primary CTA to `/register`, `git push origin main` mock.

Delete the whole `{/* Pricing */}` section (divider + `#pricing` + `PRICING.map`).

Footer — drop the Цены link:

```tsx
<div className={s.footerLinks}>
  <a href="#features" className={s.footerLink}>Возможности</a>
  <a href="https://t.me/infraldev" className={s.footerLink}>Telegram</a>
</div>
```

CTA card copy may keep «Первый проект — бесплатно» / «Начать бесплатно». That is not a pricing table.

Do not mention веб-терминал, кастомные домены, Hobby/Pro/Team, `$12`, `$39`.

- [ ] **Step 3: Delete dead pricing CSS**

In `landing.css.ts`, delete the entire `// ── Pricing` block: `pricingGrid`, `pricingCard`, `pricingCardFeatured`, `pricingBadge`, `pricingName`, `pricingPrice`, `pricingAmount`, `pricingAmountAccent`, `pricingPeriod`, `pricingDesc`, `pricingFeatures`, `pricingFeatureRow`, `pricingCheck`, `pricingBtn`, `pricingBtnPrimary`.

Leave `ctaSection` / `ctaCard` / footer styles.

- [ ] **Step 4: Verify landing**

Run: `pnpm --filter web build`

Expected: success (no leftover `s.pricing*` imports).

```bash
rg -n "pricing|Веб-терминал|Custom domain|roadmap|Later|Hobby|\\$12" apps/web/src/app/landing
```

Expected: no matches (except maybe none). Hero/features still contain `Static`, `Node`, `Python`, `Postgres`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/landing/LandingPage.tsx apps/web/src/app/landing/landing.css.ts
git commit -m "feat(web): land three-stack beta without pricing"
```

---

### Task 5: End-to-end check against the spec

**Files:** none new. Read-only verification.

- [ ] **Step 1: API contract again**

Run: `pnpm --filter api test -- app-router.spec.ts create-app.dto.spec.ts`

Expected: PASS.

- [ ] **Step 2: Builds**

Run:

```bash
pnpm --filter api build
pnpm --filter web build
```

Expected: both succeed.

- [ ] **Step 3: Grep the cut**

```bash
rg "getTerminalInfo" apps/web/src
rg "label=\"Billing\"" apps/web/src
rg "Custom domain" apps/web/src
rg "PRICING|#pricing|Веб-терминал" apps/web/src
rg "framework" apps/api/src/apps/dto/update-app.dto.ts
```

Expected: no terminal query; no Billing label; no Custom domain; no landing pricing/terminal; `update-app.dto.ts` has no `framework`.

- [ ] **Step 4: Manual UI (when `pnpm web` / `pnpm api` are up)**

1. `/` — no «Цены», no terminal feature, Static/Node/Python visible, no roadmap.
2. New app — submit without stack shows form error, no request.
3. Create with Python — AppPage shows «Python»; Settings has no domain field; env vars still save.
4. Deployment page — logs, no Terminal tab.
5. Sidebar has no Billing; `/dashboard/billing` redirects to `/dashboard`.
6. Project still has Infra → Postgres/Redis catalog.

Do not deploy a worker change. Do not run worker tests.

- [ ] **Step 5: No extra commit unless Step 4 found a bug**

If a check fails, fix in the owning task's files and commit `fix: <what broke>`. Do not bundle unrelated edits.

---

## Notes for the implementer

- `apps/web` has no Jest/Vitest. Do not add a test runner in this cut.
- `XTerm` stays: logs SSE still need it. Only the exec/terminal path goes away from the page.
- Old apps with `framework = null` or leftover strings like `nestjs` render as «—» via `parseAppFramework` + `frameworkLabel`.
- Worker job payload is unchanged. A Go repo with a Dockerfile will still build.
