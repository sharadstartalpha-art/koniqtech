import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import { scrapeLinkedIn } from "@/lib/linkedin";
import { findEmail } from "@/lib/hunter";
import { getDomain, verifyEmail } from "@/lib/enrich";

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

function isGoodLead(p: Profile) {
  const text = `${p.title ?? ""} ${p.company ?? ""}`.toLowerCase();

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

    /* 🚀 ENRICH + SAVE */
    const created: any[] = [];

    await Promise.all(
      profiles.slice(0, 50).map(async (p) => {
        try {
          if (!p?.name) return;
          if (!isGoodLead(p)) return;

          const company = p.company || extractCompany(p.title);

          const parts = p.name.trim().split(" ");
          const firstName = parts[0] || "";
          const lastName = parts.slice(1).join(" ") || "";

          /* 🧠 STEP 1: GET DOMAIN */
          let domain: string | undefined = p.domain ?? undefined;

          if (!domain && company) {
            const result = await getDomain(company);
            domain = result ?? undefined; // 🔥 FIX HERE
          }

          if (!domain) return;

          /* 🔍 STEP 2: FIND EMAIL */
          const email = await findEmail({
            domain,
            firstName,
            lastName,
          });

          if (!email) return;

          /* ✅ STEP 3: VERIFY EMAIL */
          const valid = await verifyEmail(email);
          if (!valid) return;

          /* 🚫 DUPLICATE CHECK */
          const exists = await prisma.lead.findFirst({
            where: {
              OR: [
                { email },
                { profileUrl: p.profileUrl || "" },
              ],
            },
          });

          if (exists) return;

          /* 💾 SAVE */
          const lead = await prisma.lead.create({
            data: {
              email,
              name: p.name,
              company: company || "",
              source: "linkedin",
              userId,
              projectId: project!.id,
              teamId,
              profileUrl: p.profileUrl || "",
            },
          });

          created.push(lead);

        } catch (err) {
          console.error("LEAD ERROR:", err);
        }
      })
    );

    if (!created.length) {
      return NextResponse.json({
        error: "No valid leads (all emails failed verification)",
      });
    }

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