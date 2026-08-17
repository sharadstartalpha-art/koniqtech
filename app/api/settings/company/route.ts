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

    const form = await req.formData();

    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    const website = String(form.get("website") ?? "");
    const address = String(form.get("address") ?? "");
    const city = String(form.get("city") ?? "");
    const state = String(form.get("state") ?? "");
    const country = String(form.get("country") ?? "");
    const postalCode = String(form.get("postalCode") ?? "");

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

    return NextResponse.redirect(
      new URL("/settings/company?saved=true", req.url)
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to update company." },
      { status: 500 }
    );
  }
}