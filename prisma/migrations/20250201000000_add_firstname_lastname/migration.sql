-- AlterTable: Add firstName and lastName, migrate from name, then drop name
ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT;

-- Migrate existing name: first word -> firstName, remainder -> lastName
UPDATE "User" SET
  "firstName" = CASE
    WHEN "name" IS NULL OR TRIM("name") = '' THEN 'User'
    WHEN POSITION(' ' IN TRIM("name")) > 0 THEN SPLIT_PART(TRIM("name"), ' ', 1)
    ELSE TRIM("name")
  END,
  "lastName" = CASE
    WHEN "name" IS NULL OR TRIM("name") = '' THEN 'User'
    WHEN POSITION(' ' IN TRIM("name")) > 0 THEN TRIM(SUBSTRING(TRIM("name") FROM POSITION(' ' IN TRIM("name")) + 1))
    ELSE TRIM("name")
  END;

ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;
ALTER TABLE "User" DROP COLUMN "name";
