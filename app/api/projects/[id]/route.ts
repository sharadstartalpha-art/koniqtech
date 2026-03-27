import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();

  const project = await prisma.project.findUnique({
  where: { id },
});

// ✅ FIX
if (!project) {
  return new Response("Project not found", { status: 404 });
}

const messages = await prisma.message.findMany({
  where: { projectId: project.id },
  orderBy: { createdAt: "asc" },
});
  return NextResponse.json(project);
}