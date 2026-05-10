import { NextResponse } from "next/server";

import { zavu } from "@/lib/zavu";

export async function POST(
  req: Request
) {
  try {

    const body =
      await req.json();

    const {
      to,
      message,
    } = body;

    /* =========================
       VALIDATION
    ========================= */

    if (!to || !message) {
      return NextResponse.json(
        {
          error:
            "Phone and message required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       SEND SMS
    ========================= */

    const response =
      await zavu.messages.send({
        channel: "sms",

        to,

        text: message,
      });

    console.log(
      "📱 SMS SENT:",
      response
    );

    return NextResponse.json({
      success: true,
      response,
    });

  } catch (err: any) {

    console.error(
      "SMS SEND ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          err?.message ||
          "Failed to send SMS",
      },
      {
        status: 500,
      }
    );
  }
}