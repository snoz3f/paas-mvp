import * as s from './Badge.css';

type DeploymentStatus = 'RUNNING' | 'FAILED' | 'QUEUED' | 'BUILDING' | 'STOPPED';

const STATUS_MAP: Record<DeploymentStatus, { label: string; badge: string; dot: string }> = {
  RUNNING:  { label: 'Running',  badge: s.running,  dot: s.runningDot  },
  FAILED:   { label: 'Failed',   badge: s.failed,   dot: s.failedDot   },
  QUEUED:   { label: 'Queued',   badge: s.queued,   dot: s.queuedDot   },
  BUILDING: { label: 'Building', badge: s.building, dot: s.buildingDot },
  STOPPED:  { label: 'Stopped',  badge: s.stopped,  dot: s.stoppedDot  },
};

interface BadgeProps {
  status: DeploymentStatus;
}

export function StatusBadge({ status }: BadgeProps) {
  const { label, badge, dot } = STATUS_MAP[status];
  return (
    <span className={`${s.base} ${badge}`}>
      <span className={`${s.dot} ${dot}`} />
      {label}
    </span>
  );
}
