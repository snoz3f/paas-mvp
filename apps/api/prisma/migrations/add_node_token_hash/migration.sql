ALTER TABLE "Node" ADD COLUMN "tokenHash" TEXT;
CREATE UNIQUE INDEX "Node_name_key" ON "Node"("name");
