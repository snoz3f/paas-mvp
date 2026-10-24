export const DEFAULT_RAM_MB = 512;
export const DEFAULT_CPU_MILLI = 500;
export const DEFAULT_DISK_GB = 5;

export const RAM_STEPS  = [128, 256, 512, 1024, 2048, 4096, 8192, 16384];
export const CPU_STEPS  = [100, 250, 500, 1000, 2000, 4000];
export const DISK_STEPS = [1, 5, 10, 25, 50, 100];

export function formatRam(mb: number): string {
  return mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`;
}
export function formatCpu(milli: number): string {
  return `${milli / 1000} vCPU`;
}
export function formatDisk(gb: number): string {
  return `${gb} GB`;
}
