import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ➕ ADD STEP
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIXED
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT
    const body = await req.json();

    const step = await prisma.campaignStep.create({
      data: {
        ...body,
        campaignId: id,
      },
    });

    return NextResponse.json(step);

  } catch (error) {
    console.error("CREATE STEP ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create step" },
      { status: 500 }
    );
  }
}

// 📥 GET STEPS
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIXED
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT

    const steps = await prisma.campaignStep.findMany({
      where: { campaignId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(steps);

  } catch (error) {
    console.error("GET STEPS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch steps" },
      { status: 500 }
    );
  }
}