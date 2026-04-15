import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET TEAMS
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json([]);

  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
  });

  return NextResponse.json(teams);
}

// ✅ CREATE TEAM
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

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