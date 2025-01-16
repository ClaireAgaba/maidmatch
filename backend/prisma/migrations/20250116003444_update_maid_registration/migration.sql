/*
  Warnings:

  - You are about to drop the column `appliedAt` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `Maid` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Maid` table. All the data in the column will be lost.
  - You are about to drop the column `vaccinations` on the `Maid` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `revieweeId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `isFirstLogin` on the `User` table. All the data in the column will be lost.
  - Added the required column `educationBackground` to the `Maid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_revieweeId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "appliedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Maid" DROP COLUMN "bloodType",
DROP COLUMN "district",
DROP COLUMN "vaccinations",
ADD COLUMN     "educationBackground" JSONB NOT NULL,
ADD COLUMN     "medicalHistory" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "tribe" DROP NOT NULL,
ALTER COLUMN "allergies" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "chronicConditions" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "readAt",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "revieweeId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isFirstLogin";
