/*
  Warnings:

  - You are about to drop the column `locked` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the `SpecialPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SpecialPermission" DROP CONSTRAINT "SpecialPermission_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Projects" DROP COLUMN "locked";

-- DropTable
DROP TABLE "public"."SpecialPermission";

-- DropEnum
DROP TYPE "public"."PermissionType";
