import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { normalize } from "@/lib/utils";

// ✅ CREATE LEAD (NO DUPLICATES)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, company, profileUrl, teamId } =
      await req.json();

    if (!teamId) {
      return NextResponse.json(
        { error: "Missing teamId" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "No project found" },
        { status: 400 }
      );
    }

    const nameKey = normalize(name);
    const companyKey = normalize(company);

    let existing = null;

    // 🔍 Dedup logic
    if (email) {
      existing = await prisma.lead.findUnique({ where: { email } });
    }

    if (!existing && profileUrl) {
      existing = await prisma.lead.findUnique({
        where: { profileUrl },
      });
    }

    if (!existing && nameKey && companyKey) {
      existing = await prisma.lead.findFirst({
        where: { nameKey, companyKey },
      });
    }

    let lead;

    if (existing) {
      lead = await prisma.lead.update({
        where: { id: existing.id },
        data: {
          email: email || existing.email,
          name: name || existing.name,
          company: company || existing.company,
          companyKey,
        },
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          email,
          name,
          nameKey,
          company,
          companyKey,
          profileUrl,
          teamId,

          user: {
            connect: { id: session.user.id },
          },

          project: {
            connect: { id: project.id },
          },
        },
      });
    }

    return NextResponse.json(lead);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create lead" });
  }
}

// ✅ GET LEADS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) return NextResponse.json([]);

    const leads = await prisma.lead.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(leads);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch leads" });
  }
}