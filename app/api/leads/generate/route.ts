import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { findEmail } from "@/lib/hunter";
import { extractDomain } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Extract query
    const { teamId, query } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "No team selected" });
    }

    // 🔥 1. SCRAPE LINKEDIN (pass query)
    const profiles = await scrapeLinkedIn(query || "founder");

    if (!profiles.length) {
      return NextResponse.json({ error: "No LinkedIn leads" });
    }

    // 🔥 FIND PROJECT
    const project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      return NextResponse.json({ error: "No project found" });
    }

    const created = [];

    // 🔥 2. ENRICH WITH HUNTER
    for (const p of profiles.slice(0, 20)) { // ✅ increased limit
      const domain = extractDomain(p.title || "company");

      const email = await findEmail(domain, p.name);

      if (!email) continue;

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
          source: "linkedin",
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
    console.error("HYBRID ERROR:", err);

    return NextResponse.json(
      { error: "Hybrid generation failed" },
      { status: 500 }
    );
  }
}