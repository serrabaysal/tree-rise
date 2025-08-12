-- CreateEnum
CREATE TYPE "public"."AlanType" AS ENUM ('YANAN', 'DIKIM_YAPILAN');

-- CreateTable
CREATE TABLE "public"."Alan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."AlanType" NOT NULL,
    "coordinates" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alan_pkey" PRIMARY KEY ("id")
);
