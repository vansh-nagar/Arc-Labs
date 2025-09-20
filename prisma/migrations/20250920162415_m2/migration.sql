/*
  Warnings:

  - You are about to drop the column `latex` on the `Projects` table. All the data in the column will be lost.
  - Added the required column `html` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Projects" DROP COLUMN "latex",
ADD COLUMN     "html" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
