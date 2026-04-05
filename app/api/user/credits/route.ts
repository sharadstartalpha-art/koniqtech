import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ credits: 0 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  });

  return Response.json({
    credits: user?.credits?.balance || 0,
  });
}