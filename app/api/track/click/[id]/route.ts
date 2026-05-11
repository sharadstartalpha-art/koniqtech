import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";

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

          include: {
            invoice: true,
          },
        }
      );

    if (!log) {
      return redirect(
        "/"
      );
    }

    /* =========================
       UPDATE CLICK
    ========================= */

    await prisma.reminderLog.update(
      {
        where: {
          id,
        },

        data: {
          clickedAt:
            new Date(),
        },
      }
    );

    console.log(
      "🔗 Payment clicked:",
      id
    );

    /* =========================
       REDIRECT
    ========================= */

    return redirect(
      log.invoice.paymentLink ||
        "/"
    );

  } catch (err) {

    console.error(
      "CLICK TRACK ERROR:",
      err
    );

    return redirect(
      "/"
    );
  }
}