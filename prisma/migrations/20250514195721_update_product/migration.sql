-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'distributor';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Size" ADD VALUE 'NINE_HUNDRED_GRAMS';
ALTER TYPE "Size" ADD VALUE 'FOUR_HUNDRED_FIFTY_GRAMS';
ALTER TYPE "Size" ADD VALUE 'TWO_HUNDRED_FIFTY_GRAMS';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "gender" DROP NOT NULL;
