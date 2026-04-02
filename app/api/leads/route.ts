import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")

  // ✅ if no projectId → return empty
  if (!projectId) {
    return NextResponse.json([], { status: 200 })
  }

  // ✅ ONLY FETCH VALID FIELDS
  const leads = await prisma.lead.findMany({
    where: { projectId },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(leads)
}