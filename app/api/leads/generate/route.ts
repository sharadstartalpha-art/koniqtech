import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { findEmail } from "@/lib/hunter";

/* ============================= */
/* TYPES                         */
/* ============================= */
type Profile = {
  name: string;
  email?: string | null;
  company?: string;
  title?: string;
  domain?: string;
  profileUrl?: string;
};

/* ============================= */
/* HELPERS                       */
/* ============================= */
function extractCompany(title?: string): string {
  if (!title) return "";

  const lower = title.toLowerCase();
  const patterns = [" at ", "@", "founder of", "ceo of", "co-founder of"];

  for (const p of patterns) {
    const idx = lower.indexOf(p);
    if (idx !== -1) {
      return title.slice(idx + p.length).trim();
    }
  }

  return "";
}

function generateEmail(first: string, last: string, domain: string) {
  return `${first.toLowerCase()}@${domain}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isGoodLead(p: Profile) {
  const text = `${p.title} ${p.company}`.toLowerCase();

  return (
    (text.includes("founder") || text.includes("ceo")) &&
    (text.includes("saas") || text.includes("startup"))
  );
}

/* ============================= */
/* ROUTE                         */
/* ============================= */
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

    /* 🔥 SCRAPE */
    const profiles: Profile[] = await scrapeLinkedIn(query || "founder");

    if (!profiles.length) {
      return NextResponse.json({ error: "No leads found" });
    }

    /* 📁 PROJECT */
    let project = projectId
      ? await prisma.project.findUnique({ where: { id: projectId } })
      : null;

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

    /* ⚡ PROCESS (FAST) */
    const leads = await Promise.all(
      profiles.slice(0, 50).map(async (p) => {
        try {
          if (!p?.name) return null;
          if (!isGoodLead(p)) return null;

          const company = p.company || extractCompany(p.title);

          const parts = p.name.trim().split(" ");
          const firstName = parts[0] || "";
          const lastName = parts.slice(1).join(" ") || "";

          let email: string | null = p.email || null;

          if (!email && p.domain && firstName && lastName) {
            email = await findEmail({
              domain: p.domain,
              firstName,
              lastName,
            });
          }

          if (!email) {
            email = p.domain
              ? generateEmail(firstName, lastName, p.domain)
              : `${firstName}${lastName}@linkedin-lead.com`;
          }

          if (!email || !isValidEmail(email)) return null;

          return {
            email,
            name: p.name,
            company: company || "",
            profileUrl: p.profileUrl || "",
          };

        } catch {
          return null;
        }
      })
    );

    const cleanLeads = leads.filter(Boolean) as any[];

    if (!cleanLeads.length) {
      return NextResponse.json({ error: "No valid leads" });
    }

    /* 🚀 SAVE */
    await prisma.lead.createMany({
      data: cleanLeads.map((l) => ({
        email: l.email,
        name: l.name,
        company: l.company,
        source: "linkedin",
        userId,
        projectId: project!.id,
        teamId,
        profileUrl: l.profileUrl,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      count: cleanLeads.length,
      leads: cleanLeads,
    });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: "Failed to generate leads" },
      { status: 500 }
    );
  }
}