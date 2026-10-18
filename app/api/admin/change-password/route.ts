
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

const INTERNAL_ADMIN_ROLES = [
  "super_admin",
  "platform_manager",
  "platform_sales",
  "support",
  "finance",
  "developer",
  "qa",
  "customer_success",
  "marketing",
  "data_entry",
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please sign in again." },
        { status: 401 }
      );
    }

    const sessionRole = String(
      (session.user as { role?: unknown }).role ?? ""
    )
      .trim()
      .toLowerCase();

    if (!INTERNAL_ADMIN_ROLES.includes(sessionRole)) {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 403 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const currentPassword = data.currentPassword;
    const newPassword = data.newPassword;
    const confirmPassword = data.confirmPassword;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "All password fields are required." },
        { status: 400 }
      );
    }

    if (
      currentPassword.length === 0 ||
      newPassword.length < 12 ||
      newPassword.length > 128
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Your new password must contain between 12 and 128 characters.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "The new passwords do not match." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Your new password must be different from your current password.",
        },
        { status: 400 }
      );
    }

 const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    passwordHash: true,
    role: true,
  },
});

if (
  !user ||
  String(user.role).trim().toLowerCase() !== "super_admin"
) {
  return NextResponse.json(
    {
      success: false,
      message: "Super Admin account not found or access denied.",
    },
    { status: 403 }
  );
}

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Your current password is incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Please use your new password next time you sign in.",
    });
  } catch (error) {
    console.error("[ADMIN_CHANGE_PASSWORD]", error);

    return NextResponse.json(
      { success: false, message: "Unable to change password. Please try again." },
      { status: 500 }
    );
  }
}
