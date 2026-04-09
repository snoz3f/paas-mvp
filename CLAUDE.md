# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development (watch mode)
pnpm run start:dev

# Build
pnpm run build

# Production
pnpm run start:prod

# Lint (auto-fix)
pnpm run lint

# Format
pnpm run format

# Unit tests
pnpm run test

# Run a single test file
pnpm run test -- --testPathPattern=app.controller

# Unit tests in watch mode
pnpm run test:watch

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Architecture

This is a NestJS application (MVP stage) using the standard NestJS module architecture:

- **`src/main.ts`** — Bootstrap entry point; listens on `PORT` env var or `3000`
- **`src/app.module.ts`** — Root module; imports all feature modules
- **Controllers** handle HTTP routing; **Services** contain business logic; **Modules** wire them together

NestJS uses dependency injection via decorators (`@Injectable`, `@Controller`, `@Module`). New features should follow the module pattern: create a dedicated module directory with `*.module.ts`, `*.controller.ts`, and `*.service.ts` files, then import the module into `AppModule`.

Unit test files (`*.spec.ts`) live alongside source files in `src/`. E2E tests are in `test/` and use a separate Jest config (`test/jest-e2e.json`).
