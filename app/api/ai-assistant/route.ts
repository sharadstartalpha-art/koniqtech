// app/api/ai-assistant/route.ts

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   AI ASSISTANT API
========================================= */

export async function POST(
  req: Request
) {
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
       BODY
    ========================================= */

    const body =
      await req.json();

    const {
      message,
    } = body;

    if (!message) {
      return NextResponse.json(
        {
          error:
            "Message required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       USER DATA
    ========================================= */

    const invoices =
      await prisma.invoice.findMany({
        where: {
          userId:
            user.id,
        },
      });

    const logs =
      await prisma.reminderLog.findMany({
        where: {
          userId:
            user.id,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        take: 100,
      });

    /* =========================================
       ANALYTICS
    ========================================= */

    const totalInvoices =
      invoices.length;

    const paidInvoices =
      invoices.filter(
        (i) =>
          i.status ===
          "paid"
      ).length;

    const unpaidInvoices =
      invoices.filter(
        (i) =>
          i.status !==
          "paid"
      ).length;

    const recovered =
      invoices.reduce(
        (
          sum,
          inv
        ) =>
          sum +
          Number(
            inv.paidAmount ||
              0
          ),
        0
      );

    const pending =
      invoices.reduce(
        (
          sum,
          inv
        ) =>
          sum +
          Number(
            inv.balanceAmount ||
              inv.amount
          ),
        0
      );

    const emailCount =
      logs.filter(
        (l) =>
          l.channel ===
          "email"
      ).length;

    const whatsappCount =
      logs.filter(
        (l) =>
          l.channel ===
          "whatsapp"
      ).length;

    const smsCount =
      logs.filter(
        (l) =>
          l.channel ===
          "sms"
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
       SIMPLE AI ENGINE
    ========================================= */

    const lower =
      message.toLowerCase();

    let reply = "";

    /* =========================================
       RECOVERY RATE
    ========================================= */

    if (
      lower.includes(
        "recovery"
      ) ||
      lower.includes(
        "performance"
      )
    ) {

      reply =
        `Your current recovery rate is ${recoveryRate}%.\n\n` +
        `Recovered Revenue: $${recovered}\n` +
        `Pending Recovery: $${pending}\n` +
        `Paid Invoices: ${paidInvoices}\n` +
        `Unpaid Invoices: ${unpaidInvoices}\n\n` +
        `Recommendation:\n` +
        `• Increase WhatsApp reminders for overdue invoices.\n` +
        `• Use Final Notice reminders after 7 days overdue.\n` +
        `• Enable automated workflows for faster collection.`;
    }

    /* =========================================
       BEST CHANNEL
    ========================================= */

    else if (
      lower.includes(
        "best channel"
      ) ||
      lower.includes(
        "channel"
      )
    ) {

      let best =
        "Email";

      const max =
        Math.max(
          emailCount,
          whatsappCount,
          smsCount
        );

      if (
        max ===
        whatsappCount
      ) {
        best =
          "WhatsApp";
      }

      if (
        max ===
        smsCount
      ) {
        best = "SMS";
      }

      reply =
        `Your best-performing reminder channel is ${best}.\n\n` +
        `Email Sent: ${emailCount}\n` +
        `WhatsApp Sent: ${whatsappCount}\n` +
        `SMS Sent: ${smsCount}\n\n` +
        `AI Recommendation:\n` +
        `• Continue using ${best} for overdue invoices.\n` +
        `• Combine Email + WhatsApp for high-value invoices.`;
    }

    /* =========================================
       OVERDUE
    ========================================= */

    else if (
      lower.includes(
        "overdue"
      ) ||
      lower.includes(
        "late invoices"
      )
    ) {

      const overdue =
        invoices.filter(
          (i) =>
            i.status !==
            "paid"
        );

      reply =
        `You currently have ${overdue.length} overdue invoices.\n\n`;

      overdue
        .slice(0, 5)
        .forEach(
          (inv) => {

            reply +=
              `• ${inv.clientEmail} → $${inv.amount}\n`;

          }
        );

      reply +=
        `\nAI Recommendation:\n` +
        `• Send firm reminders after 3 days.\n` +
        `• Escalate to WhatsApp after no response.\n` +
        `• Offer payment plans for high-value invoices.`;
    }

    /* =========================================
       AUTOMATION
    ========================================= */

    else if (
      lower.includes(
        "automation"
      ) ||
      lower.includes(
        "workflow"
      )
    ) {

      reply =
        `Recommended recovery workflow:\n\n` +
        `Day 1 → Friendly Email Reminder\n` +
        `Day 3 → WhatsApp Follow-up\n` +
        `Day 5 → SMS Reminder\n` +
        `Day 7 → Final Notice\n\n` +
        `This sequence typically improves recovery rates by 25-40%.`;
    }

    /* =========================================
       DEFAULT
    ========================================= */

    else {

      reply =
        `AI Recovery Assistant Summary:\n\n` +
        `• Recovery Rate: ${recoveryRate}%\n` +
        `• Total Recovered: $${recovered}\n` +
        `• Pending Amount: $${pending}\n` +
        `• Total Invoices: ${totalInvoices}\n\n` +
        `You can ask:\n` +
        `• "How is my recovery performance?"\n` +
        `• "Which reminder channel works best?"\n` +
        `• "Show overdue invoices"\n` +
        `• "Suggest automation workflow"`;
    }

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,
      reply,
    });

  } catch (err) {

    console.error(
      "AI ASSISTANT ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "AI assistant failed",
      },
      {
        status: 500,
      }
    );
  }
}