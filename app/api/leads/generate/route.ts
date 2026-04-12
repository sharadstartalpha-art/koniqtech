import { deductCredits } from "@/lib/usage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // 🔥 PAYWALL HERE
  await deductCredits(user!.id, 10, "GENERATE_LEADS");

  // your lead generation logic...

  return Response.json({ success: true });
}