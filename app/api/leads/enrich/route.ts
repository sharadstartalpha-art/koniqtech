import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { leadId } = await req.json();

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "ENRICHING" },
  });

  const prompt = `
Company: ${lead.company}
Website: ${lead.website}

Return:
1. What they do
2. Why they need lead generation tools
3. Personalized cold email opener
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0].message.content || "";

  await prisma.leadEnrichment.create({
    data: {
      leadId,
      summary: text,
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "ENRICHED" },
  });

  return NextResponse.json({ success: true });
}