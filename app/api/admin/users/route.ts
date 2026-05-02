import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },

      include: {
        subscriptions: {
          where: {
            status: "ACTIVE",
          },
          include: {
            plan: true,
          },
        },
      },
    });

    const formatted = users.map((u) => {
      const sub = u.subscriptions[0]; // latest active

      return {
        id: u.id,
        email: u.email,

        hasAccess: !!sub,

        plan: sub
          ? {
              id: sub.plan.id,
              name: sub.plan.name,
            }
          : null,

        expiresAt: sub?.expiresAt || null,
      };
    });

    return NextResponse.json(formatted);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}