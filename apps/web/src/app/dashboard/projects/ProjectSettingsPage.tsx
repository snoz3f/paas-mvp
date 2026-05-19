import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { customInstance } from '@/lib/axios';
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

type Section = 'general' | 'git' | 'env' | 'services' | 'danger';

const NAV: { id: Section; label: string; icon: React.ReactNode; danger?: boolean }[] = [
  {
    id: 'general',
    label: 'General',
    icon: (
      <svg className={s.navItemIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    id: 'git',
    label: 'Git Access',
    icon: (
      <svg className={s.navItemIcon} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    id: 'env',
    label: 'Environment',
    icon: (
      <svg className={s.navItemIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 4h12M4 8h6M3 12h8" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services',
    icon: (
      <svg className={s.navItemIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="14" height="10" rx="1.5" />
        <path d="M1 6h14M4 9.5h2M9 9.5h3" />
      </svg>
    ),
  },
  {
    id: 'danger',
    label: 'Danger Zone',
    icon: (
      <svg className={s.navItemIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2L1.5 13.5h13L8 2zM8 6v4M8 11.5v.5" />
      </svg>
    ),
    danger: true,
  },
];

const generalSchema = z.object({
  name: z.string().min(1, 'Required'),
  repoUrl: z.string().url('Must be a valid URL'),
  framework: z.string().optional(),
  port: z.number().int().min(1).max(65535),
});
type GeneralForm = z.infer<typeof generalSchema>;

interface EnvEntry { key: string; value: string; }

export function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section>('general');

  const { data: project, isLoading } = useGetProjectById(id!);
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => customInstance<{ id: string; email: string; githubLogin: string | null }>({ url: '/auth/me', method: 'GET' }),
  });

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
    reset({ name: project.name, repoUrl: project.repoUrl, framework: project.framework ?? '', port: project.port });
    const vars = (project.envVars ?? {}) as Record<string, string>;
    setEnvEntries(Object.entries(vars).map(([key, value]) => ({ key, value })));
  }, [project, reset]);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetProjectByIdQueryKey(id!) });
    await queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
  };

  const handleSaveGeneral = async (data: GeneralForm) => {
    await updateProject({ id: id!, data: { name: data.name, repoUrl: data.repoUrl, framework: data.framework || undefined, port: data.port } });
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
    await createService({ projectId: id!, data: { type: newServiceType, version: newServiceVersion || defaultVersions[newServiceType], envKey: newServiceEnvKey } });
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

  if (isLoading) return null;

  return (
    <div className={s.shell}>
      {/* Topbar */}
      <div className={s.topbar}>
        <div className={s.topbarLeft}>
          <button className={s.backBtn} onClick={() => void navigate(`/dashboard/projects/${id}`)}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            {project?.name}
          </button>
          <span className={s.breadcrumbSep}>/</span>
          <span className={s.topbarTitle}>Settings</span>
        </div>
      </div>

      {/* Body */}
      <div className={s.body}>
        {/* Left nav */}
        <nav className={s.nav}>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={
                item.danger
                  ? `${s.navItem} ${s.navItemDanger}${section === item.id ? ` ${s.navItemActive}` : ''}`
                  : `${s.navItem}${section === item.id ? ` ${s.navItemActive}` : ''}`
              }
              onClick={() => setSection(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className={s.content}>
          {section === 'general' && (
            <>
              <div className={s.sectionHeading}>
                <p className={s.sectionTitle}>General</p>
                <p className={s.sectionDesc}>Basic project configuration and repository settings.</p>
              </div>
              <div className={s.card}>
                <form onSubmit={handleSubmit(handleSaveGeneral)}>
                  <div className={s.formGap}>
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
            </>
          )}

          {section === 'git' && (
            <>
              <div className={s.sectionHeading}>
                <p className={s.sectionTitle}>Git Access</p>
                <p className={s.sectionDesc}>Connect your GitHub account to enable private repo access and auto-deploy on push.</p>
              </div>
              <div className={s.card}>
                <div className={`${s.tokenStatus} ${me?.githubLogin ? s.tokenStatusActive : s.tokenStatusNone}`}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    {me?.githubLogin
                      ? <path d="M2 8l4 4 8-8" />
                      : <><circle cx="8" cy="8" r="6.5" /><path d="M8 5v3M8 10.5v.5" /></>
                    }
                  </svg>
                  {me?.githubLogin
                    ? `Connected as @${me.githubLogin}`
                    : 'GitHub not connected'}
                </div>
                <div className={s.saveRow}>
                  <Button
                    size="sm"
                    variant={me?.githubLogin ? 'ghost' : 'primary'}
                    onClick={() => void customInstance<{ url: string }>({ url: '/auth/github/url', method: 'GET' }).then((r) => { window.location.href = r.url; })}
                    type="button"
                  >
                    {me?.githubLogin ? 'Reconnect GitHub' : 'Connect GitHub'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {section === 'env' && (
            <>
              <div className={s.sectionHeading}>
                <p className={s.sectionTitle}>Environment Variables</p>
                <p className={s.sectionDesc}>Injected into the container at runtime. Changes apply on next deploy.</p>
              </div>
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
                      <input className={s.envInput} placeholder="KEY" value={entry.key} onChange={(e) => setEnvEntries((prev) => prev.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} spellCheck={false} />
                      <input className={s.envInput} placeholder="value" value={entry.value} onChange={(e) => setEnvEntries((prev) => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} spellCheck={false} />
                      <button className={s.envRemoveBtn} onClick={() => setEnvEntries((prev) => prev.filter((_, j) => j !== i))} type="button">
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l10 10M12 2L2 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button className={s.envAddBtn} onClick={() => setEnvEntries((prev) => [...prev, { key: '', value: '' }])} type="button">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v12M1 7h12" /></svg>
                  Add variable
                </button>
                <div className={s.saveRow}>
                  {envSaved && <span className={s.successMsg}>Saved</span>}
                  <Button size="sm" loading={envSaving} onClick={() => void handleSaveEnv()} type="button">Save variables</Button>
                </div>
              </div>
            </>
          )}

          {section === 'services' && (
            <>
              <div className={s.sectionHeading}>
                <p className={s.sectionTitle}>Services</p>
                <p className={s.sectionDesc}>Managed databases and caches. Connection string is auto-injected into env vars.</p>
              </div>
              <div className={s.card}>
                {services && services.length > 0 && (
                  <div className={s.serviceList}>
                    {services.map((svc) => (
                      <div key={svc.id} className={s.serviceRow}>
                        <div className={s.serviceInfo}>
                          <div className={s.serviceIcon}>{svc.type === 'POSTGRES' ? 'PG' : 'RD'}</div>
                          <div className={s.serviceDetails}>
                            <span className={s.serviceName}>{svc.type} {svc.version}</span>
                            <span className={s.serviceEnvKey}>{svc.envKey}</span>
                          </div>
                        </div>
                        <div className={s.serviceActions}>
                          <span className={`${s.serviceStatus} ${svc.status === 'RUNNING' ? s.serviceStatusRunning : svc.status === 'FAILED' ? s.serviceStatusFailed : s.serviceStatusProvisioning}`}>
                            {svc.status}
                          </span>
                          <button className={s.envRemoveBtn} onClick={() => void handleDeleteService(svc.id)} type="button">
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l10 10M12 2L2 12" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={s.addServiceRow}>
                  <div className={s.addServiceField}>
                    <p className={s.addServiceLabel}>Type</p>
                    <select className={s.addServiceSelect} value={newServiceType} onChange={(e) => { const t = e.target.value as CreateServiceDtoType; setNewServiceType(t); setNewServiceEnvKey(t === CreateServiceDtoType.POSTGRES ? 'DATABASE_URL' : 'REDIS_URL'); }}>
                      <option value={CreateServiceDtoType.POSTGRES}>PostgreSQL</option>
                      <option value={CreateServiceDtoType.REDIS}>Redis</option>
                    </select>
                  </div>
                  <div className={s.addServiceField}>
                    <p className={s.addServiceLabel}>Version</p>
                    <input className={s.envInput} placeholder={newServiceType === CreateServiceDtoType.POSTGRES ? '16' : '7'} value={newServiceVersion} onChange={(e) => setNewServiceVersion(e.target.value)} />
                  </div>
                  <div className={s.addServiceField}>
                    <p className={s.addServiceLabel}>Env Key</p>
                    <input className={s.envInput} placeholder="DATABASE_URL" value={newServiceEnvKey} onChange={(e) => setNewServiceEnvKey(e.target.value)} spellCheck={false} />
                  </div>
                  <Button size="sm" loading={isCreatingService} onClick={() => void handleAddService()} type="button">Add</Button>
                </div>

                <p className={s.serviceNote}>
                  Connection string is automatically added to env vars and available on next deploy.
                </p>
              </div>
            </>
          )}

          {section === 'danger' && (
            <>
              <div className={s.sectionHeading}>
                <p className={s.sectionTitle}>Danger Zone</p>
                <p className={s.sectionDesc}>Irreversible actions. Proceed with caution.</p>
              </div>
              <div className={s.dangerCard}>
                <div className={s.dangerInfo}>
                  <span className={s.dangerTitle}>Delete project</span>
                  <span className={s.dangerDesc}>
                    Permanently deletes this project and all its deployments. This cannot be undone.
                  </span>
                </div>
                <Button size="sm" variant="danger" onClick={() => setShowDeleteDialog(true)}>
                  Delete project
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className={s.dialogOverlay} onClick={() => setShowDeleteDialog(false)}>
          <div className={s.dialogCard} onClick={(e) => e.stopPropagation()}>
            <p className={s.dialogTitle}>Delete project?</p>
            <p className={s.dialogDesc}>
              This will permanently delete <strong>{project?.name}</strong> and all associated deployments. Type the project name to confirm.
            </p>
            <input
              className={s.dialogConfirmInput}
              placeholder={project?.name}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              autoFocus
            />
            <div className={s.dialogActions}>
              <Button size="sm" variant="ghost" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button size="sm" variant="danger" loading={isDeleting} disabled={deleteConfirm !== project?.name} onClick={() => void handleDelete()}>
                Delete forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
