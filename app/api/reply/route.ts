import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const recipient = await prisma.campaignRecipient.findFirst({
    where: { email },
  });

  if (!recipient) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  await prisma.campaignRecipient.update({
    where: { id: recipient.id },
    data: {
      status: "REPLIED",
      repliedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}