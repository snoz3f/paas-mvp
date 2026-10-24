export function deploymentLogSessionKey(status: string, deploymentId: string): string {
  return `${status}:${deploymentId}`;
}
