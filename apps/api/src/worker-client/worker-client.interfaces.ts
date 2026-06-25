export interface WorkerJob {
  type: 'deploy' | 'restart' | 'stop';
  deploymentId: string;
  repoUrl?: string;
  rootDir?: string;
  port?: number;
  domain?: string;
  containerId?: string;
  envVars?: Record<string, string>;
  projectId?: string;
  ramMb?: number;
  cpuMilli?: number;
  callbackUrl: string;
}

export interface WorkerServiceJob {
  type: 'provision-service' | 'remove-service';
  serviceId: string;
  projectId: string;
  serviceType?: string;
  version?: string;
  password?: string;
  containerId?: string;
  callbackUrl: string;
}

export interface WorkerNode {
  id: string;
  ip: string;
}
