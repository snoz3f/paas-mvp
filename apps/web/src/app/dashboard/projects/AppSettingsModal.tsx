import { useState } from 'react';
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
  appName: string;
  appRootDir: string;
  appEnvVars: Record<string, string> | null;
  onClose: () => void;
}

export function AppSettingsModal({ projectId, appId, appName, appRootDir, appEnvVars, onClose }: Props) {
  const utils = trpc.useUtils();
  const { mutateAsync: updateApp, isPending: isSaving } = trpc.apps.update.useMutation();

  const [envPairs, setEnvPairs] = useState<{ key: string; value: string }[]>(() =>
    Object.entries(appEnvVars ?? {}).map(([key, value]) => ({ key, value })),
  );

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: appName, rootDir: appRootDir },
  });

  const addRow = () => setEnvPairs((p) => [...p, { key: '', value: '' }]);
  const removeRow = (i: number) => setEnvPairs((p) => p.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: 'key' | 'value', val: string) =>
    setEnvPairs((p) => p.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const onSave = async (data: Form) => {
    const envVars = Object.fromEntries(
      envPairs.filter((p) => p.key.trim()).map((p) => [p.key.trim(), p.value]),
    );
    await updateApp({ projectId, id: appId, ...data, envVars });
    await utils.apps.get.invalidate({ projectId, id: appId });
    onClose();
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
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

          <div className={s.envSection}>
            <span className={s.envLabel}>Environment variables</span>
            {envPairs.map((pair, i) => (
              <div key={i} className={s.envRow}>
                <input
                  className={s.envInput}
                  placeholder="KEY"
                  value={pair.key}
                  onChange={(e) => updateRow(i, 'key', e.target.value)}
                />
                <input
                  className={s.envInput}
                  placeholder="value"
                  value={pair.value}
                  onChange={(e) => updateRow(i, 'value', e.target.value)}
                />
                <button type="button" className={s.envRemoveBtn} onClick={() => removeRow(i)}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l10 10M11 1L1 11" />
                  </svg>
                </button>
              </div>
            ))}
            <button type="button" className={s.envAddBtn} onClick={addRow}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 1v10M1 6h10" />
              </svg>
              Add variable
            </button>
          </div>

          <Button type="submit" loading={isSaving} width="auto">Save changes</Button>
        </form>
      </div>
    </div>
  );
}
