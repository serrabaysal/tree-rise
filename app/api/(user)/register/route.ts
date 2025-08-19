import { NextRequest, NextResponse } from "next/server";
import {PrismaClient} from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
        return NextResponse.json({ message: "Email ve şifre gerekli!" }, { status: 400 });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password, // Şifreyi hash'lemek için uygun bir yöntem kullanın
            },
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: "Kullanıcı oluşturulamadı!" }, { status: 500 });
    }
}