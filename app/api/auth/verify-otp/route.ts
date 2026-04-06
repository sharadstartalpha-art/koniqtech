import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  const record = await prisma.verificationToken.findFirst({
    where: { email, token: otp },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  await prisma.verificationToken.delete({ where: { id: record.id } });

  return NextResponse.json({ success: true });
}