import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc';
import * as s from './NewProjectPage.css';

const schema = z.object({
  name: z
    .string()
    .min(2, 'At least 2 characters')
    .max(32, 'Max 32 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
});

type FormData = z.infer<typeof schema>;

export function NewProjectPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: createProject, isPending } = trpc.projects.create.useMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    try {
      const project = await createProject({ name: data.name });
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

      <div className={s.content} style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
        <form className={s.rightCol} onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className={s.rightTitle}>Project details</p>

          <Input
            label="Project name"
            placeholder="my-backend"
            error={errors.name?.message}
            {...register('name')}
          />

          {formError && <div className={s.formError}>{formError}</div>}

          <div className={s.footer}>
            <Button type="submit" loading={isPending}>
              Create project
            </Button>
            <Button type="button" variant="ghost" onClick={() => void navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
