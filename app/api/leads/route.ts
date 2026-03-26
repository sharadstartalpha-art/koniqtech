import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const projectId = searchParams.get("projectId");

if (!projectId) {
  return NextResponse.json([], { status: 200 });
}

if (!projectId) {
  return NextResponse.json([], { status: 200 });
}

  const leads = await prisma.lead.findMany({
    where: { projectId: projectId! },
    include: {
      enrichment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(leads);
}