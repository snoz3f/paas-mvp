import { useNavigate } from 'react-router';
import * as s from './ProjectCard.css';

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div className={s.card} onClick={() => void navigate(`/dashboard/projects/${project.id}`)}>
      <div className={s.header}>
        <span className={s.name}>{project.name}</span>
      </div>

      <div className={s.footer}>
        <span className={s.date}>
          {new Date(project.createdAt).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}
