// app/api/recovery-analytics/route.ts

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   RECOVERY ANALYTICS API
========================================= */

export async function GET() {
  try {

    /* =========================================
       AUTH
    ========================================= */

    const user =
      await getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================================
       GET INVOICES
    ========================================= */

    const invoices =
      await prisma.invoice.findMany({
        where: {
          userId: user.id,
        },
      });

    /* =========================================
       GET REMINDER LOGS
    ========================================= */

    const logs =
      await prisma.reminderLog.findMany({
        where: {
          userId: user.id,
        },

        include: {
          invoice: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        take: 100,
      });

    /* =========================================
       TOTALS
    ========================================= */

    const totalInvoices =
      invoices.length;

    const recovered =
      invoices
        .filter(
          (i) =>
            i.status ===
            "paid"
        )
        .reduce(
          (sum, inv) =>
            sum +
            Number(
              inv.paidAmount ||
                0
            ),
          0
        );

    const pending =
      invoices
        .filter(
          (i) =>
            i.status !==
            "paid"
        )
        .reduce(
          (sum, inv) =>
            sum +
            Number(
              inv.balanceAmount ||
                inv.amount
            ),
          0
        );

    const failed =
      logs.filter(
        (l) =>
          l.status ===
          "failed"
      ).length;

    /* =========================================
       RECOVERY RATE
    ========================================= */

    const paidInvoices =
      invoices.filter(
        (i) =>
          i.status ===
          "paid"
      ).length;

    const recoveryRate =
      totalInvoices > 0
        ? Math.round(
            (paidInvoices /
              totalInvoices) *
              100
          )
        : 0;

    /* =========================================
       CHANNEL STATS
    ========================================= */

    const email =
      logs.filter(
        (l) =>
          l.channel ===
          "email"
      ).length;

    const whatsapp =
      logs.filter(
        (l) =>
          l.channel ===
          "whatsapp"
      ).length;

    const sms =
      logs.filter(
        (l) =>
          l.channel ===
          "sms"
      ).length;

    /* =========================================
       BEST CHANNEL
    ========================================= */

    let bestChannel =
      "Email";

    const maxChannel =
      Math.max(
        email,
        whatsapp,
        sms
      );

    if (
      maxChannel ===
      whatsapp
    ) {
      bestChannel =
        "WhatsApp";
    }

    if (
      maxChannel === sms
    ) {
      bestChannel =
        "SMS";
    }

    /* =========================================
       BEST TONE
    ========================================= */

    const friendly =
      logs.filter(
        (l) =>
          l.message
            ?.toLowerCase()
            .includes(
              "friendly"
            )
      ).length;

    const firm =
      logs.filter(
        (l) =>
          l.message
            ?.toLowerCase()
            .includes(
              "firm"
            )
      ).length;

    const final =
      logs.filter(
        (l) =>
          l.message
            ?.toLowerCase()
            .includes(
              "final"
            )
      ).length;

    let bestTone =
      "Friendly";

    const maxTone =
      Math.max(
        friendly,
        firm,
        final
      );

    if (
      maxTone === firm
    ) {
      bestTone =
        "Firm";
    }

    if (
      maxTone === final
    ) {
      bestTone =
        "Final Notice";
    }

    /* =========================================
       AVG RECOVERY DAYS
    ========================================= */

    const paidWithDates =
      invoices.filter(
        (i) =>
          i.status ===
            "paid" &&
          i.paidAt
      );

    let avgRecoveryDays = 0;

    if (
      paidWithDates.length >
      0
    ) {
      const totalDays =
        paidWithDates.reduce(
          (sum, inv) => {

            const created =
              new Date(
                inv.createdAt
              );

            const paid =
              new Date(
                inv.paidAt!
              );

            const diff =
              Math.ceil(
                (
                  paid.getTime() -
                  created.getTime()
                ) /
                  (
                    1000 *
                    60 *
                    60 *
                    24
                  )
              );

            return (
              sum + diff
            );

          },
          0
        );

      avgRecoveryDays =
        Math.round(
          totalDays /
            paidWithDates.length
        );
    }

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({

      stats: {

        recovered,

        pending,

        failed,

        recoveryRate,

        email,

        whatsapp,

        sms,

        bestChannel,

        bestTone,

        avgRecoveryDays,
      },

      recent:
        logs || [],
    });

  } catch (err) {

    console.error(
      "RECOVERY ANALYTICS ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load recovery analytics",
      },
      {
        status: 500,
      }
    );
  }
}