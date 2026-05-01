import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: true,
      },
    });

    const result = users.map((u) => {
      const hasAccess = u.subscriptions.some(
        (s) => s.status === "ACTIVE" // ✅ FIXED
      );

      return {
        id: u.id,
        email: u.email,
        hasAccess,
      };
    });

    return NextResponse.json(result);

  } catch (err) {
    console.error("GET USERS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}