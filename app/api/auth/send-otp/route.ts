import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = generateOTP();

  await prisma.verificationToken.create({
    data: {
      email,
      token: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // ✅ FIXED
    },
  });

  await sendEmail(
    email,
    "Your OTP Code",
    `<h2>Your OTP is: ${otp}</h2>`
  );

  return NextResponse.json({ success: true });
}