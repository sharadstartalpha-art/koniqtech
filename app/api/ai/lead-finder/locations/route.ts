import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns active CRM locations belonging to the signed-in user's organization.
 * Organization scoping is enforced on the database query; clients cannot
 * request locations for another organization.
 */
export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as
      | { id?: string; orgId?: string | null }
      | undefined;

    if (!user?.id || !user.orgId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in again." },
        { status: 401 },
      );
    }

    const locations = await prisma.organizationLocation.findMany({
      where: {
        orgId: user.orgId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        isDefault: true,
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(
      { locations },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("AI Lead Finder locations GET error:", error);
    return NextResponse.json(
      { error: "Unable to load CRM locations right now." },
      { status: 500 },
    );
  }
}
