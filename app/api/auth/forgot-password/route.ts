import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await sendEmail(
    email,
    "Reset Password",
    `<a href="${resetLink}">Reset Password</a>`
  );

  return NextResponse.json({ success: true });
}