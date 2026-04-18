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

/* ============================= */
/* 🧠 Extract Company from Title */
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

/* ============================= */
/* 🌐 Find Company Domain        */
/* ============================= */
async function findCompanyDomain(company: string): Promise<string> {
  try {
    const token = process.env.APIFY_API_TOKEN;

    if (!token) return "";

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: `${company} official website`,
          maxPagesPerQuery: 1,
        }),
      }
    );

    const data = await res.json();
    const items = Array.isArray(data) ? data : [data];

    const results = items[0]?.organicResults || [];
    const first = results.find((r: any) => r.link);

    if (!first?.link) return "";

    const url = new URL(first.link);
    return url.hostname.replace("www.", "");

  } catch (err) {
    console.error("DOMAIN ERROR:", err);
    return "";
  }
}

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

    /* ============================= */
    /* 🔥 1. SCRAPE LEADS            */
    /* ============================= */
    const profiles: Profile[] = await scrapeLinkedIn(query || "founder");

    console.log("APIFY RESPONSE:", profiles);

    if (!profiles.length) {
      return NextResponse.json({ error: "No leads found" });
    }

    /* ============================= */
    /* 📁 2. PROJECT SETUP           */
    /* ============================= */
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

    /* ============================= */
    /* 🚀 3. PROCESS LEADS           */
    /* ============================= */
    for (const p of profiles.slice(0, 50)) {
      try {
        if (!p?.name) continue;

        // 🎯 Filter
        if (p.title) {
          const t = p.title.toLowerCase();
          if (!t.includes("founder") && !t.includes("ceo")) {
            continue;
          }
        }

        /* 🧠 Extract company */
        let company = p.company || extractCompany(p.title);

        /* 🌐 Find domain */
        let domain = p.domain || "";

        if (!domain && company) {
          domain = await findCompanyDomain(company);
        }

        /* 🧠 Name parsing */
        const parts = p.name.trim().split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        let email: string | null = p.email || null;

        /* 🔥 Hunter (real emails) */
        if (!email && domain && firstName && lastName) {
          try {
            email = await findEmail({
              domain,
              firstName,
              lastName,
            });
          } catch (e) {
            console.error("HUNTER ERROR:", e);
          }
        }

        /* ⚡ Fallback email */
        if (!email) {
          const safe = p.name.replace(/\s+/g, "").toLowerCase();

          email = domain
            ? `${safe}@${domain}`
            : `${safe}@linkedin-lead.com`;
        }

        /* ✅ Validate */
        if (!email.includes("@")) continue;

        /* 🚫 Duplicate check */
        const exists = await prisma.lead.findFirst({
          where: {
            OR: [
              { email },
              { profileUrl: p.profileUrl || "" },
            ],
          },
        });

        if (exists) continue;

        /* 💾 Save */
        const lead = await prisma.lead.create({
          data: {
            email,
            name: p.name,
            company: company || "",
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

    /* ============================= */
    /* ✅ RESPONSE                   */
    /* ============================= */
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