import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, mode } = await req.json();

    if (!id || !mode) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.update({
      where: { id },

      data: {
        mode,
      },
    });

    return Response.json(invoice);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update mode" },
      { status: 500 }
    );
  }
}