import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// ✅ CREATE CAMPAIGN
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, subject, content, userId, steps, recipients } = body;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        subject,
        content,
        userId,

        // ✅ Nested create
        steps: {
          create: steps || [],
        },
        recipients: {
          create: recipients || [],
        },
      },
      include: {
        steps: true,
        recipients: true,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

// ✅ GET ALL CAMPAIGNS
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        steps: true,
        recipients: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}