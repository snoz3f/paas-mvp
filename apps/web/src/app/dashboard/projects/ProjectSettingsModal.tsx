import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc';
import * as s from './ProjectSettingsModal.css';

const schema = z.object({
  name: z.string().min(1, 'Required'),
});
type Form = z.infer<typeof schema>;

interface Props {
  projectId: string;
  onClose: () => void;
}

export function ProjectSettingsModal({ projectId, onClose }: Props) {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: project } = trpc.projects.get.useQuery({ id: projectId });
  const { mutateAsync: updateProject, isPending: isSaving } = trpc.projects.update.useMutation();
  const { mutateAsync: deleteProject, isPending: isDeleting } = trpc.projects.delete.useMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (project) reset({ name: project.name });
  }, [project, reset]);

  const onSave = async (data: Form) => {
    await updateProject({ id: projectId, ...data });
    await utils.projects.get.invalidate({ id: projectId });
    await utils.projects.list.invalidate();
    onClose();
  };

  const onDelete = async () => {
    if (!confirm('Delete this project and all its apps? This cannot be undone.')) return;
    await deleteProject({ id: projectId });
    await utils.projects.list.invalidate();
    void navigate('/dashboard');
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <span className={s.title}>Project settings</span>
          <button className={s.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        <form className={s.form} onSubmit={handleSubmit(onSave)}>
          <Input label="Project name" error={errors.name?.message} {...register('name')} />
          <Button type="submit" loading={isSaving} width="auto">Save changes</Button>
        </form>

        <div className={s.danger}>
          <div className={s.dangerText}>
            <p className={s.dangerLabel}>Delete project</p>
            <p className={s.dangerDesc}>Permanently removes all apps and services.</p>
          </div>
          <Button variant="danger" width="auto" loading={isDeleting} onClick={() => void onDelete()}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
