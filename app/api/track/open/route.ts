import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await prisma.emailLog.update({
      where: { id },
      data: { opened: true },
    });
  }

  return new Response(
    new Uint8Array([137,80,78,71]), // tiny pixel
    { headers: { "Content-Type": "image/png" } }
  );
}