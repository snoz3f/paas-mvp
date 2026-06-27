import { useState } from 'react';
import { useNavigate, useOutlet, useParams } from 'react-router';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { trpc } from '@/lib/trpc';
import { siPostgresql, siRedis } from 'simple-icons';
import { NewServicePanel } from './NewServicePanel';
import { ProjectSettingsModal } from './ProjectSettingsModal';
import * as s from './ProjectPage.css';

type ServiceType = 'POSTGRES' | 'REDIS';

const SERVICE_META = {
  POSTGRES: { label: 'PostgreSQL', icon: siPostgresql },
  REDIS:    { label: 'Redis',      icon: siRedis },
} as const;

function ServiceIcon({ type, size = 18 }: { type: string; size?: number }) {
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
  const utils = trpc.useUtils();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [addingService, setAddingService] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const outlet = useOutlet();
  const { data: project, isLoading: projectLoading } = trpc.projects.get.useQuery({ id: id! });
  const { data: apps } = trpc.apps.list.useQuery({ projectId: id! });
  const { data: services } = trpc.services.list.useQuery({ projectId: id! });
  const { mutateAsync: deleteService } = trpc.services.delete.useMutation();

  const selected = services?.find((svc) => svc.id === selectedServiceId) ?? null;

  const handleDeleteService = async (serviceId: string) => {
    await deleteService({ projectId: id!, id: serviceId });
    await utils.services.list.invalidate({ projectId: id! });
    if (selectedServiceId === serviceId) setSelectedServiceId(null);
  };

  const openAddService = () => {
    setAddingService(true);
    setSelectedServiceId(null);
  };

  return (
    <div className={s.root}>
      {/* Topbar */}
      <header className={s.topbar}>
        <div className={s.topbarLeft}>
          <button className={s.backBtn} onClick={() => void navigate('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Projects
          </button>
          <span className={s.sep}>/</span>
          <span className={s.topbarTitle}>
            {projectLoading ? <span className={s.shimmer} style={{ width: 80 }} /> : project?.name}
          </span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setSettingsOpen(true)}>
          Settings
        </Button>
      </header>

      <div className={s.body}>
        {/* Project sidebar */}
        <nav className={s.sidebar}>
          {/* Apps */}
          <div className={s.section}>
            <div className={s.sectionHead}>
              <span className={s.sectionLabel}>Apps</span>
              <button
                className={s.addBtn}
                onClick={() => void navigate(`/dashboard/projects/${id}/apps/new`)}
                title="Add app"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 1v10M1 6h10" />
                </svg>
              </button>
            </div>

            {apps?.length === 0 && (
              <span className={s.sectionEmpty}>No apps</span>
            )}
            {apps?.map((app) => (
              <button
                key={app.id}
                className={s.navItem}
                onClick={() => void navigate(`/dashboard/projects/${id}/apps/${app.id}`)}
              >
                <span className={s.appDot} />
                <span className={s.navLabel}>{app.name}</span>
                {app.hasGitToken && <span className={s.autoBadge}>auto</span>}
              </button>
            ))}
          </div>

          {/* Infra */}
          <div className={s.section}>
            <div className={s.sectionHead}>
              <span className={s.sectionLabel}>Infra</span>
              <button className={s.addBtn} onClick={openAddService} title="Add service">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 1v10M1 6h10" />
                </svg>
              </button>
            </div>

            {services?.length === 0 && !addingService && (
              <span className={s.sectionEmpty}>No services</span>
            )}
            {services?.map((svc) => (
              <button
                key={svc.id}
                className={selectedServiceId === svc.id ? `${s.navItem} ${s.navItemActive}` : s.navItem}
                onClick={() => { setSelectedServiceId(svc.id); setAddingService(false); }}
              >
                <ServiceIcon type={svc.type} size={13} />
                <span className={s.navLabel}>{SERVICE_META[svc.type as ServiceType]?.label ?? svc.type}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className={s.content}>
          {!addingService && outlet}

          {/* Service detail */}
          {!outlet && selected && !addingService && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <div className={s.cardHeaderLeft}>
                  <ServiceIcon type={selected.type} size={28} />
                  <div>
                    <p className={s.cardName}>
                      {SERVICE_META[selected.type as ServiceType]?.label ?? selected.type}
                    </p>
                    <p className={s.cardSub}>{selected.version}</p>
                  </div>
                </div>
                <div className={s.cardHeaderRight}>
                  <StatusBadge status={selected.status as Parameters<typeof StatusBadge>[0]['status']} />
                  <button
                    className={s.deleteBtn}
                    onClick={() => void handleDeleteService(selected.id)}
                    title="Remove service"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 2l10 10M12 2L2 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={s.metaTable}>
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>Env key</span>
                  <code className={s.metaValue}>{selected.envKey}</code>
                </div>
                {selected.connectionString && (
                  <div className={s.metaRow}>
                    <span className={s.metaLabel}>Connection</span>
                    <code className={s.metaValue}>{selected.connectionString}</code>
                  </div>
                )}
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>Status</span>
                  <StatusBadge status={selected.status as Parameters<typeof StatusBadge>[0]['status']} />
                </div>
              </div>
            </div>
          )}

          {/* Add service catalog */}
          {addingService && (
            <NewServicePanel
              projectId={id!}
              onClose={() => setAddingService(false)}
              onCreated={() => void utils.services.list.invalidate({ projectId: id! })}
            />
          )}

          {/* Empty state */}
          {!outlet && !selected && !addingService && (
            <div className={s.emptyState}>
              <p className={s.emptyTitle}>{project?.name ?? ''}</p>
              <p className={s.emptyHint}>
                Select an app or service from the sidebar, or add a new one with <kbd className={s.kbd}>+</kbd>
              </p>
            </div>
          )}
        </main>
      </div>

      {settingsOpen && (
        <ProjectSettingsModal projectId={id!} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
