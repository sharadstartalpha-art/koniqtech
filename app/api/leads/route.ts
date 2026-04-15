import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// ✅ CREATE LEAD (manual)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, teamId } = await req.json();

    if (!email || !teamId) {
      return NextResponse.json(
        { error: "Missing email or teamId" },
        { status: 400 }
      );
    }

// 🔥 FIND PROJECT FOR TEAM
const project = await prisma.project.findFirst({
  where: { teamId },
});

if (!project) {
  return NextResponse.json(
    { error: "No project found for this team" },
    { status: 400 }
  );
}

   const lead = await prisma.lead.create({
  data: {
    email,
    name: "",
    company: "",
    title: "",
    teamId,

    user: {
      connect: { id: session.user.id },
    },

    project: {
      connect: { id: project.id },
    },
  },
});

    return NextResponse.json(lead);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create lead" });
  }
}

// ✅ GET LEADS (team scoped)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) return NextResponse.json([]);

    const leads = await prisma.lead.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch leads" });
  }
}