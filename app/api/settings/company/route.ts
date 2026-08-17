import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orgId = (session.user as any).orgId;

  const body = await req.json();

  const {
    name,
    email,
    phone,
    address,
    website,
    city,
    state,
    country,
    postalCode,
  } = body;

  const organization = await prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      name,
      email,
      phone,
      address,
      website,
      city,
      state,
      country,
      postalCode,
    },
  });

  return NextResponse.json(organization);
}