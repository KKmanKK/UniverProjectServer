/*
  Warnings:

  - You are about to drop the `Dictionary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dictionary" DROP CONSTRAINT "Dictionary_userId_fkey";

-- DropTable
DROP TABLE "Dictionary";

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "speed" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
