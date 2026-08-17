import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orgId = (session.user as any).orgId;

    const {
      name,
      phone,
      website,
      address,
      city,
      state,
      country,
      postalCode,
    } = await req.json();

    const organization = await prisma.organization.update({
      where: {
        id: orgId,
      },
      data: {
        name,
        phone,
        website,
        address,
        city,
        state,
        country,
        postalCode,
      },
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update company." },
      { status: 500 }
    );
  }
}