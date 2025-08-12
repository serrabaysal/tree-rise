import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { name, type, coordinates } = body;

    if (!name || !type || !coordinates) {
      return NextResponse.json({ error: 'Tüm alanlar (name, type, coordinates) zorunludur' }, { status: 400 });
    }

    const yeniAlan = await prisma.alan.create({
      data: {
        name,
        type,
        coordinates,
      },
    });

    return NextResponse.json(yeniAlan);
  } catch (error) {
    console.error('POST alanlar error:', error);
    return NextResponse.json({ error: 'Alan eklenemedi' }, { status: 500 });
  }
}
