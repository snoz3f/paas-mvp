import { NotFoundException } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { assertTerminalEnabled, assertTerminalRestEnabled } from './terminal-enabled';

describe('terminal enabled gate', () => {
  const orig = process.env.TERMINAL_ENABLED;

  afterEach(() => {
    if (orig === undefined) {
      delete process.env.TERMINAL_ENABLED;
    } else {
      process.env.TERMINAL_ENABLED = orig;
    }
  });

  it('tRPC FORBIDDEN when TERMINAL_ENABLED unset', () => {
    delete process.env.TERMINAL_ENABLED;
    expect(() => assertTerminalEnabled()).toThrow(TRPCError);
    try {
      assertTerminalEnabled();
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).toBe('FORBIDDEN');
    }
  });

  it('tRPC FORBIDDEN when TERMINAL_ENABLED is not exactly true', () => {
    process.env.TERMINAL_ENABLED = 'false';
    expect(() => assertTerminalEnabled()).toThrow(TRPCError);
    process.env.TERMINAL_ENABLED = '1';
    expect(() => assertTerminalEnabled()).toThrow(TRPCError);
  });

  it('tRPC allows when TERMINAL_ENABLED === true', () => {
    process.env.TERMINAL_ENABLED = 'true';
    expect(() => assertTerminalEnabled()).not.toThrow();
  });

  it('REST 404 when flag unset', () => {
    delete process.env.TERMINAL_ENABLED;
    expect(() => assertTerminalRestEnabled()).toThrow(NotFoundException);
  });

  it('REST allows when TERMINAL_ENABLED === true', () => {
    process.env.TERMINAL_ENABLED = 'true';
    expect(() => assertTerminalRestEnabled()).not.toThrow();
  });
});
