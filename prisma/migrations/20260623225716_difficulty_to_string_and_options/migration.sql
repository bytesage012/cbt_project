/*
  Warnings:

  - Added the required column `options` to the `Question` table without a default value. This is not possible if the table is not empty.
  - The `difficulty` column on the `Question` table would be dropped and recreated. This will lead to data loss.

*/
-- AlterTable: add options column
ALTER TABLE "Question" ADD COLUMN "options" TEXT NOT NULL DEFAULT '[]';

-- AlterTable: change difficulty from INTEGER to TEXT
ALTER TABLE "Question" ALTER COLUMN "difficulty" SET DATA TYPE TEXT;
ALTER TABLE "Question" ALTER COLUMN "difficulty" SET DEFAULT 'easy';

-- Remove the temporary default so new rows must supply a value
ALTER TABLE "Question" ALTER COLUMN "options" DROP DEFAULT;
