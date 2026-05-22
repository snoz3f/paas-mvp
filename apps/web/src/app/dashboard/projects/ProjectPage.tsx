import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetProjectById } from '@/api/generated/projects/projects';
import { useGetApps } from '@/api/generated/apps/apps';
import {
  useGetServices,
  useCreateService,
  useDeleteService,
  getGetServicesQueryKey,
} from '@/api/generated/services/services';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { siPostgresql, siRedis } from 'simple-icons';
import * as s from './ProjectPage.css';

type Tab = 'apps' | 'infrastructure';
type ServiceType = 'POSTGRES' | 'REDIS';

const SERVICE_META: Record<ServiceType, { label: string; icon: { path: string; hex: string } }> = {
  POSTGRES: { label: 'PostgreSQL', icon: siPostgresql },
  REDIS:    { label: 'Redis',      icon: siRedis },
};

const DEFAULT_ENV_KEYS: Record<ServiceType, string> = {
  POSTGRES: 'DATABASE_URL',
  REDIS: 'REDIS_URL',
};

function ServiceIcon({ type, size = 20 }: { type: string; size?: number }) {
  const meta = SERVICE_META[type as ServiceType];
  if (!meta) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={`#${meta.icon.hex}`} aria-hidden>
      <path d={meta.icon.path} />
    </svg>
  );
}

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('apps');
  const [addingService, setAddingService] = useState(false);
  const [newServiceType, setNewServiceType] = useState<ServiceType>('POSTGRES');
  const [newServiceEnvKey, setNewServiceEnvKey] = useState('DATABASE_URL');

  const { data: project, isLoading: projectLoading } = useGetProjectById(id!);
  const { data: apps, isLoading: appsLoading } = useGetApps(id!);
  const { data: services } = useGetServices(id!);
  const { mutateAsync: createService, isPending: isCreatingService } = useCreateService();
  const { mutateAsync: deleteService } = useDeleteService();

  const handleAddService = async () => {
    await createService({ projectId: id!, data: { type: newServiceType, version: 'latest', envKey: newServiceEnvKey } });
    await queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey(id!) });
    setAddingService(false);
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteService({ projectId: id!, id: serviceId });
    await queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey(id!) });
  };

  const handleServiceTypeChange = (type: ServiceType) => {
    setNewServiceType(type);
    setNewServiceEnvKey(DEFAULT_ENV_KEYS[type]);
  };

  return (
    <>
      <div className={s.topbar}>
        <div className={s.topbarLeft}>
          <button className={s.backBtn} onClick={() => void navigate('/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Projects
          </button>
          <span className={s.topbarTitle}>
            {projectLoading ? '...' : project?.name}
          </span>
        </div>

        <div className={s.topbarActions}>
          <Button size="sm" variant="ghost" onClick={() => void navigate(`/dashboard/projects/${id}/settings`)}>
            Settings
          </Button>
          {tab === 'apps' && (
            <Button size="sm" onClick={() => void navigate(`/dashboard/projects/${id}/apps/new`)}>
              Add app
            </Button>
          )}
          {tab === 'infrastructure' && (
            <Button size="sm" onClick={() => setAddingService(true)}>
              Add service
            </Button>
          )}
        </div>
      </div>

      <div className={s.content}>
        <div className={s.tabs}>
          <button
            className={tab === 'apps' ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => setTab('apps')}
          >
            Apps
            {apps && apps.length > 0 && <span className={s.tabCount}>{apps.length}</span>}
          </button>
          <button
            className={tab === 'infrastructure' ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => setTab('infrastructure')}
          >
            Infrastructure
            {services && services.length > 0 && <span className={s.tabCount}>{services.length}</span>}
          </button>
        </div>

        {/* Apps tab */}
        {tab === 'apps' && (
          <div>
            {appsLoading && (
              <div className={s.deploymentList}>
                {Array.from({ length: 2 }).map((_, i) => <div key={i} className={s.skeleton} />)}
              </div>
            )}

            {!appsLoading && (!apps || apps.length === 0) && (
              <div className={s.empty}>
                <p className={s.emptyText}>No apps yet. Add your first app to get started.</p>
                <Button size="sm" onClick={() => void navigate(`/dashboard/projects/${id}/apps/new`)}>
                  Add app
                </Button>
              </div>
            )}

            {!appsLoading && apps && apps.length > 0 && (
              <div className={s.appGrid}>
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className={s.appCard}
                    onClick={() => void navigate(`/dashboard/projects/${id}/apps/${app.id}`)}
                  >
                    <div className={s.appCardHeader}>
                      <span className={s.appCardName}>{app.name}</span>
                      {app.hasGitToken && <span className={s.autoBadge}>↑ Auto-deploy</span>}
                    </div>
                    <span className={s.appCardRepo}>
                      {app.repoUrl.replace('https://github.com/', '').replace('https://gitlab.com/', '')}
                    </span>
                    {app.framework && (
                      <span className={s.appCardFramework}>{String(app.framework)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Infrastructure tab */}
        {tab === 'infrastructure' && (
          <div className={s.serviceGrid}>
            {addingService && (
              <div className={s.serviceCard}>
                <p className={s.serviceCardTitle}>New service</p>
                <div className={s.serviceTypeSelect}>
                  {(['POSTGRES', 'REDIS'] as ServiceType[]).map((type) => (
                    <button
                      key={type}
                      className={newServiceType === type ? `${s.serviceTypeBtn} ${s.serviceTypeBtnActive}` : s.serviceTypeBtn}
                      onClick={() => handleServiceTypeChange(type)}
                    >
                      <ServiceIcon type={type} size={18} />
                      {SERVICE_META[type].label}
                    </button>
                  ))}
                </div>
                <div className={s.serviceEnvKeyRow}>
                  <span className={s.serviceMetaLabel}>Env key</span>
                  <input
                    className={s.serviceEnvKeyInput}
                    value={newServiceEnvKey}
                    onChange={(e) => setNewServiceEnvKey(e.target.value.toUpperCase())}
                    placeholder="DATABASE_URL"
                    spellCheck={false}
                  />
                </div>
                <div className={s.serviceCardActions}>
                  <Button size="sm" variant="ghost" width="auto" onClick={() => setAddingService(false)}>Cancel</Button>
                  <Button size="sm" width="auto" loading={isCreatingService} onClick={() => void handleAddService()}>Provision</Button>
                </div>
              </div>
            )}

            {services?.map((svc) => (
              <div key={svc.id} className={s.serviceCard}>
                <div className={s.serviceCardHeader}>
                  <div className={s.serviceCardInfo}>
                    <ServiceIcon type={svc.type} size={22} />
                    <div>
                      <p className={s.serviceCardName}>{SERVICE_META[svc.type as ServiceType]?.label ?? svc.type}</p>
                      <p className={s.serviceCardVersion}>{svc.version}</p>
                    </div>
                  </div>
                  <div className={s.serviceCardRight}>
                    <StatusBadge status={svc.status} />
                    <button
                      className={s.serviceDeleteBtn}
                      onClick={() => void handleDeleteService(svc.id)}
                      title="Remove service"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 2l10 10M12 2L2 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={s.serviceCardMeta}>
                  <div className={s.serviceMetaRow}>
                    <span className={s.serviceMetaLabel}>Env key</span>
                    <span className={s.serviceMetaValue}>{svc.envKey}</span>
                  </div>
                  {svc.connectionString && (
                    <div className={s.serviceMetaRow}>
                      <span className={s.serviceMetaLabel}>Connection</span>
                      <span className={s.serviceMetaValue}>{svc.connectionString}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!addingService && (!services || services.length === 0) && (
              <div className={s.empty}>
                <p className={s.emptyText}>No services yet. Add Postgres or Redis to your project.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
