import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, subject, content, teamId } = await req.json();

    const campaign = await prisma.campaign.create({
      data: {
        name,
        subject,
        content,
        userId: session.user.id,
        teamId: teamId || null,

        // ✅ CREATE DEFAULT STEP
        steps: {
          create: [
            {
              name: "Step 1",
              subject: subject || "Quick question 👀",
              body: content || "Hi {{name}}, let's connect!",
              order: 1,
              delay: 0,
            },
          ],
        },
      },
    });

    return NextResponse.json(campaign);

  } catch (err) {
    console.error("CREATE CAMPAIGN ERROR:", err);

    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}