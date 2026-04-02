import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    return new NextResponse("Project not found", { status: 404 })
  }

  const messages = await prisma.message.findMany({
    where: {
      chat: {
        projectId: project.id,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  return NextResponse.json({
    project,
    messages,
  })
}