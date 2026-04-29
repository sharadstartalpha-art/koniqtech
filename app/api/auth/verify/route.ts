import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  const { token } = await req.json();

  const record = await prisma.magicLink.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired link" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: record.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 400 }
    );
  }

  // 🔐 CREATE JWT
  const jwt = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", jwt, {
    httpOnly: true,
    path: "/",
  });

  // 🧹 CLEANUP
  await prisma.magicLink.delete({ where: { token } });

  return res;
}