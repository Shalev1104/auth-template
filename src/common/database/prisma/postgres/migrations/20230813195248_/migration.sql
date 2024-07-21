/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auth_strategy` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthStrategies" AS ENUM ('Local', 'Google', 'Facebook', 'Github');

-- DropIndex
DROP INDEX "fullName";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "full_name" VARCHAR NOT NULL,
DROP COLUMN "auth_strategy",
ADD COLUMN     "auth_strategy" "AuthStrategies" NOT NULL;
