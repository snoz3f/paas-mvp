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
