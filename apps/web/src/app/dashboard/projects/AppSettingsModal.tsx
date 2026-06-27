import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc';
import * as s from './ProjectSettingsModal.css';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  rootDir: z.string().min(1, 'Required'),
});
type Form = z.infer<typeof schema>;

interface Props {
  projectId: string;
  appId: string;
  onClose: () => void;
}

export function AppSettingsModal({ projectId, appId, onClose }: Props) {
  const utils = trpc.useUtils();
  const { data: app } = trpc.apps.get.useQuery({ projectId, id: appId });
  const { mutateAsync: updateApp, isPending: isSaving } = trpc.apps.update.useMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (app) reset({ name: app.name, rootDir: app.rootDir });
  }, [app, reset]);

  const onSave = async (data: Form) => {
    await updateApp({ projectId, id: appId, ...data });
    await utils.apps.get.invalidate({ projectId, id: appId });
    onClose();
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <span className={s.title}>App settings</span>
          <button className={s.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        <form className={s.form} onSubmit={handleSubmit(onSave)}>
          <Input label="App name" error={errors.name?.message} {...register('name')} />
          <Input
            label="Root directory"
            error={errors.rootDir?.message}
            placeholder="e.g. apps/client"
            {...register('rootDir')}
          />
          <Button type="submit" loading={isSaving} width="auto">Save changes</Button>
        </form>
      </div>
    </div>
  );
}
