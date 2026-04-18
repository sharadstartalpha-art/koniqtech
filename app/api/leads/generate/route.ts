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
/* 🧠 Extract Company            */
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
        headers: { "Content-Type": "application/json" },
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

/* ============================= */
/* 📧 Email Generator            */
/* ============================= */
function generateEmail(first: string, last: string, domain: string) {
  const f = first.toLowerCase();
  const l = last.toLowerCase();

  const patterns = [
    `${f}@${domain}`,
    `${f}.${l}@${domain}`,
    `${f}${l}@${domain}`,
    `${f[0]}${l}@${domain}`,
  ];

  return patterns[0];
}

/* ============================= */
/* ✅ Email Validation           */
/* ============================= */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================= */
/* 🎯 ICP FILTER                 */
/* ============================= */
function isGoodLead(p: Profile) {
  const text = `${p.title} ${p.company}`.toLowerCase();

  return (
    (text.includes("founder") || text.includes("ceo")) &&
    (text.includes("saas") || text.includes("startup"))
  );
}

/* ============================= */
/* 🚀 API ROUTE                  */
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

    /* ============================= */
    /* 🔥 1. SCRAPE                 */
    /* ============================= */
    const profiles: Profile[] = await scrapeLinkedIn(query || "founder");

    if (!profiles.length) {
      return NextResponse.json({ error: "No leads found" });
    }

    /* ============================= */
    /* 📁 2. PROJECT                */
    /* ============================= */
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

    /* ============================= */
    /* ⚡ 3. PROCESS (PARALLEL)     */
    /* ============================= */
    const leads = await Promise.all(
      profiles.slice(0, 50).map(async (p) => {
        try {
          if (!p?.name) return null;
          if (!isGoodLead(p)) return null;

          /* 🧠 Company */
          let company = p.company || extractCompany(p.title);

          /* 🌐 Domain */
          let domain = p.domain || "";
          if (!domain && company) {
            domain = await findCompanyDomain(company);
          }

          /* 🧠 Name */
          const parts = p.name.trim().split(" ");
          const firstName = parts[0] || "";
          const lastName = parts.slice(1).join(" ") || "";

          let email: string | null = p.email || null;

          /* 🔥 Hunter */
          if (!email && domain && firstName && lastName) {
            try {
              email = await findEmail({
                domain,
                firstName,
                lastName,
              });
            } catch {}
          }

          /* ⚡ Fallback */
          if (!email) {
            email = domain
              ? generateEmail(firstName, lastName, domain)
              : `${firstName}${lastName}@linkedin-lead.com`;
          }

          if (!email || !isValidEmail(email)) return null;

          return {
            email,
            name: p.name,
            company: company || "",
            profileUrl: p.profileUrl || "",
          };

        } catch (err) {
          console.error("LEAD ERROR:", err);
          return null;
        }
      })
    );

    const cleanLeads = leads.filter(Boolean) as any[];

    if (!cleanLeads.length) {
      return NextResponse.json({ error: "No valid leads" });
    }

    /* ============================= */
    /* 🚀 4. BULK INSERT            */
    /* ============================= */
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

    /* ============================= */
    /* 📤 RESPONSE                  */
    /* ============================= */
    return NextResponse.json({
      success: true,
      count: cleanLeads.length,
      leads: cleanLeads,
    });

  } catch (err) {
    console.error("FULL ERROR:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}