import { useNavigate } from 'react-router';
import { trpc } from '@/lib/trpc';
import { ProjectCard } from '@/components/shared/ProjectCard';
import * as s from './ProjectsPage.css';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  return (
    <>
      <div className={s.topbar}>
        <span className={s.topbarTitle}>Projects</span>
        <button className={s.newBtn} onClick={() => void navigate('/dashboard/projects/new')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 1v12M1 7h12" />
          </svg>
          New project
        </button>
      </div>

      <div className={s.content}>
        {isLoading && (
          <div className={s.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.skeleton} />
            ))}
          </div>
        )}

        {!isLoading && projects?.length === 0 && (
          <div className={s.empty}>
            <svg className={s.emptyIcon} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="8" y="8" width="14" height="14" rx="2" />
              <rect x="26" y="8" width="14" height="14" rx="2" />
              <rect x="8" y="26" width="14" height="14" rx="2" />
              <rect x="26" y="26" width="14" height="14" rx="2" />
            </svg>
            <div>
              <p className={s.emptyTitle}>No projects yet</p>
              <p className={s.emptyText}>
                Create your first project and deploy it in minutes.
              </p>
            </div>
            <button className={s.newBtn} onClick={() => void navigate('/dashboard/projects/new')}>
              Create first project
            </button>
          </div>
        )}

        {!isLoading && projects && projects.length > 0 && (
          <div className={s.grid}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
