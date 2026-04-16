import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const rid = req.nextUrl.searchParams.get("rid");

    // ❌ Missing ID
    if (!rid) {
      return new Response("Invalid unsubscribe request", {
        status: 400,
      });
    }

    // 🔍 Find recipient first (avoid crash if not exists)
    const recipient = await prisma.campaignRecipient.findUnique({
      where: { id: rid },
    });

    if (!recipient) {
      return new Response("Recipient not found", {
        status: 404,
      });
    }

    // 🚫 Already unsubscribed
    if (recipient.unsubscribed) {
      return new Response(
        `<h2>Already unsubscribed ✅</h2>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // ✅ Update status
    await prisma.campaignRecipient.update({
      where: { id: rid },
      data: {
        unsubscribed: true,
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });

    // ✅ Success response (HTML page)
    return new Response(
      `
      <div style="font-family:sans-serif;text-align:center;margin-top:50px;">
        <h2>✅ You have been unsubscribed</h2>
        <p>You will no longer receive emails from us.</p>
      </div>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("UNSUBSCRIBE ERROR:", error);

    return new Response("Something went wrong", {
      status: 500,
    });
  }
}