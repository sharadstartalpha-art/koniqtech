import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const id = searchParams.get("id");

  if (id) {
    await prisma.emailLog.updateMany({
      where: { leadId: id },
      data: { clicked: true },
    });
  }

  return Response.redirect(url || "/");
}