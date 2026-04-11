import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const { name } = await req.json();

  const workspace = await prisma.workspace.create({
    data: {
      name,
      users: {
        connect: { id: session?.user.id },
      },
    },
  });

  await prisma.user.update({
    where: { id: session?.user.id },
    data: { workspaceId: workspace.id },
  });

  return NextResponse.json({ success: true });
}