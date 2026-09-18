import { internalCallbackUrl } from './internal-url';

describe('internalCallbackUrl', () => {
  afterEach(() => {
    delete process.env.API_INTERNAL_URL;
    delete process.env.API_URL;
  });

  it('prefers API_INTERNAL_URL', () => {
    process.env.API_INTERNAL_URL = 'http://api:5001';
    process.env.API_URL = 'https://api.infral.dev';
    expect(internalCallbackUrl('/internal/services/x/status')).toBe(
      'http://api:5001/internal/services/x/status',
    );
  });

  it('falls back to API_URL and strips trailing slash', () => {
    process.env.API_URL = 'https://api.infral.dev/';
    expect(internalCallbackUrl('/internal/services/x/status')).toBe(
      'https://api.infral.dev/internal/services/x/status',
    );
  });
});
