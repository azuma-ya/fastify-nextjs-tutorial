/*
  Warnings:

  - Added the required column `content` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "content" JSON NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
