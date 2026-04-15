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

    const { teamId } = await req.json();

    if (!teamId) {
      return NextResponse.json(
        { error: "No team selected" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // 🔥 TEMP TEST DATA
    const people = [
      { email: "test1@gmail.com", name: "Test User" },
      { email: "test2@gmail.com", name: "Test User 2" },
    ];

    // ✅ GET ANY PRODUCT
    let product = await prisma.product.findFirst();

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: "Lead Finder",
          slug: "lead-finder",
          price: 0,
        },
      });
    }

    // 🔥 FIND OR CREATE PROJECT
    let project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: "Default Project",

          user: {
            connect: { id: userId },
          },

          product: {
            connect: { id: product.id },
          },

          team: {
            connect: { id: teamId }, // ✅ FIX
          },
        },
      });
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
          name: p.name || "",
          source: "manual",
          userId,
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
    console.error("FULL ERROR:", err);

    return NextResponse.json(
      { error: String(err) }, // 👈 DEBUG MODE
      { status: 500 }
    );
  }
}