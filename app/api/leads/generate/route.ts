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

    // 🔥 2. PROCESS LEADS
    for (const p of profiles.slice(0, 50)) {
      try {
        if (!p?.name) continue;

        // ✅ SPLIT NAME
        const nameParts = p.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts[1] || "";

        // ✅ DOMAIN (fallback safe)
        const domain =
          p.companyWebsite ||
          p.company?.website ||
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

        // ✅ FALLBACK (so UI still works)
        if (!email) {
          console.log("NO EMAIL, saving fallback:", p.name);

          email = `${p.name.replace(/\s+/g, "").toLowerCase()}@noemail.com`;
        }

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
            name: p.name || "",
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
      { error: String(err) },
      { status: 500 }
    );
  }
}