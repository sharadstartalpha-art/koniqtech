import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ==============================
// 🚀 CREATE QUERY (ADMIN)
// ==============================
export async function POST(req: Request) {
  try {
    // 🔐 AUTH
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔍 Find real DB user
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teamMembers: true, // adjust if your relation name differs
      },
    });

    if (!dbUser) {
      return Response.json(
        { error: "User not found in DB" },
        { status: 404 }
      );
    }

    // 🧠 get team + project
    const teamId = dbUser.teamMembers?.[0]?.teamId || "default";

    const project = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!project) {
      return Response.json(
        { error: "No project found" },
        { status: 400 }
      );
    }

    // 📥 request body
    const { query } = await req.json();

    if (!query) {
      return Response.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // ==============================
    // ✅ CREATE QUERY (FIXED)
    // ==============================
    const newQuery = await prisma.query.create({
      data: {
        text: query,

        // 🔥 REQUIRED FIELDS (THIS FIXES YOUR ERROR)
        userId: dbUser.id,
        teamId,
        projectId: project.id,

        scrapeStatus: "idle",
        enrichStatus: "idle",
        dedupStatus: "idle",
      },
    });

    return Response.json(newQuery);

  } catch (err) {
    console.error("❌ Create query error:", err);

    return Response.json(
      { error: "Failed to create query" },
      { status: 500 }
    );
  }
}