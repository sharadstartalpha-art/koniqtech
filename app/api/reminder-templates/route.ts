import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const templates = await prisma.reminderTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (err) {
    console.error("GET TEMPLATES ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}