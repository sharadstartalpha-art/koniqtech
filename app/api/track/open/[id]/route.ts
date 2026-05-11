import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {

    const { id } =
      await context.params;

    /* =========================
       FIND LOG
    ========================= */

    const log =
      await prisma.reminderLog.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!log) {
      return new Response(
        null,
        {
          status: 404,
        }
      );
    }

    /* =========================
       UPDATE OPEN
    ========================= */

    await prisma.reminderLog.update(
      {
        where: {
          id,
        },

        data: {
          status: "opened",

          openedAt:
            new Date(),
        },
      }
    );

    console.log(
      "👀 Email opened:",
      id
    );

    /* =========================
       1x1 PIXEL
    ========================= */

    const pixel =
      Buffer.from(
        "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
        "base64"
      );

    return new Response(
      pixel,
      {
        headers: {
          "Content-Type":
            "image/gif",

          "Content-Length":
            pixel.length.toString(),
        },
      }
    );

  } catch (err) {

    console.error(
      "OPEN TRACK ERROR:",
      err
    );

    return new Response(
      null,
      {
        status: 500,
      }
    );
  }
}