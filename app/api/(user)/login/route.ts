import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log("Email:", email);
  console.log("Password:", password);

  if (!email || !password) {
    return NextResponse.json({ message: "Email gerekli!" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log(" User found:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Kullacını adı veya şifre yanlış!" },
        { status: 401 }
      );
    } else {
      const jwtSecret = process.env.JWT_SECRET;
      // create JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        "1235671ca361c5b85f66178a429fac01383bb4985126",
        { expiresIn: "1d" }
      );

      console.log("Token created:", token);
      // return token and user info
      return NextResponse.json({
        token,
        user: { email: user.email, name: user.name },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Kullanıcı bilgisi alınamadı!" },
      { status: 500 }
    );
  }
}
