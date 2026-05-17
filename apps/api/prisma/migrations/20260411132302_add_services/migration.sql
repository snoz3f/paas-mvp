-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('POSTGRES', 'REDIS');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('PROVISIONING', 'RUNNING', 'FAILED', 'STOPPED');

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "nodeId" UUID,
    "type" "ServiceType" NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'PROVISIONING',
    "containerId" TEXT,
    "version" TEXT NOT NULL DEFAULT 'latest',
    "envKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
