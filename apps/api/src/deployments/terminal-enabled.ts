import { NotFoundException } from '@nestjs/common';
import { TRPCError } from '@trpc/server';

export function isTerminalEnabled(): boolean {
  return process.env.TERMINAL_ENABLED === 'true';
}

/** tRPC getTerminalInfo — FORBIDDEN unless TERMINAL_ENABLED === 'true'. */
export function assertTerminalEnabled(): void {
  if (!isTerminalEnabled()) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Terminal disabled' });
  }
}

/** REST GET .../terminal-info — 404 unless TERMINAL_ENABLED === 'true'. */
export function assertTerminalRestEnabled(): void {
  if (!isTerminalEnabled()) {
    throw new NotFoundException();
  }
}
