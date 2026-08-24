-- AlterTable
ALTER TABLE "production_entries" ADD COLUMN "productId" TEXT,
ADD COLUMN "materialQuantity" DECIMAL(12,3);

-- AddForeignKey
ALTER TABLE "production_entries" ADD CONSTRAINT "production_entries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "production_entries_productId_idx" ON "production_entries"("productId");
