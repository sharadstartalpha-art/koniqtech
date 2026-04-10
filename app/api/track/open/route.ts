import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await prisma.emailLog.updateMany({
      where: { leadId: id },
      data: { opened: true },
    });
  }

  return new Response(null, { status: 204 });
}