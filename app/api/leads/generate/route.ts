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

    // ✅ Parse body safely
    const { teamId, query } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "No team selected" });
    }

    const userId = session.user.id;

    console.log("TEAM:", teamId);
    console.log("QUERY:", query);

    // 🔥 1. SCRAPE LINKEDIN
    const profiles = await scrapeLinkedIn(query || "founder");

    console.log("SCRAPED PROFILES:", profiles.length);

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

    const created: any[] = [];

    // 🔥 2. PROCESS LEADS SAFELY
    for (const p of profiles.slice(0, 10)) {
      try {
        if (!p?.name) continue;

        // ✅ SAFE DOMAIN EXTRACTION
        const domain = extractDomain(p.title || "company");

        // ✅ SAFE EMAIL FETCH
        let email = null;

        try {
          email = await findEmail(domain, p.name);
        } catch (e) {
          console.error("HUNTER ERROR:", e);
        }

        if (!email) continue;

        // ✅ CHECK DUPLICATE
        const exists = await prisma.lead.findFirst({
          where: {
            email,
            projectId: project.id,
          },
        });

        if (exists) continue;

        // ✅ CREATE LEAD
        const lead = await prisma.lead.create({
          data: {
            email,
            name: p.name,
            source: "linkedin",
            userId,
            projectId: project.id,
            teamId,
          },
        });

        created.push(lead);

      } catch (innerErr) {
        console.error("LEAD ERROR:", innerErr);
        continue;
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
      { error: String(err) }, // 🔥 shows real error
      { status: 500 }
    );
  }
}