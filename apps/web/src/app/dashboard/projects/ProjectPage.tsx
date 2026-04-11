import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetProjectById, getGetProjectByIdQueryKey } from '@/api/generated/projects/projects';
import {
  useGetDeployments,
  useCreateDeployment,
  getGetDeploymentsQueryKey,
} from '@/api/generated/deployments/deployments';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import * as s from './ProjectPage.css';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useGetProjectById(id!);
  const { data: deployments, isLoading: deploymentsLoading } = useGetDeployments(id!);
  const { mutateAsync: deploy, isPending: isDeploying } = useCreateDeployment();

  const handleDeploy = async () => {
    await deploy({ projectId: id! });
    await queryClient.invalidateQueries({ queryKey: getGetDeploymentsQueryKey(id!) });
    await queryClient.invalidateQueries({ queryKey: getGetProjectByIdQueryKey(id!) });
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void navigate(`/dashboard/projects/${id}/settings`)}
          >
            Settings
          </Button>
          <Button
            size="sm"
            loading={isDeploying}
            onClick={() => void handleDeploy()}
          >
            Deploy
          </Button>
        </div>
      </div>

      <div className={s.content}>
        {/* Meta */}
        {project && (
          <div className={s.metaCard}>
            <div className={s.metaItem}>
              <p className={s.metaLabel}>Repository</p>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className={`${s.metaValue} ${s.metaLink}`}
              >
                {project.repoUrl.replace('https://github.com/', '')}
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

        {/* Deployments */}
        <div>
          <p className={s.sectionTitle}>Deployments</p>

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
                  onClick={() =>
                    void navigate(`/dashboard/projects/${id}/deployments/${deployment.id}`)
                  }
                >
                  <div className={s.deploymentLeft}>
                    <StatusBadge status={deployment.status} />
                    <span className={s.deploymentId}>
                      #{deployment.id.slice(0, 8)}
                    </span>
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
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
