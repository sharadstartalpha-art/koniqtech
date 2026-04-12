import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/usage";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const { message } = await req.json();

  // 🔥 deduct credits
  await deductCredits(user!.id, 2, "AI_MESSAGE");

  return Response.json({ reply: "AI response here..." });
}