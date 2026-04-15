import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Parse body once
    const body = await req.json();
    const { teamId } = body;

    console.log("TEAM ID:", teamId);

    if (!teamId) {
      return NextResponse.json(
        { error: "No team selected" },
        { status: 400 }
      );
    }

    // 🔥 TEMP TEST DATA
    const people = [
      { email: "test1@gmail.com", name: "Test User" },
      { email: "test2@gmail.com", name: "Test User 2" },
    ];

    if (people.length === 0) {
      return NextResponse.json({ error: "No leads found" });
    }

    // 🔥 FIND OR CREATE PROJECT
    let project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      // ⚠️ You MUST provide productId
      // 👉 Replace this with a real product lookup if needed
      const product = await prisma.product.findFirst({
        where: { teamId },
      });

      if (!product) {
        return NextResponse.json({
          error: "No product found for team",
        });
      }

      project = await prisma.project.create({
        data: {
          name: "Default Project",
          teamId,
          userId: session.user.id,
          productId: product.id, // ✅ FIX
        },
      });

      console.log("Created project:", project.id);
    }

    // 🔥 SAVE LEADS
    const created = [];

    for (const p of people) {
      if (!p.email) continue;

      const exists = await prisma.lead.findFirst({
        where: {
          email: p.email,
          projectId: project.id,
        },
      });

      if (exists) continue;

      const lead = await prisma.lead.create({
        data: {
          email: p.email,
          name: p.name,
          userId: session.user.id,
          projectId: project.id,
          teamId,
        },
      });

      created.push(lead);
    }

    return NextResponse.json({
      success: true,
      count: created.length,
      leads: created,
    });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}