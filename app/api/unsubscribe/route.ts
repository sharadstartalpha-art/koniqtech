import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (email) {
    await prisma.user.update({
      where: { email },
      data: { unsubscribed: true },
    });
  }

  return new Response("Unsubscribed");
}