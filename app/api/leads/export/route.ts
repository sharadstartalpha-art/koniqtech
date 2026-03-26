import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const leads = await prisma.lead.findMany({
    where: { projectId },
    include: { enrichment: true },
  });

  // 🔥 Convert to CSV
  const csvRows = [];

  // Header
  csvRows.push([
    "Company",
    "Website",
    "Summary",
    "Outreach",
    "Status",
  ]);

  // Data
  for (const lead of leads) {
    csvRows.push([
      lead.company || "",
      lead.website || "",
      lead.enrichment?.summary || "",
      lead.enrichment?.outreachLine || "",
      lead.status,
    ]);
  }

  csvRows.push([
  "Company",
  "Website",
  "Email", // 🔥 ADD
  "Summary",
  "Outreach",
  "Status",
]);
  const csvContent = csvRows
    .map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=leads.csv",
    },
  });
}