import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { normalize } from "@/lib/utils";

// ==============================
// ✅ CREATE LEAD (NO DUPLICATES)
// ==============================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, company, profileUrl, teamId } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "No project found for this team" },
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
          nameKey,
          companyKey,
          profileUrl: profileUrl || existing.profileUrl,
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
    console.error("POST /leads error:", err);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

// ==============================
// ✅ GET LEADS (SEARCH + PAGINATION)
// ==============================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const q = searchParams.get("q") || "";

    const PAGE_SIZE = 10;

    const leads = await prisma.lead.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return NextResponse.json(leads);
  } catch (err) {
    console.error("GET /leads error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}