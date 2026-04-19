import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { getDomain, verifyEmail } from "@/lib/enrich";
import { generateEmailPatterns } from "@/lib/email";
import { runWithConcurrency } from "@/lib/utils";

import { findEmailMulti } from "@/lib/emailProviders";
import { enrichCompany } from "@/lib/companyEnrich";

/* ============================= */
/* FILTER (LOOSE = MORE LEADS)   */
/* ============================= */
function isGoodLead(p: any) {
  const text = `${p.title ?? ""} ${p.company ?? ""}`.toLowerCase();

  return (
    text.includes("founder") ||
    text.includes("ceo") ||
    text.includes("co-founder")
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, projectId, query } = await req.json();
    const userId = session.user.id;

    /* 🔥 SCRAPE MORE */
    const profiles = await scrapeLinkedIn(query || "saas founder USA");

    if (!profiles.length) {
      return NextResponse.json({ error: "No leads found" });
    }

    /* 📁 PROJECT */
    let project = projectId
      ? await prisma.project.findUnique({ where: { id: projectId } })
      : null;

    if (!project) {
      const product = await prisma.product.findFirst();
      if (!product) return NextResponse.json({ error: "No product" });

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
    const tasks = profiles.slice(0, 120).map((p: any) => async () => {
      try {
        if (!p?.name) return null;
        if (!isGoodLead(p)) return null;

        const [first, ...rest] = p.name.split(" ");
        const last = rest.join(" ");

        if (!first) return null;

        /* 🧠 DOMAIN */
        let domain = p.domain;

        if (!domain && p.company) {
          domain = await getDomain(p.company);
        }

        if (!domain) return null;

        /* 🔍 MULTI EMAIL */
        let email = await findEmailMulti({
          domain,
          first,
          last,
        });

        /* 🔁 PATTERN FALLBACK */
        if (!email) {
          const patterns = generateEmailPatterns(first, last, domain);

          for (const e of patterns.slice(0, 3)) {
            const ok = await verifyEmail(e);
            if (ok) {
              email = e;
              break;
            }
          }
        }

        if (!email) return null;

        /* ⚡ VERIFY */
        const valid = await verifyEmail(email);
        if (!valid) return null;

        /* 🏢 COMPANY ENRICH */
        const companyData = await enrichCompany(domain);

        /* 🚫 DUPLICATE */
        const exists = await prisma.lead.findFirst({
          where: { email },
        });

        if (exists) return null;

        /* 💾 SAVE */
        return await prisma.lead.create({
          data: {
            email,
            name: p.name,
            company: companyData?.name || p.company || "",
            source: "enriched",
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

    /* ⚡ HIGH PARALLEL */
    const results = await runWithConcurrency(tasks, 12);

    const created = results.filter(Boolean);

    return NextResponse.json({
      success: true,
      count: created.length,
      leads: created,
    });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: "Failed to generate leads" },
      { status: 500 }
    );
  }
}