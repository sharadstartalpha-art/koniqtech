import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { findEmail } from "@/lib/hunter";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { teamId, projectId, query } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "No team selected" });
    }

    const userId = session.user.id;

    // 🔥 1. SCRAPE
    const profiles = await scrapeLinkedIn(query || "founder");

    if (!profiles.length) {
      return NextResponse.json({ error: "No LinkedIn leads" });
    }

    // 🔥 2. GET OR CREATE PROJECT
    let project;

    if (projectId) {
      project = await prisma.project.findUnique({
        where: { id: projectId },
      });
    }

    if (!project) {
      const product = await prisma.product.findFirst();

      if (!product) {
        return NextResponse.json({ error: "No product found" });
      }

      project = await prisma.project.create({
        data: {
          name: "Default Project",
          teamId,
          userId,
          productId: product.id, // ✅ FIXED
        },
      });
    }

    const created: any[] = [];

    // 🔥 3. PROCESS LEADS
    for (const p of profiles.slice(0, 50)) {
      try {
        if (!p?.name) continue;

        const [firstName = "", lastName = ""] = p.name.split(" ");

        const domain =
          (p as any).companyWebsite ||
          (p as any).company?.website ||
          "";

        let email: string | null = null;

        try {
          email = await findEmail({
            domain,
            firstName,
            lastName,
          });
        } catch (e) {
          console.error("HUNTER ERROR:", e);
        }

        if (!email) {
          email = `${p.name.replace(/\s+/g, "").toLowerCase()}@noemail.com`;
        }

        const exists = await prisma.lead.findFirst({
          where: {
            email,
            projectId: project.id,
          },
        });

        if (exists) continue;

        const lead = await prisma.lead.create({
          data: {
            email,
            name: p.name,
            company: p.company || "",
            source: email.includes("noemail")
              ? "linkedin"
              : "linkedin+hunter",
            userId,
            projectId: project.id,
            teamId,
          },
        });

        created.push(lead);

      } catch (err) {
        console.error("LEAD ERROR:", err);
      }
    }

    return NextResponse.json({
      success: true,
      count: created.length,
      leads: created,
    });

  } catch (err) {
    console.error("FULL ERROR:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}