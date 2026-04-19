import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { findEmail } from "@/lib/hunter";
import { getDomain, verifyEmail } from "@/lib/enrich";
import { generateEmailPatterns } from "@/lib/email";
import { runWithConcurrency } from "@/lib/utils";

/* ============================= */
/* TYPES                         */
/* ============================= */
type Profile = {
  name: string;
  company?: string;
  title?: string;
  domain?: string;
  profileUrl?: string;
};

/* ============================= */
/* FILTER (LESS STRICT 🚀)       */
/* ============================= */
function isGoodLead(p: Profile) {
  const text = `${p.title ?? ""} ${p.company ?? ""}`.toLowerCase();

  return (
    text.includes("founder") ||
    text.includes("ceo") ||
    text.includes("co-founder")
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

    /* 🔥 SCRAPE MORE (IMPORTANT) */
    const profiles: Profile[] = await scrapeLinkedIn(
      query || "saas founder USA"
    );

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

    /* 🚀 TASKS */
    const tasks = profiles.slice(0, 100).map((p) => async () => {
      try {
        if (!p?.name) return null;
        if (!isGoodLead(p)) return null;

        const parts = p.name.trim().split(" ");
        const first = parts[0] || "";
        const last = parts.slice(1).join(" ") || "";

        if (!first) return null;

        /* 🧠 DOMAIN */
        let domain: string | undefined = p.domain ?? undefined;

        if (!domain && p.company) {
          try {
            const d = await getDomain(p.company);
            domain = d ?? undefined;
          } catch {}
        }

        if (!domain) return null;

        let email: string | null = null;

        /* 🔍 PROVIDER 1: HUNTER */
        try {
          email = await findEmail({
            domain,
            firstName: first,
            lastName: last,
          });
        } catch {}

        /* 🔁 PROVIDER 2: PATTERN (FAST LIMIT) */
        if (!email) {
          const patterns = generateEmailPatterns(first, last, domain);

          for (const e of patterns.slice(0, 3)) {
            try {
              const ok = await verifyEmail(e);
              if (ok) {
                email = e;
                break;
              }
            } catch {}
          }
        }

        /* ❌ NO EMAIL → SKIP (QUALITY RULE) */
        if (!email) return null;

        /* ⚡ FINAL VERIFY (LIGHT — only once) */
        let valid = false;
        try {
          valid = await verifyEmail(email);
        } catch {}

        if (!valid) return null;

        /* 🚫 DUPLICATE CHECK */
        const exists = await prisma.lead.findFirst({
          where: {
            OR: [
              { email },
              { profileUrl: p.profileUrl || "" },
            ],
          },
        });

        if (exists) return null;

        /* 💾 SAVE */
        return await prisma.lead.create({
          data: {
            email,
            name: p.name,
            company: p.company || "",
            source: "linkedin",
            userId,
            projectId: project!.id,
            teamId,
            profileUrl: p.profileUrl || "",
          },
        });

      } catch (err) {
        console.error("TASK ERROR:", err);
        return null;
      }
    });

    /* ⚡ HIGHER CONCURRENCY (FASTER 🚀) */
    const results = await runWithConcurrency(tasks, 10);

    const created = results.filter(Boolean);

    return NextResponse.json({
      success: true,
      count: created.length,
      leads: created,
    });

  } catch (err) {
    console.error("ROUTE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to generate leads" },
      { status: 500 }
    );
  }
}