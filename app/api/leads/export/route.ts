import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    where: { user: { email: session.user.email } },
  });

  const csv = [
    ["Name", "Email", "Company", "Profile"],
    ...leads.map((l) => [
      l.name,
      l.email,
      l.company || "",
      l.profileUrl || "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=leads.csv",
    },
  });
}