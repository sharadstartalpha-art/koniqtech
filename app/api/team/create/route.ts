import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Team name required" }, { status: 400 });
  }

  const team = await prisma.team.create({
    data: {
      name,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  });

  return NextResponse.json(team);
}