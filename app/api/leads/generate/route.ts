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
        "X-Api-Key": process.env.APOLLO_API_KEY!,
      },
      body: JSON.stringify({
        page: 1,
        per_page: 10,

        // 🎯 HIGH-CONVERTING FILTERS (USA/EU SaaS)
        person_titles: [
          "CEO",
          "CTO",
          "Founder",
          "Co-Founder",
          "VP Engineering",
          "Head of Engineering"
        ],

        person_locations: [
          "United States",
          "United Kingdom",
          "Germany",
          "Netherlands"
        ],

        organization_num_employees_ranges: ["11-50", "51-200"],

        q_organization_keywords: "saas software startup",
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