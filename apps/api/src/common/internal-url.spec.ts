import { internalCallbackUrl } from './internal-url';

describe('internalCallbackUrl', () => {
  const origInternal = process.env.API_INTERNAL_URL;
  const origPublic = process.env.API_URL;
  afterEach(() => {
    process.env.API_INTERNAL_URL = origInternal;
    process.env.API_URL = origPublic;
  });

  it('prefers API_INTERNAL_URL', () => {
    process.env.API_INTERNAL_URL = 'http://api:5001';
    process.env.API_URL = 'https://api.infral.dev';
    expect(internalCallbackUrl('/internal/services/x/status')).toBe(
      'http://api:5001/internal/services/x/status',
    );
  });

  it('falls back to API_URL', () => {
    delete process.env.API_INTERNAL_URL;
    process.env.API_URL = 'https://api.infral.dev';
    expect(internalCallbackUrl('/internal/services/x/status')).toBe(
      'https://api.infral.dev/internal/services/x/status',
    );
  });
});
