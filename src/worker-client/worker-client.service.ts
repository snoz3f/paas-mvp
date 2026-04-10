import { Injectable, Logger } from '@nestjs/common';
import type { WorkerJob, WorkerNode } from './worker-client.interfaces';

@Injectable()
export class WorkerClientService {
  private readonly logger = new Logger(WorkerClientService.name);

  async sendJob(node: WorkerNode, job: WorkerJob): Promise<void> {
    const url = `http://${node.ip}:4000/job`;
    this.logger.log(
      `Sending job ${job.type} for deployment ${job.deploymentId} to node ${node.ip}`,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }
  }
}
