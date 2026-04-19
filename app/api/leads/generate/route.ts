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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, projectId, query } = await req.json();
    const userId = session.user.id;

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
    const tasks = profiles.slice(0, 150).map((p: any) => async () => {
      try {
        if (!p?.name) return null;

        const [first, ...rest] = p.name.split(" ");
        const last = rest.join(" ");

        /* 🧠 DOMAIN */
        let domain = p.domain;

        if (!domain && p.company) {
          domain = await getDomain(p.company);
        }

        /* 🔍 EMAIL */
        let email: string | null = null;

        if (domain) {
          email = await findEmailMulti({
            domain,
            first,
            last,
          });
        }

        /* 🔁 FALLBACK */
        if (!email && domain) {
          const patterns = generateEmailPatterns(first, last, domain);

          for (const e of patterns.slice(0, 2)) {
            const ok = await verifyEmail(e);
            if (ok) {
              email = e;
              break;
            }
          }
        }

        /* 🏢 COMPANY ENRICH */
        const companyData = domain
          ? await enrichCompany(domain)
          : null;

        /* 🚫 DUPLICATE (CLEAN VERSION) */
        const conditions: any[] = [];

        if (email) {
          conditions.push({ email });
        }

        if (p.profileUrl) {
          conditions.push({ profileUrl: p.profileUrl });
        }

        const exists =
          conditions.length > 0
            ? await prisma.lead.findFirst({
                where: { OR: conditions },
              })
            : null;

        if (exists) return null;

        /* 💾 SAVE (ALLOW PARTIAL LEADS) */
        return await prisma.lead.create({
          data: {
            email:
              email ||
              `noemail_${Date.now()}_${Math.random()}@placeholder.com`,
            name: p.name,
            company: companyData?.name || p.company || "",
            source: email ? "enriched" : "linkedin",
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