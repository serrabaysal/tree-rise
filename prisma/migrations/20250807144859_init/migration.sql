/*
  Warnings:

  - Added the required column `alanId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "alanId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_alanId_fkey" FOREIGN KEY ("alanId") REFERENCES "public"."Alan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
