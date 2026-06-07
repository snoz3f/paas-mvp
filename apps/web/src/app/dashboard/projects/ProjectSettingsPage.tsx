import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc';
import * as s from './ProjectSettingsPage.css';

const generalSchema = z.object({
  name: z.string().min(1, 'Required'),
});
type GeneralForm = z.infer<typeof generalSchema>;

export function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: project } = trpc.projects.get.useQuery({ id: id! });
  const { mutateAsync: updateProject, isPending: isSaving } = trpc.projects.update.useMutation();
  const { mutateAsync: deleteProject, isPending: isDeleting } = trpc.projects.delete.useMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GeneralForm>({
    resolver: zodResolver(generalSchema),
  });

  useEffect(() => {
    if (project) reset({ name: project.name });
  }, [project, reset]);

  const onSave = async (data: GeneralForm) => {
    await updateProject({ id: id!, ...data });
    await utils.projects.get.invalidate({ id: id! });
    await utils.projects.list.invalidate();
  };

  const onDelete = async () => {
    if (!confirm('Delete this project and all its apps? This cannot be undone.')) return;
    await deleteProject({ id: id! });
    await utils.projects.list.invalidate();
    void navigate('/dashboard');
  };

  return (
    <div className={s.shell}>
      <div className={s.topbar}>
        <button className={s.backBtn} onClick={() => void navigate(`/dashboard/projects/${id}`)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Project
        </button>
        <span className={s.topbarTitle}>Settings</span>
      </div>

      <div className={s.body}>
        <div className={s.inner}>
          {/* General */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>General</h2>
            <form onSubmit={handleSubmit(onSave)} className={s.form}>
              <Input label="Project name" error={errors.name?.message} {...register('name')} />
              <Button type="submit" loading={isSaving} width="auto">Save changes</Button>
            </form>
          </section>

          {/* Danger */}
          <section className={s.section}>
            <h2 className={s.sectionTitleDanger}>Danger zone</h2>
            <div className={s.dangerCard}>
              <div className={s.dangerRow}>
                <div>
                  <p className={s.dangerLabel}>Delete project</p>
                  <p className={s.dangerDesc}>Permanently deletes this project and all its apps and services.</p>
                </div>
                <Button variant="danger" width="auto" loading={isDeleting} onClick={() => void onDelete()}>
                  Delete project
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
