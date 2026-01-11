/*
  Warnings:

  - You are about to drop the column `heroAssetUrl` on the `ColumnEntry` table. All the data in the column will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CollectionItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_memoryId_fkey";

-- AlterTable
ALTER TABLE "ColumnEntry" DROP COLUMN "heroAssetUrl";

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "CollectionItem";
