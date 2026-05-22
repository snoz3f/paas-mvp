import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetProjectById, getGetProjectByIdQueryKey } from '@/api/generated/projects/projects';
import {
  useGetDeployments,
  useCreateDeployment,
  getGetDeploymentsQueryKey,
} from '@/api/generated/deployments/deployments';
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
  const { data: deployments, isLoading: deploymentsLoading } = useGetDeployments(id!);
  const { data: services } = useGetServices(id!);
  const { mutateAsync: deploy, isPending: isDeploying } = useCreateDeployment();
  const { mutateAsync: createService, isPending: isCreatingService } = useCreateService();
  const { mutateAsync: deleteService } = useDeleteService();

  const handleDeploy = async () => {
    await deploy({ projectId: id! });
    await queryClient.invalidateQueries({ queryKey: getGetDeploymentsQueryKey(id!) });
    await queryClient.invalidateQueries({ queryKey: getGetProjectByIdQueryKey(id!) });
  };

  const DEFAULT_ENV_KEYS: Record<ServiceType, string> = {
    POSTGRES: 'DATABASE_URL',
    REDIS: 'REDIS_URL',
  };

  const handleServiceTypeChange = (type: ServiceType) => {
    setNewServiceType(type);
    setNewServiceEnvKey(DEFAULT_ENV_KEYS[type]);
  };

  const handleAddService = async () => {
    await createService({
      projectId: id!,
      data: { type: newServiceType, version: 'latest', envKey: newServiceEnvKey },
    });
    await queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey(id!) });
    setAddingService(false);
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteService({ projectId: id!, id: serviceId });
    await queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey(id!) });
  };

  const activeDeployment = deployments?.find(
    (d) => d.status === 'RUNNING' || d.status === 'BUILDING' || d.status === 'QUEUED',
  );

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
          {activeDeployment && <StatusBadge status={activeDeployment.status} />}
        </div>

        <div className={s.topbarActions}>
          <Button size="sm" variant="ghost" onClick={() => void navigate(`/dashboard/projects/${id}/settings`)}>
            Settings
          </Button>
          {tab === 'apps' && (
            <Button size="sm" loading={isDeploying} onClick={() => void handleDeploy()}>
              Deploy
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
        {/* Meta */}
        {project && (
          <div className={s.metaCard}>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Repository</p>
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className={`${s.metaValue} ${s.metaLink}`}>
                {project.repoUrl.replace('https://github.com/', '').replace('https://gitlab.com/', '')}
              </a>
            </div>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Domain</p>
              {activeDeployment?.url ? (
                <a
                  href={activeDeployment.url as unknown as string}
                  target="_blank"
                  rel="noreferrer"
                  className={`${s.metaValue} ${s.metaLink}`}
                >
                  {(activeDeployment.url as unknown as string).replace('https://', '')}
                </a>
              ) : (
                <span className={s.metaValue} style={{ color: 'var(--textSubtle)' }}>—</span>
              )}
            </div>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Framework</p>
              <span className={s.metaValue}>{project.framework ?? '—'}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={s.tabs}>
          <button
            className={tab === 'apps' ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => setTab('apps')}
          >
            Apps
          </button>
          <button
            className={tab === 'infrastructure' ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => setTab('infrastructure')}
          >
            Infrastructure
            {services && services.length > 0 && (
              <span className={s.tabCount}>{services.length}</span>
            )}
          </button>
        </div>

        {/* Apps tab */}
        {tab === 'apps' && (
          <div>
            {deploymentsLoading && (
              <div className={s.deploymentList}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={s.skeleton} />
                ))}
              </div>
            )}

            {!deploymentsLoading && (!deployments || deployments.length === 0) && (
              <div className={s.empty}>
                <p className={s.emptyText}>No deployments yet. Hit Deploy to get started.</p>
              </div>
            )}

            {!deploymentsLoading && deployments && deployments.length > 0 && (
              <div className={s.deploymentList}>
                {deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className={s.deploymentRow}
                    onClick={() => void navigate(`/dashboard/projects/${id}/deployments/${deployment.id}`)}
                  >
                    <div className={s.deploymentLeft}>
                      <StatusBadge status={deployment.status} />
                      <span className={s.deploymentId}>#{deployment.id.slice(0, 8)}</span>
                    </div>
                    <div className={s.deploymentRight}>
                      {deployment.url && (
                        <a
                          href={deployment.url as unknown as string}
                          target="_blank"
                          rel="noreferrer"
                          className={s.deploymentUrl}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {(deployment.url as unknown as string).replace('https://', '')}
                        </a>
                      )}
                      <span className={s.deploymentDate}>
                        {new Date(deployment.createdAt).toLocaleString('en', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Infrastructure tab */}
        {tab === 'infrastructure' && (
          <div className={s.serviceGrid}>
            {/* Add service form */}
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
                  <Button size="sm" variant="ghost" width="auto" onClick={() => setAddingService(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" width="auto" loading={isCreatingService} onClick={() => void handleAddService()}>
                    Provision
                  </Button>
                </div>
              </div>
            )}

            {/* Existing services */}
            {services?.map((svc) => (
              <div key={svc.id} className={s.serviceCard}>
                <div className={s.serviceCardHeader}>
                  <div className={s.serviceCardInfo}>
                    <ServiceIcon type={svc.type} size={22} />
                    <div>
                      <p className={s.serviceCardName}>
                        {SERVICE_META[svc.type as ServiceType]?.label ?? svc.type}
                      </p>
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
                  <div className={s.serviceMetaRow}>
                    <span className={s.serviceMetaLabel}>Connect</span>
                    <span className={s.serviceMetaValue}>svc-{svc.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            ))}

            {!addingService && (!services || services.length === 0) && (
              <div className={s.empty}>
                <p className={s.emptyText}>No services yet. Add Postgres, Redis, or S3 to your project.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
