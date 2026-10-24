import { describe, expect, it } from 'vitest';
import { deploymentLogSessionKey } from './deployment-log-key';

describe('deploymentLogSessionKey', () => {
  it('changes when status goes from BUILDING to RUNNING so the log stream remounts', () => {
    const id = 'dep-1';
    expect(deploymentLogSessionKey('BUILDING', id)).not.toBe(
      deploymentLogSessionKey('RUNNING', id),
    );
  });
});
