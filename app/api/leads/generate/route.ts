import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deductCredit } from "@/lib/credits";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 🔥 CHECK + DEDUCT CREDIT
    await deductCredit(session.user.id);

    // ✅ YOUR ORIGINAL LOGIC
    return Response.json({ success: true });

  } catch (err: any) {
    if (err.message === "NO_CREDITS") {
      return Response.json(
        { error: "NO_CREDITS" },
        { status: 403 }
      );
    }

    return Response.json({ error: "Server error" }, { status: 500 });
  }
}