import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { XTerm } from '@/components/ui/XTerm';
import { trpc } from '@/lib/trpc';
import * as s from './DeploymentPage.css';

type Tab = 'logs' | 'terminal';

export function DeploymentPage() {
  const { id: projectId, appId, deploymentId } = useParams<{ id: string; appId: string; deploymentId: string }>();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [tab, setTab] = useState<Tab>('logs');
  const [terminalEnabled, setTerminalEnabled] = useState(false);

  const { data: deployment, isLoading } = trpc.deployments.get.useQuery({ projectId: projectId!, appId: appId!, id: deploymentId! });
  const { mutateAsync: restart, isPending: isRestarting } = trpc.deployments.restart.useMutation();
  const { mutateAsync: stop, isPending: isStopping } = trpc.deployments.stop.useMutation();

  const { data: terminalInfo } = trpc.deployments.getTerminalInfo.useQuery(
    { projectId: projectId!, appId: appId!, id: deploymentId! },
    { enabled: terminalEnabled },
  );

  const invalidate = async () => {
    await utils.deployments.get.invalidate({ projectId: projectId!, appId: appId!, id: deploymentId! });
    await utils.deployments.list.invalidate({ projectId: projectId!, appId: appId! });
  };

  const handleRestart = async () => {
    await restart({ projectId: projectId!, appId: appId!, id: deploymentId! });
    await invalidate();
    void navigate(`/dashboard/projects/${projectId}/apps/${appId}`);
  };

  const handleStop = async () => {
    await stop({ projectId: projectId!, appId: appId!, id: deploymentId! });
    await invalidate();
  };

  const handleOpenTerminal = () => {
    setTerminalEnabled(true);
    setTab('terminal');
  };

  const logsUrl = deployment
    ? `${import.meta.env.VITE_API_URL ?? ''}/projects/${projectId}/apps/${appId}/deployments/${deploymentId}/logs?token=${localStorage.getItem('token') ?? ''}`
    : undefined;

  if (isLoading) return null;

  return (
    <>
      <div className={s.topbar}>
        <div className={s.topbarLeft}>
          <button
            className={s.backBtn}
            onClick={() => void navigate(`/dashboard/projects/${projectId}/apps/${appId}`)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            App
          </button>
          <span className={s.topbarTitle}>#{deploymentId?.slice(0, 8)}</span>
          {deployment && <StatusBadge status={deployment.status} />}
        </div>

        <div className={s.topbarActions}>
          {deployment?.status === 'RUNNING' && (
            <>
              <Button size="sm" variant="ghost" onClick={handleOpenTerminal}>Terminal</Button>
              <Button size="sm" variant="ghost" loading={isStopping} onClick={() => void handleStop()}>Stop</Button>
            </>
          )}
          <Button size="sm" loading={isRestarting} onClick={() => void handleRestart()}>Redeploy</Button>
        </div>
      </div>

      <div className={s.content}>
        {deployment && (
          <div className={s.meta}>
            <div className={s.metaItem}>
              <span className={s.metaLabel}>Started</span>
              <span className={s.metaValue}>
                {deployment.startedAt
                  ? new Date(deployment.startedAt).toLocaleString('en', {
                      month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit',
                    })
                  : '—'}
              </span>
            </div>
            {deployment.url && (
              <div className={s.metaItem}>
                <span className={s.metaLabel}>URL</span>
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${s.metaValue} ${s.metaLink}`}
                >
                  {(deployment.url).replace('https://', '')}
                </a>
              </div>
            )}
            {deployment.error && (
              <div className={s.metaItem}>
                <span className={s.metaLabel}>Error</span>
                <span className={`${s.metaValue} ${s.errorMsg}`}>
                  {deployment.error}
                </span>
              </div>
            )}
          </div>
        )}

        <div className={s.tabs}>
          <button
            className={tab === 'logs' ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => setTab('logs')}
          >Logs</button>
          <button
            className={tab === 'terminal' ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => setTab('terminal')}
            disabled={deployment?.status !== 'RUNNING'}
          >Terminal</button>
        </div>

        <div className={s.termPanel}>
          {tab === 'logs' && logsUrl && <XTerm logsUrl={logsUrl} />}
          {tab === 'logs' && !logsUrl && <div className={s.errorMsg}>No deployment selected.</div>}
          {tab === 'terminal' && terminalInfo && (
            <XTerm
              wsUrl={terminalInfo.wsUrl}
              containerId={terminalInfo.containerId}
              workerSecret={localStorage.getItem('token') ?? ''}
            />
          )}
          {tab === 'terminal' && !terminalInfo && (
            <div className={s.errorMsg}>Click "Terminal" button to open a shell.</div>
          )}
        </div>
      </div>
    </>
  );
}
