import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!user.password) {
    return NextResponse.json(
      { error: "No password set" },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  // ✅ FIX: await cookies()
  const cookieStore = await cookies();

  cookieStore.set("user", "admin", {
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({
    success: true,
    userId: user.id,
  });
}