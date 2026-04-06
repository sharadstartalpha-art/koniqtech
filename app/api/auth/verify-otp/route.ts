import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Missing email or OTP" },
        { status: 400 }
      );
    }

    // get latest OTP (IMPORTANT FIX)
    const record = await prisma.verificationToken.findFirst({
      where: { email },
      orderBy: { expires: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "OTP not found" },
        { status: 400 }
      );
    }

    if (record.token !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (record.expires < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // delete after success
    await prisma.verificationToken.delete({
      where: { id: record.id },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}