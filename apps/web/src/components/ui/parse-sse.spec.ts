import { describe, expect, it } from 'vitest';
import { consumeSse } from './parse-sse';

describe('consumeSse', () => {
  it('parses two message events and one end; partial tail stays in rest', () => {
    const fixture = [
      'data: cloning',
      'data: still cloning',
      '',
      'data: done line',
      '',
      'event: end',
      'data: done',
      '',
      'data: partial',
    ].join('\n');

    const { rest, events } = consumeSse(fixture);

    expect(events).toEqual([
      { event: 'message', data: 'cloning\nstill cloning' },
      { event: 'message', data: 'done line' },
      { event: 'end', data: 'done' },
    ]);
    expect(rest).toBe('data: partial');
  });

  it('ignores comments and retry lines', () => {
    const { rest, events } = consumeSse(': keep-alive\nretry: 3000\ndata: hello\n\n');
    expect(events).toEqual([{ event: 'message', data: 'hello' }]);
    expect(rest).toBe('');
  });
});
