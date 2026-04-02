import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")

  if (!projectId) {
    return NextResponse.json(
      { error: "Missing projectId" },
      { status: 400 }
    )
  }

  // ✅ ONLY FETCH EXISTING FIELDS
  const leads = await prisma.lead.findMany({
    where: { projectId },
  })

  const csvRows: string[][] = []

  // ✅ HEADER
  csvRows.push([
    "Name",
    "Email",
    "Company",
    "Website",
    "Phone",
    "Location",
  ])

  // ✅ DATA
  for (const lead of leads) {
    csvRows.push([
      lead.name || "",
      lead.email || "",
      lead.company || "",
      lead.website || "",
      lead.phone || "",
      lead.location || "",
    ])
  }

  // ✅ CSV BUILD
  const csvContent = csvRows
    .map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n")

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=leads.csv",
    },
  })
}