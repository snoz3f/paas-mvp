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
