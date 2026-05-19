import { useNavigate } from 'react-router';
import { StatusBadge } from '@/components/ui/Badge';
import * as s from './ProjectCard.css';

interface Project {
  id: string;
  name: string;
  repoUrl: string;
  createdAt: string;
  hasGitToken?: boolean;
  latestDeployment?: {
    status: 'RUNNING' | 'FAILED' | 'QUEUED' | 'BUILDING' | 'STOPPED';
  };
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const repoName = project.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '');

  return (
    <div className={s.card} onClick={() => void navigate(`/dashboard/projects/${project.id}`)}>
      <div className={s.header}>
        <span className={s.name}>{project.name}</span>
        {project.latestDeployment ? (
          <StatusBadge status={project.latestDeployment.status} />
        ) : null}
      </div>

      <span className={s.repoUrl}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        {repoName}
      </span>

      <div className={s.footer}>
        <span className={s.date}>
          {new Date(project.createdAt).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <div className={s.footerRight}>
          {project.hasGitToken && (
            <span className={s.autoDeploy}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6a2 2 0 002 2h10a2 2 0 002-2V4" />
                <path d="M8 12V2M5 5l3-3 3 3" />
              </svg>
              Auto-deploy
            </span>
          )}
          {!project.latestDeployment && (
            <span className={s.noDeployment}>No deployments yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
