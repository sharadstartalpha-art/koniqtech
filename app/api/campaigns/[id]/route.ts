import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET SINGLE CAMPAIGN
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        steps: true,
        recipients: true,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE CAMPAIGN
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { name, subject, content, status } = body;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        subject,
        content,
        status,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

// ✅ DELETE CAMPAIGN
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}