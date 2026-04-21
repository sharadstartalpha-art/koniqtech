import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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
// ✅ GET LEADS (FIXED RELATION FILTER)
// ==============================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const q = searchParams.get("q") || "";

    // ✅ Proper WHERE
    const where: Prisma.LeadWhereInput = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },

            // ✅ FIXED relation filter
            {
              query: {
                is: {
                  text: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {};

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          query: true, // 🔥 required for UI
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total });
  } catch (err) {
    console.error("GET /leads error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}