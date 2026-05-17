import { useState, useEffect } from 'react';
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
import {
  useGetServices,
  useCreateService,
  useDeleteService,
  getGetServicesQueryKey,
} from '@/api/generated/services/services';
import { CreateServiceDtoType } from '@/api/generated/paaSMVPAPI.schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import * as s from './ProjectSettingsPage.css';

const generalSchema = z.object({
  name: z.string().min(1, 'Required'),
  repoUrl: z.string().url('Must be a valid URL'),
  framework: z.string().optional(),
  port: z.number().int().min(1).max(65535),
});
type GeneralForm = z.infer<typeof generalSchema>;

interface EnvEntry {
  key: string;
  value: string;
}

export function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useGetProjectById(id!);
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [generalSaved, setGeneralSaved] = useState(false);
  const [envEntries, setEnvEntries] = useState<EnvEntry[]>([]);
  const [envSaving, setEnvSaving] = useState(false);
  const [envSaved, setEnvSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [newServiceType, setNewServiceType] = useState<CreateServiceDtoType>(CreateServiceDtoType.POSTGRES);
  const [newServiceVersion, setNewServiceVersion] = useState('');
  const [newServiceEnvKey, setNewServiceEnvKey] = useState('DATABASE_URL');

  const { data: services } = useGetServices(id!);
  const { mutateAsync: createService, isPending: isCreatingService } = useCreateService();
  const { mutateAsync: deleteService } = useDeleteService();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GeneralForm>({
    resolver: zodResolver(generalSchema),
    defaultValues: { port: 3000 },
  });

  useEffect(() => {
    if (!project) return;
    reset({
      name: project.name,
      repoUrl: project.repoUrl,
      framework: project.framework ?? '',
      port: project.port,
    });
    const vars = (project.envVars ?? {}) as Record<string, string>;
    setEnvEntries(Object.entries(vars).map(([key, value]) => ({ key, value })));
  }, [project, reset]);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetProjectByIdQueryKey(id!) });
    await queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
  };

  const handleSaveGeneral = async (data: GeneralForm) => {
    await updateProject({
      id: id!,
      data: {
        name: data.name,
        repoUrl: data.repoUrl,
        framework: data.framework || undefined,
        port: data.port,
      },
    });
    await invalidate();
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 2500);
  };

  const handleSaveEnv = async () => {
    setEnvSaving(true);
    try {
      const envVars: Record<string, string> = {};
      for (const { key, value } of envEntries) {
        if (key.trim()) envVars[key.trim()] = value;
      }
      await updateProject({ id: id!, data: { envVars } });
      await invalidate();
      setEnvSaved(true);
      setTimeout(() => setEnvSaved(false), 2500);
    } finally {
      setEnvSaving(false);
    }
  };

  const handleAddService = async () => {
    const defaultVersions: Record<string, string> = { POSTGRES: '16', REDIS: '7' };
    await createService({
      projectId: id!,
      data: {
        type: newServiceType,
        version: newServiceVersion || defaultVersions[newServiceType],
        envKey: newServiceEnvKey,
      },
    });
    await queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey(id!) });
    setNewServiceEnvKey(newServiceType === CreateServiceDtoType.POSTGRES ? 'DATABASE_URL' : 'REDIS_URL');
    setNewServiceVersion('');
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteService({ projectId: id!, id: serviceId });
    await queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey(id!) });
    await invalidate();
  };

  const handleDelete = async () => {
    await deleteProject({ id: id! });
    await queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
    void navigate('/dashboard');
  };

  const addEnvRow = () => setEnvEntries((prev) => [...prev, { key: '', value: '' }]);

  const updateEnvRow = (index: number, field: 'key' | 'value', val: string) => {
    setEnvEntries((prev) => prev.map((e, i) => i === index ? { ...e, [field]: val } : e));
  };

  const removeEnvRow = (index: number) => {
    setEnvEntries((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) return null;

  return (
    <>
      <div className={s.topbar}>
        <div className={s.topbarLeft}>
          <button
            className={s.backBtn}
            onClick={() => void navigate(`/dashboard/projects/${id}`)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            {project?.name}
          </button>
          <span className={s.topbarTitle}>Settings</span>
        </div>
      </div>

      <div className={s.content}>
        {/* General */}
        <section className={s.section}>
          <p className={s.sectionTitle}>General</p>
          <div className={s.card}>
            <form onSubmit={handleSubmit(handleSaveGeneral)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className={s.formRow}>
                  <Input label="Name" error={errors.name?.message} {...register('name')} />
                  <Input label="Port" type="number" error={errors.port?.message} {...register('port', { valueAsNumber: true })} />
                </div>
                <Input label="Repository URL" error={errors.repoUrl?.message} {...register('repoUrl')} />
                <Input label="Framework" placeholder="e.g. nestjs, nextjs" {...register('framework')} />
              </div>
              <div className={s.saveRow}>
                {generalSaved && <span className={s.successMsg}>Saved</span>}
                <Button size="sm" loading={isSubmitting}>Save changes</Button>
              </div>
            </form>
          </div>
        </section>

        {/* Environment variables */}
        <section className={s.section}>
          <p className={s.sectionTitle}>Environment Variables</p>
          <div className={s.card}>
            {envEntries.length > 0 && (
              <div className={s.envHeader}>
                <span className={s.envHeaderLabel}>Key</span>
                <span className={s.envHeaderLabel}>Value</span>
                <span />
              </div>
            )}
            <div className={s.envTable}>
              {envEntries.map((entry, i) => (
                <div key={i} className={s.envRow}>
                  <input
                    className={s.envInput}
                    placeholder="KEY"
                    value={entry.key}
                    onChange={(e) => updateEnvRow(i, 'key', e.target.value)}
                    spellCheck={false}
                  />
                  <input
                    className={s.envInput}
                    placeholder="value"
                    value={entry.value}
                    onChange={(e) => updateEnvRow(i, 'value', e.target.value)}
                    spellCheck={false}
                  />
                  <button className={s.envRemoveBtn} onClick={() => removeEnvRow(i)} type="button">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 2l10 10M12 2L2 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button className={s.envAddBtn} onClick={addEnvRow} type="button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 1v12M1 7h12" />
              </svg>
              Add variable
            </button>
            <div className={s.saveRow}>
              {envSaved && <span className={s.successMsg}>Saved</span>}
              <Button size="sm" loading={envSaving} onClick={() => void handleSaveEnv()} type="button">
                Save variables
              </Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className={s.section}>
          <p className={s.sectionTitle}>Services</p>
          <div className={s.card}>
            {services && services.length > 0 && (
              <div className={s.serviceList}>
                {services.map((svc) => (
                  <div key={svc.id} className={s.serviceRow}>
                    <div className={s.serviceInfo}>
                      <div className={s.serviceIcon}>
                        {svc.type === 'POSTGRES' ? 'PG' : 'RD'}
                      </div>
                      <div className={s.serviceDetails}>
                        <span className={s.serviceName}>{svc.type} {svc.version}</span>
                        <span className={s.serviceEnvKey}>{svc.envKey}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`${s.serviceStatus} ${
                        svc.status === 'RUNNING' ? s.serviceStatusRunning :
                        svc.status === 'FAILED' ? s.serviceStatusFailed :
                        s.serviceStatusProvisioning
                      }`}>
                        {svc.status}
                      </span>
                      <button
                        className={s.envRemoveBtn}
                        onClick={() => void handleDeleteService(svc.id)}
                        type="button"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 2l10 10M12 2L2 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={s.addServiceRow}>
              <div className={s.addServiceField}>
                <p className={s.addServiceLabel}>Type</p>
                <select
                  className={s.addServiceSelect}
                  value={newServiceType}
                  onChange={(e) => {
                    const t = e.target.value as CreateServiceDtoType;
                    setNewServiceType(t);
                    setNewServiceEnvKey(t === CreateServiceDtoType.POSTGRES ? 'DATABASE_URL' : 'REDIS_URL');
                  }}
                >
                  <option value={CreateServiceDtoType.POSTGRES}>PostgreSQL</option>
                  <option value={CreateServiceDtoType.REDIS}>Redis</option>
                </select>
              </div>
              <div className={s.addServiceField}>
                <p className={s.addServiceLabel}>Version</p>
                <input
                  className={s.envInput}
                  placeholder={newServiceType === CreateServiceDtoType.POSTGRES ? '16' : '7'}
                  value={newServiceVersion}
                  onChange={(e) => setNewServiceVersion(e.target.value)}
                />
              </div>
              <div className={s.addServiceField}>
                <p className={s.addServiceLabel}>Env Key</p>
                <input
                  className={s.envInput}
                  placeholder="DATABASE_URL"
                  value={newServiceEnvKey}
                  onChange={(e) => setNewServiceEnvKey(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <Button
                size="sm"
                loading={isCreatingService}
                onClick={() => void handleAddService()}
                type="button"
              >
                Add
              </Button>
            </div>

            <p className={s.dangerDesc} style={{ marginTop: '4px' }}>
              Connection string автоматически добавится в env vars проекта.
              Активируется после следующего деплоя.
            </p>
          </div>
        </section>

        {/* Danger zone */}
        <section className={s.section}>
          <p className={s.sectionTitle}>Danger Zone</p>
          <div className={s.dangerCard}>
            <div className={s.dangerInfo}>
              <span className={s.dangerTitle}>Delete project</span>
              <span className={s.dangerDesc}>
                Permanently deletes this project and all its deployments. This cannot be undone.
              </span>
            </div>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete project
            </Button>
          </div>
        </section>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className={s.dialogOverlay} onClick={() => setShowDeleteDialog(false)}>
          <div className={s.dialogCard} onClick={(e) => e.stopPropagation()}>
            <p className={s.dialogTitle}>Delete project?</p>
            <p className={s.dialogDesc}>
              This will permanently delete <strong>{project?.name}</strong> and all associated
              deployments. Type the project name to confirm.
            </p>
            <input
              className={s.dialogConfirmInput}
              placeholder={project?.name}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              autoFocus
            />
            <div className={s.dialogActions}>
              <Button size="sm" variant="ghost" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                loading={isDeleting}
                disabled={deleteConfirm !== project?.name}
                onClick={() => void handleDelete()}
              >
                Delete forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
