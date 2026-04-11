import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateProject } from '@/api/generated/projects/projects';
import * as s from './NewProjectPage.css';

const FRAMEWORKS = [
  { value: 'nodejs',   label: 'Node.js',  icon: '🟢' },
  { value: 'nestjs',   label: 'NestJS',   icon: '🔴' },
  { value: 'nextjs',   label: 'Next.js',  icon: '⚫' },
  { value: 'react',    label: 'React',    icon: '🔵' },
  { value: 'python',   label: 'Python',   icon: '🐍' },
  { value: 'docker',   label: 'Docker',   icon: '🐳' },
] as const;

type Framework = typeof FRAMEWORKS[number]['value'];

const schema = z.object({
  name: z
    .string()
    .min(2, 'At least 2 characters')
    .max(32, 'Max 32 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  repoUrl: z.string().url('Enter a valid URL'),
});

type FormData = z.infer<typeof schema>;

export function NewProjectPage() {
  const navigate = useNavigate();
  const [framework, setFramework] = useState<Framework | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: createProject, isPending } = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    try {
      const project = await createProject({
        data: { ...data, framework: framework ?? undefined },
      });
      void navigate(`/dashboard/projects/${project.id}`);
    } catch {
      setFormError('Failed to create project. Try again.');
    }
  };

  return (
    <>
      <div className={s.topbar}>
        <button className={s.backBtn} onClick={() => void navigate('/dashboard')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Projects
        </button>
        <span className={s.topbarTitle}>New project</span>
      </div>

      <div className={s.content}>
        <div className={s.card}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <p className={s.sectionTitle}>Project details</p>
                <p className={s.sectionDesc}>Basic information about your project</p>
              </div>
              <div className={s.sectionBody}>
                {formError && <div className={s.formError}>{formError}</div>}

                <div className={s.row}>
                  <Input
                    label="Project name"
                    placeholder="my-backend"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Repository URL"
                    placeholder="https://github.com/user/repo"
                    type="url"
                    error={errors.repoUrl?.message}
                    {...register('repoUrl')}
                  />
                </div>

                <div>
                  <span className={s.frameworkLabel}>Framework (optional)</span>
                  <div className={s.frameworkGrid}>
                    {FRAMEWORKS.map((fw) => (
                      <button
                        key={fw.value}
                        type="button"
                        className={
                          framework === fw.value
                            ? `${s.frameworkOption} ${s.frameworkOptionActive}`
                            : s.frameworkOption
                        }
                        onClick={() => setFramework(framework === fw.value ? null : fw.value)}
                      >
                        <span className={s.frameworkIcon}>{fw.icon}</span>
                        <span
                          className={
                            framework === fw.value
                              ? `${s.frameworkName} ${s.frameworkNameActive}`
                              : s.frameworkName
                          }
                        >
                          {fw.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={s.footer}>
              <Button
                type="button"
                variant="ghost"
                width="auto"
                onClick={() => void navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Create project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
