import { NextResponse } from "next/server";

import { generateEmail } from "@/lib/aiEmail";

export async function POST(
  req: Request
) {
  try {

    const { amount } =
      await req.json();

    if (!amount) {
      return NextResponse.json(
        {
          error:
            "Amount is required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       GENERATE EMAIL
    ========================= */

    const email =
      generateEmail({
        amount: Number(amount),

        type: "friendly",

        clientName:
          "Customer",

        companyName:
          "KoniqTech",

        senderName:
          "KoniqTech Team",

        senderEmail:
          "info@koniqtech.com",
      });

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json({
      subject:
        email.subject,

      html: email.html,

      text: email.text,
    });

  } catch (error) {

    console.error(
      "PREVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate preview",
      },
      {
        status: 500,
      }
    );
  }
}