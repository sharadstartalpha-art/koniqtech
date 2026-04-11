import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deductCredits } from "@/lib/usage";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 🔥 COST PER REQUEST
    await deductCredits(session.user.id, 10, "AI_MESSAGE");

  } catch (err: any) {
    if (err.message === "NO_CREDITS") {
      return NextResponse.json(
        { error: "Upgrade your plan" },
        { status: 402 }
      );
    }

    throw err;
  }

  const { message } = await req.json();

  // 👉 your AI logic here
  const reply = "AI response here...";

  return NextResponse.json({ reply });
}