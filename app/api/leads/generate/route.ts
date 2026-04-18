import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { findEmail } from "@/lib/hunter";

type Profile = {
  name: string;
  email?: string | null;
  company?: string;
  title?: string;
  domain?: string;
  profileUrl?: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, projectId, query } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "No team selected" });
    }

    const userId = session.user.id;

    // 🔥 1. SCRAPE (Apify only)
    const profiles: Profile[] = await scrapeLinkedIn(query || "founder");

    console.log("APIFY RESPONSE:", profiles);

    if (!profiles.length) {
      return NextResponse.json({ error: "No leads found" });
    }

    // 🔥 2. GET OR CREATE PROJECT
    let project = null;

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
          productId: product.id,
        },
      });
    }

    const created: any[] = [];

    // 🔥 3. PROCESS LEADS
    for (const p of profiles.slice(0, 50)) {
      try {
        if (!p?.name || !p.company) continue;

        // 🎯 OPTIONAL FILTER
        if (p.title) {
          const t = p.title.toLowerCase();
          if (!t.includes("founder") && !t.includes("ceo")) {
            continue;
          }
        }

        const [firstName = "", lastName = ""] = p.name.split(" ");

        let email: string | null = p.email || null;

        // 🔥 Try Hunter
        if (!email && p.domain && firstName && lastName) {
          try {
            email = await findEmail({
              domain: p.domain,
              firstName,
              lastName,
            });
          } catch (e) {
            console.error("HUNTER ERROR:", e);
          }
        }

        // ⚡ Fallback email guess
        if (!email && p.domain) {
          const safe = p.name.replace(/\s+/g, "").toLowerCase();

          const cleanDomain = p.domain
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "");

          email = `${safe}@${cleanDomain}`;
        }

        // ❌ Still no email
        if (!email) continue;

        // ✅ Basic validation
        if (!email.includes("@")) continue;

        // 🚫 Duplicate check
        const exists = await prisma.lead.findFirst({
          where: {
            OR: [
              { email },
              { profileUrl: p.profileUrl || "" },
            ],
          },
        });

        if (exists) continue;

        const lead = await prisma.lead.create({
          data: {
            email,
            name: p.name,
            company: p.company || "",
            source: "linkedin",
            userId,
            projectId: project.id,
            teamId,
            profileUrl: p.profileUrl || "",
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