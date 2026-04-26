import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email },
    });
  }

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiry: expiry,
    },
  });

  await sendOTP(email, otp);

  return NextResponse.json({ success: true });
}