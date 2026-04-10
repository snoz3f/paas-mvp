export interface WorkerJob {
  type: 'deploy' | 'restart' | 'stop';
  deploymentId: string;
  repoUrl?: string;
  port?: number;
  domain?: string;
  containerId?: string;
  callbackUrl: string;
}

export interface WorkerNode {
  id: string;
  ip: string;
}
