import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // FIDAN, TEMIZLIK vb.

  try {
    const activities = await prisma.activity.findMany({
      where: type ? { type: type as any } : {},
      orderBy: { date: "asc" },
      include: { createdBy: true, place: true }, // isteğe bağlı: kullanıcı ve alan bilgisi
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Etkinlikler alınamadı!" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      type,
      category,
      targetGroup,
      lat,
      lng,
      locationName,
      date,
      startTime,
      endTime,
      difficulty,
      imageUrl,
      beforeImage,
      afterImage,
      toolsRequired,
      volunteersNeed,
      volunteersMax,
      alanId,
      createdById,
    } = body;

    // Basit doğrulama
    if (!title || !type || !date || !lat || !lng || !alanId || !createdById) {
      return NextResponse.json(
        { message: "Gerekli alanlar eksik!" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        type,
        status: "AKTIF", // varsayılan
        category,
        targetGroup,
        lat,
        lng,
        locationName,
        date: new Date(date),
        startTime,
        endTime,
        difficulty,
        imageUrl,
        beforeImage,
        afterImage,
        toolsRequired,
        volunteersNeed,
        volunteersMax,
        alanId,
        createdById,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Etkinlik oluşturulamadı!" },
      { status: 500 }
    );
  }
}
