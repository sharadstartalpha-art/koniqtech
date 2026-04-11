import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = searchParams.get("url");

  if (id) {
    await prisma.emailLog.update({
      where: { id },
      data: { clicked: true },
    });
  }

  return Response.redirect(url || "https://google.com");
}