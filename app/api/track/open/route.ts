import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rid = searchParams.get("rid");

  if (rid) {
    await prisma.campaignRecipient.update({
      where: { id: rid },
      data: {
        openedAt: new Date(),
        status: "OPENED",
      },
    });
  }

  return new Response(null, { status: 204 });
}