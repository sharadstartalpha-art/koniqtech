import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
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

    // ✅ return invisible pixel
    return new Response(
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
        "base64"
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "image/png",
        },
      }
    );

  } catch (err) {
    console.error("TRACK ERROR:", err);
    return new Response(null, { status: 200 });
  }
}