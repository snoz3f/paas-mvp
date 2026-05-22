import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetProjectById,
  useUpdateProject,
  useDeleteProject,
  getGetProjectsQueryKey,
  getGetProjectByIdQueryKey,
} from '@/api/generated/projects/projects';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import * as s from './ProjectSettingsPage.css';

const generalSchema = z.object({
  name: z.string().min(1, 'Required'),
});
type GeneralForm = z.infer<typeof generalSchema>;

export function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project } = useGetProjectById(id!);
  const { mutateAsync: updateProject, isPending: isSaving } = useUpdateProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GeneralForm>({
    resolver: zodResolver(generalSchema),
  });

  useEffect(() => {
    if (project) reset({ name: project.name });
  }, [project, reset]);

  const onSave = async (data: GeneralForm) => {
    await updateProject({ id: id!, data });
    await queryClient.invalidateQueries({ queryKey: getGetProjectByIdQueryKey(id!) });
    await queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
  };

  const onDelete = async () => {
    if (!confirm('Delete this project and all its apps? This cannot be undone.')) return;
    await deleteProject({ id: id! });
    await queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
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
