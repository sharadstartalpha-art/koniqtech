import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const token = crypto.randomBytes(32).toString("hex");

 const user = await prisma.user.findUnique({
  where: { email },
});

if (!user) {
  return NextResponse.json({ error: "User not found" });
}

await prisma.passwordResetToken.create({
  data: {
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
  },
});

  return NextResponse.json({ success: true });
}