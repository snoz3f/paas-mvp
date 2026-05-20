import { useGetNodes } from '@/api/generated/nodes/nodes';
import { useGetProjects } from '@/api/generated/projects/projects';
import * as s from './admin.css';

export function AdminOverviewPage() {
  const { data: nodes = [] } = useGetNodes();
  const { data: projects = [] } = useGetProjects();

  const onlineCount = nodes.filter((n) => n.status === 'ONLINE').length;
  const offlineCount = nodes.filter((n) => n.status === 'OFFLINE').length;
  const totalContainers = nodes.reduce((acc, n) => acc + n.activeContainers, 0);

  return (
    <>
      <div className={s.topbar}>
        <span className={s.topbarTitle}>Overview</span>
      </div>

      <div className={s.content}>
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <span className={s.statLabel}>Nodes online</span>
            <span className={`${s.statValue} ${s.statValueSuccess}`}>{onlineCount}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statLabel}>Nodes offline</span>
            <span className={`${s.statValue} ${offlineCount > 0 ? s.statValueDanger : ''}`}>{offlineCount}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statLabel}>Total projects</span>
            <span className={`${s.statValue} ${s.statValueAccent}`}>{projects.length}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statLabel}>Active containers</span>
            <span className={s.statValue}>{totalContainers}</span>
          </div>
        </div>
      </div>
    </>
  );
}
