import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ error: "Unauthorized" });

  const { productId } = await req.json();

  const project = await prisma.project.create({
    data: {
      name: "My Project",
      userId: session.user.id,
      productId,
    },
  });

  return Response.json(project);
}