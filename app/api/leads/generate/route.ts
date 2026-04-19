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
/* FILTER                        */
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

    /* 🚀 TASKS */
    const tasks = profiles.slice(0, 80).map((p) => async () => {
      try {
        if (!p?.name) return null;
        if (!isGoodLead(p)) return null;

        const parts = p.name.trim().split(" ");
        const first = parts[0] || "";
        const last = parts.slice(1).join(" ") || "";

        /* 🧠 DOMAIN */
        let domain: string | undefined = p.domain ?? undefined;

        if (!domain && p.company) {
          try {
            const d = await getDomain(p.company);
            domain = d ?? undefined;
          } catch {}
        }

        /* 🔍 EMAIL */
        let email: string | null = null;

        if (domain && first) {
          try {
            email = await findEmail({
              domain,
              firstName: first,
              lastName: last,
            });
          } catch {}
        }

        if (!email && domain && first) {
          const patterns = generateEmailPatterns(first, last, domain);
          email = patterns[0] || patterns[1] || null;
        }

        /* ✅ VERIFY */
        let isValid = false;

        if (email) {
          try {
            isValid = await verifyEmail(email);
          } catch {}
        }

        if (!email && !p.profileUrl) return null;

        /* 🚫 DUPLICATE CHECK (FIXED) */
        const orConditions: any[] = [];

        if (email) {
          orConditions.push({ email });
        }

        if (p.profileUrl) {
          orConditions.push({ profileUrl: p.profileUrl });
        }

        let exists = null;

        if (orConditions.length > 0) {
          exists = await prisma.lead.findFirst({
            where: {
              OR: orConditions,
            },
          });
        }

        if (exists) return null;

        /* 💾 SAVE */
        return await prisma.lead.create({
          data: {
            email: email || `noemail_${Date.now()}@placeholder.com`,
            name: p.name,
            company: p.company || "",
            source: isValid ? "verified" : "linkedin",
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

    /* ⚡ RUN */
    const results = await runWithConcurrency(tasks, 8);

    const created = results.filter(Boolean);

    console.log("✅ CREATED:", created.length);
    console.log("❌ SKIPPED:", profiles.length - created.length);

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