-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('FIDAN', 'TEMIZLIK', 'DESTEK', 'PSIKOLOJIK_DESTEK', 'SU_TASIMA');

-- CreateEnum
CREATE TYPE "public"."ActivityStatus" AS ENUM ('AKTIF', 'DOLDU', 'IPTAL');

-- CreateEnum
CREATE TYPE "public"."ActivityCategory" AS ENUM ('COCUK_DOSTU', 'YETISKIN', 'AILE', 'GRUP', 'BIREYSEL');

-- CreateEnum
CREATE TYPE "public"."TargetGroup" AS ENUM ('GENCLER', 'YETISKINLER', 'AILELER', 'HERKES');

-- CreateEnum
CREATE TYPE "public"."DifficultyLevel" AS ENUM ('KOLAY', 'ORTA', 'ZOR');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ActivityType" NOT NULL,
    "status" "public"."ActivityStatus" NOT NULL,
    "category" "public"."ActivityCategory" NOT NULL,
    "targetGroup" "public"."TargetGroup" NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "locationName" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "difficulty" "public"."DifficultyLevel" NOT NULL,
    "imageUrl" TEXT,
    "beforeImage" TEXT,
    "afterImage" TEXT,
    "toolsRequired" TEXT[],
    "volunteersNeed" INTEGER NOT NULL,
    "volunteersMax" INTEGER,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Participation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participation" ADD CONSTRAINT "Participation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
