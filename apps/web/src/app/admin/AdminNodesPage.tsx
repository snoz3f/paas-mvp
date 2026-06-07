import { trpc } from '@/lib/trpc';
import * as s from './admin.css';

function formatDate(val: unknown): string {
  if (!val) return '—';
  const d = new Date(val as string);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

function cpuColor(val: number): string {
  if (val >= 80) return s.statValueDanger;
  if (val >= 60) return s.statValueAccent;
  return s.statValueSuccess;
}

export function AdminNodesPage() {
  const { data: nodes = [], isLoading } = trpc.nodes.list.useQuery();

  const onlineCount = nodes.filter((n) => n.status === 'ONLINE').length;
  const offlineCount = nodes.filter((n) => n.status === 'OFFLINE').length;
  const totalContainers = nodes.reduce((acc, n) => acc + n.activeContainers, 0);

  return (
    <>
      <div className={s.topbar}>
        <span className={s.topbarTitle}>Nodes</span>
      </div>

      <div className={s.content}>
        {/* Stat cards */}
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <span className={s.statLabel}>Total nodes</span>
            <span className={s.statValue}>{nodes.length}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statLabel}>Online</span>
            <span className={`${s.statValue} ${s.statValueSuccess}`}>{onlineCount}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statLabel}>Offline</span>
            <span className={`${s.statValue} ${offlineCount > 0 ? s.statValueDanger : ''}`}>{offlineCount}</span>
          </div>
          <div className={s.statCard}>
            <span className={s.statLabel}>Active containers</span>
            <span className={`${s.statValue} ${s.statValueAccent}`}>{totalContainers}</span>
          </div>
        </div>

        {/* Nodes table */}
        <div className={s.section}>
          <span className={s.sectionTitle}>All nodes</span>
          <div className={s.table}>
            <div className={s.tableHeader}>
              <span className={s.tableHeaderCell}>Name</span>
              <span className={s.tableHeaderCell}>IP / Region</span>
              <span className={s.tableHeaderCell}>Status</span>
              <span className={s.tableHeaderCell}>CPU</span>
              <span className={s.tableHeaderCell}>RAM</span>
              <span className={s.tableHeaderCell}>Last heartbeat</span>
            </div>

            {isLoading ? (
              <div className={s.emptyState}>Loading nodes...</div>
            ) : nodes.length === 0 ? (
              <div className={s.emptyState}>No nodes registered</div>
            ) : (
              nodes.map((node) => {
                const online = node.status === 'ONLINE';
                return (
                  <div key={node.id} className={s.tableRow}>
                    <div>
                      <div className={s.tableCell}>{node.name}</div>
                      {node.provider && (
                        <div className={s.tableCellMuted}>{node.provider}</div>
                      )}
                    </div>
                    <div>
                      <div className={s.tableCellMono}>{node.ip}</div>
                      {node.region && (
                        <div className={s.tableCellMuted}>{node.region}</div>
                      )}
                    </div>
                    <div>
                      <span className={`${s.badge} ${online ? s.badgeOnline : s.badgeOffline}`}>
                        <span className={`${s.dot} ${online ? s.dotOnline : s.dotOffline}`} />
                        {online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className={`${s.tableCell} ${cpuColor(node.cpuUsage)}`}>
                      {node.cpuUsage}%
                    </div>
                    <div className={s.tableCell}>{node.ramUsage}%</div>
                    <div className={s.tableCellMono}>{formatDate(node.lastHeartbeat)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
