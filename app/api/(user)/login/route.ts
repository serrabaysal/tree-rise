import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email gerekli!" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı!" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Kullanıcı bilgisi alınamadı!" }, { status: 500 });
  }
}


