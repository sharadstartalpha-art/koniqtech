import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text = body?.text;

    if (!text || !text.trim()) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    // ✅ CREATE QUERY
    const query = await prisma.query.create({
      data: {
        text,

        // ✅ REQUIRED FIELDS (IMPORTANT)
        userId: session.user.id,
        teamId: "default",       // change later
        projectId: "default",   // change later

        scrapeStatus: "idle",
        enrichStatus: "idle",
        dedupStatus: "idle",
      },
    });

    console.log("✅ Query created:", query.id);

    return Response.json({ query });

  } catch (err) {
    console.error("❌ Create query error:", err);
    return Response.json({ error: "Failed to create query" }, { status: 500 });
  }
}