import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const record = await prisma.passwordResetToken.findFirst({
    where: { token },
  });

  // ✅ FIXED
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  // ✅ FIXED
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed },
  });

  // ✅ cleanup token
  await prisma.passwordResetToken.delete({
    where: { id: record.id },
  });

  return NextResponse.json({ success: true });
}