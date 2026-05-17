import { Injectable, Logger } from '@nestjs/common';
import type { WorkerJob, WorkerNode, WorkerServiceJob } from './worker-client.interfaces';

@Injectable()
export class WorkerClientService {
  private readonly logger = new Logger(WorkerClientService.name);

  async sendJob(node: WorkerNode, job: WorkerJob): Promise<void> {
    this.logger.log(`Sending job ${job.type} for deployment ${job.deploymentId} to node ${node.ip}`);
    await this.post(node, job);
  }

  async sendServiceJob(node: WorkerNode, job: WorkerServiceJob): Promise<void> {
    this.logger.log(`Sending service job ${job.type} for service ${job.serviceId} to node ${node.ip}`);
    await this.post(node, job);
  }

  private async post(node: WorkerNode, body: unknown): Promise<void> {
    const response = await fetch(`http://${node.ip}:4000/job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }
  }
}
