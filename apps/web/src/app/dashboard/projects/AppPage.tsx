import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { ResourceSlider } from '@/components/ui/ResourceSlider';
import { RAM_STEPS, CPU_STEPS, DISK_STEPS, formatRam, formatCpu, formatDisk } from '@/lib/resources';
import { trpc } from '@/lib/trpc';
import * as s from './ProjectPage.css';

export function AppPage() {
  const { id: projectId, appId } = useParams<{ id: string; appId: string }>();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: app, isLoading: appLoading } = trpc.apps.get.useQuery({ projectId: projectId!, id: appId! });
  const { data: deployments, isLoading: deploymentsLoading } = trpc.deployments.list.useQuery({ projectId: projectId!, appId: appId! });
  const { mutateAsync: deploy, isPending: isDeploying } = trpc.deployments.create.useMutation();
  const { mutateAsync: updateApp, isPending: isSavingResources } = trpc.apps.update.useMutation();

  const [ramMb, setRamMb] = useState(512);
  const [cpuMilli, setCpuMilli] = useState(500);
  const [diskGb, setDiskGb] = useState(5);

  useEffect(() => {
    if (app) {
      setRamMb(app.ramMb);
      setCpuMilli(app.cpuMilli);
      setDiskGb(app.diskGb);
    }
  }, [app]);

  const handleDeploy = async () => {
    await deploy({ projectId: projectId!, appId: appId! });
    await utils.deployments.list.invalidate({ projectId: projectId!, appId: appId! });
  };

  const handleSaveResources = async () => {
    await updateApp({ projectId: projectId!, id: appId!, ramMb, cpuMilli, diskGb });
    await utils.apps.get.invalidate({ projectId: projectId!, id: appId! });
  };

  const activeDeployment = deployments?.find(
    (d) => d.status === 'RUNNING' || d.status === 'BUILDING' || d.status === 'QUEUED',
  );

  return (
    <>
      <div className={s.appPanelHeader}>
        <div className={s.topbarLeft}>
          <span className={s.topbarTitle}>{appLoading ? '...' : app?.name}</span>
          {activeDeployment && <StatusBadge status={activeDeployment.status} />}
        </div>
        <Button size="sm" loading={isDeploying} onClick={() => void handleDeploy()}>
          Deploy
        </Button>
      </div>

      <div className={s.appPanelContent}>
        {app && (
          <div className={s.metaCard}>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Repository</p>
              <a
                href={app.repoUrl}
                target="_blank"
                rel="noreferrer"
                className={`${s.metaValue} ${s.metaLink}`}
              >
                {app.repoUrl.replace('https://github.com/', '').replace('https://gitlab.com/', '')}
              </a>
            </div>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Domain</p>
              {activeDeployment?.url ? (
                <a
                  href={activeDeployment.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${s.metaValue} ${s.metaLink}`}
                >
                  {activeDeployment.url.replace('https://', '')}
                </a>
              ) : (
                <span className={s.metaValue}>—</span>
              )}
            </div>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Framework</p>
              <span className={s.metaValue}>{app.framework ?? '—'}</span>
            </div>
          </div>
        )}

        {app && (
          <div className={s.resourcesCard}>
            <div className={s.resourcesHeader}>
              <p className={s.resourcesTitle}>Resources</p>
            </div>
            <div className={s.resourcesBody}>
              <ResourceSlider
                label="RAM"
                steps={RAM_STEPS}
                value={ramMb}
                format={formatRam}
                onChange={setRamMb}
                disabled={isSavingResources}
              />
              <ResourceSlider
                label="CPU"
                steps={CPU_STEPS}
                value={cpuMilli}
                format={formatCpu}
                onChange={setCpuMilli}
                disabled={isSavingResources}
              />
              <ResourceSlider
                label="Disk"
                steps={DISK_STEPS}
                value={diskGb}
                format={formatDisk}
                onChange={setDiskGb}
                disabled={isSavingResources}
              />
              <p className={s.resourcesNote}>
                Disk limit is used for scheduling only — runtime enforcement coming soon.
              </p>
              <div className={s.resourcesFooter}>
                <Button size="sm" width="auto" loading={isSavingResources} onClick={() => void handleSaveResources()}>
                  Save resources
                </Button>
              </div>
            </div>
          </div>
        )}

        {deploymentsLoading && (
          <div className={s.deploymentList}>
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className={s.skeleton} />)}
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
                onClick={() => void navigate(`/dashboard/projects/${projectId}/apps/${appId}/deployments/${deployment.id}`)}
              >
                <div className={s.deploymentLeft}>
                  <StatusBadge status={deployment.status} />
                  <span className={s.deploymentId}>#{deployment.id.slice(0, 8)}</span>
                </div>
                <div className={s.deploymentRight}>
                  {deployment.url && (
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noreferrer"
                      className={s.deploymentUrl}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {deployment.url.replace('https://', '')}
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
    </>
  );
}
