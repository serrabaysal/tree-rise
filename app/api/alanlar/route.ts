import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) { 
  try {
    const alanlar = await prisma.alan.findMany();
    return NextResponse.json(alanlar);
  } catch (error: any) {
    console.error("GET alanlar error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Alanlar alınamadı", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, type, coordinates } = body;
 console.log("POST alanlar body:", body);
    if (!name || !type || !coordinates) {
      return NextResponse.json(
        { error: "Tüm alanlar (name, type, coordinates) zorunludur" },
        { status: 400 }
      );
    }

    if (typeof coordinates === "string") {
      coordinates = JSON.parse(coordinates);
    }

    // Manuel mapping
    const alanTypeMapping: { [key: string]: "YANAN" | "DIKIM_YAPILAN" | "FREE" } = {
      yanan: "YANAN",
      dikim_yapilan: "DIKIM_YAPILAN",
      free: "FREE",
      serbest: "FREE", // opsiyonel olarak Türkçe "serbest" kelimesini de destekleyebilirsin
    };

    const lowerType = String(type).toLowerCase();

    const typeEnum = alanTypeMapping[lowerType];

    if (!typeEnum) {
      return NextResponse.json(
        {
          error: `Geçersiz type değeri: ${type}. Beklenen: YANAN, DIKIM_YAPILAN, FREE`,
        },
        { status: 400 }
      );
    }

    const yeniAlan = await prisma.alan.create({
      data: {
        name,
        type: typeEnum,
        coordinates,
      },
    });

    return NextResponse.json(yeniAlan, { status: 201 });
  } catch (error: any) {
    console.error("POST alanlar error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Alan eklenemedi", details: error.message },
      { status: 500 }
    );
  }
}


