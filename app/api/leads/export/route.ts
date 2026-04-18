import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const ids = searchParams.get("ids");
    const campaignId = searchParams.get("campaignId");
    const search = searchParams.get("search") || "";

    let leads: any[] = [];

    // 🎯 SELECTED
    if (ids) {
      const idList = ids.split(",");
      leads = await prisma.lead.findMany({
        where: { id: { in: idList } },
      });
    }

    // 📩 CAMPAIGN → using EMAIL MATCH (important)
    else if (campaignId) {
      const recipients = await prisma.campaignRecipient.findMany({
        where: { campaignId },
      });

      const emails = recipients.map((r) => r.email);

      leads = await prisma.lead.findMany({
        where: {
          email: { in: emails },
        },
      });
    }

    // 🔍 FILTERED
    else {
      leads = await prisma.lead.findMany({
        where: {
          user: { email: session.user.email },
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
          ],
        },
      });
    }

    const data = leads.map((l) => ({
      Name: l.name,
      Email: l.email,
      Company: l.company || "",
      Profile: l.profileUrl || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=leads.xlsx",
      },
    });

  } catch (err) {
    console.error("EXPORT ERROR:", err);
    return new NextResponse("Export failed", { status: 500 });
  }
}