-- Create App table
CREATE TABLE "App" (
  "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
  "projectId"     UUID NOT NULL,
  "name"          TEXT NOT NULL,
  "repoUrl"       TEXT NOT NULL,
  "domain"        TEXT,
  "framework"     TEXT,
  "port"          INTEGER NOT NULL DEFAULT 3000,
  "envVars"       JSONB NOT NULL DEFAULT '{}',
  "gitToken"      TEXT,
  "webhookSecret" TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "App" ADD CONSTRAINT "App_domain_key" UNIQUE ("domain");
ALTER TABLE "App" ADD CONSTRAINT "App_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing projects → one App per Project
INSERT INTO "App" ("id", "projectId", "name", "repoUrl", "domain", "framework", "port", "envVars", "gitToken", "webhookSecret", "createdAt")
SELECT gen_random_uuid(), "id", "name", "repoUrl", "domain", "framework", "port", "envVars", "gitToken", "webhookSecret", "createdAt"
FROM "Project";

-- Add appId to Deployment (nullable first)
ALTER TABLE "Deployment" ADD COLUMN "appId" UUID;

-- Fill appId: match via projectId
UPDATE "Deployment" d
SET "appId" = a."id"
FROM "App" a
WHERE a."projectId" = d."projectId";

-- Make appId NOT NULL and add FK
ALTER TABLE "Deployment" ALTER COLUMN "appId" SET NOT NULL;
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_appId_fkey"
  FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old projectId from Deployment
ALTER TABLE "Deployment" DROP CONSTRAINT IF EXISTS "Deployment_projectId_fkey";
ALTER TABLE "Deployment" DROP COLUMN "projectId";

-- Strip repo-related fields from Project
ALTER TABLE "Project" DROP COLUMN IF EXISTS "repoUrl";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "domain";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "framework";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "port";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "envVars";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "gitToken";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "webhookSecret";

-- logs column (if not already added by previous migration)
ALTER TABLE "Deployment" ADD COLUMN IF NOT EXISTS "logs" TEXT;

-- Connection string on Service (replaces project-level envVar injection)
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "connectionString" TEXT;
