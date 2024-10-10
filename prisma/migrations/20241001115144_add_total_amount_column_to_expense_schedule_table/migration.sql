/*
  Warnings:

  - Added the required column `totalAmount` to the `ExpenseSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseSchedule" ADD COLUMN     "totalAmount" INTEGER NOT NULL;
