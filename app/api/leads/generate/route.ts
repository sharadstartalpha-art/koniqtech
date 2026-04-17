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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

        // 🎯 FILTER (only decision makers)
        if (
          !p.title?.toLowerCase().includes("founder") &&
          !p.title?.toLowerCase().includes("ceo")
        ) {
          continue;
        }

        const [firstName = "", lastName = ""] = p.name.split(" ");

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

        // ✅ smarter fallback
        if (!email) {
          const safe = p.name.replace(/\s+/g, "").toLowerCase();

          if (domain) {
            email = `${safe}@${domain.replace("https://", "").replace("www.", "")}`;
          } else {
            email = `${safe}@gmail.com`;
          }
        }

        // 🚫 duplicate check
        const exists = await prisma.lead.findFirst({
          where: {
            OR: [
              { email },
              { profileUrl: p.profileUrl },
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