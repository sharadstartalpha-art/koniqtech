import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔹 validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 🔹 invalid user
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // 🔹 block unverified users
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 400 }
      );
    }

    // 🔹 password check
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // ✅ set user id
    cookieStore.set("user", user.id, {
      httpOnly: true,
      path: "/",
    });

    // ✅ set role (ADMIN / USER)
    cookieStore.set("role", user.role, {
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      role: user.role,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}