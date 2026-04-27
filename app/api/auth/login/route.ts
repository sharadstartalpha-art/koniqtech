import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 400 }
      );
    }

    // ✅ FIXED: use await cookies()
    const cookieStore = await cookies();

    cookieStore.set("user", user.id, {
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}