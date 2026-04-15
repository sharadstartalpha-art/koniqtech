import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await req.json();

  if (!teamId) {
    return NextResponse.json({ error: "No team selected" }, { status: 400 });
  }

  try {
    // 🔥 APOLLO API CALL
   const response = await fetch("https://api.apollo.io/v1/mixed_people/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.APOLLO_API_KEY!,
  },
  body: JSON.stringify({
    page: 1,
    per_page: 10,

    // 🔥 RELAX FILTERS (VERY IMPORTANT)
    person_titles: ["founder", "ceo", "cto"],
    locations: ["United States"],

    // ❌ REMOVE strict filters for now
    // organization_num_employees_ranges
    // seniority filters (optional)
  }),
});

    const data = await response.json();

    const people = data.people || [];

    if (people.length === 0) {
      return NextResponse.json({ error: "No leads found" });
    }

    // 🔥 FIND TEAM PROJECT
    const project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      return NextResponse.json({ error: "No project for team" });
    }

    // 🔥 SAVE LEADS
    const created = [];

    for (const p of people) {
      if (!p.email) continue;

      const exists = await prisma.lead.findFirst({
        where: {
          email: p.email,
          projectId: project.id,
        },
      });

      if (exists) continue;

     const lead = await prisma.lead.create({
  data: {
    email: p.email,
    name: p.name,
    company: p.organization?.name || "",
    title: p.title || "",
    source: "apollo",
    userId: session.user.id,
    projectId: project.id,
    teamId, // ✅ REQUIRED FIX
  },
});

      created.push(lead);
    }

    return NextResponse.json({
      success: true,
      count: created.length,
      leads: created,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Apollo fetch failed" });
  }
}