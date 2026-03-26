import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { leadIds } = await req.json();

  // fire & forget
  processLeads(leadIds);

  return NextResponse.json({ started: true });
}

// 🔥 Email finder
async function findEmail(domain: string) {
  try {
    const res = await fetch(
      `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${process.env.HUNTER_API_KEY}`
    );

    const data = await res.json();

    const emails = data?.data?.emails;

    if (emails && emails.length > 0) {
      return emails[0].value;
    }

    return null;
  } catch {
    return null;
  }
}

// 🔥 Main worker
async function processLeads(leadIds: string[]) {
  for (const id of leadIds) {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { enrichment: true },
      });

      if (!lead) continue;

      // ✅ skip already processed
      if (lead.status === "ENRICHED") continue;

      // update status
      await prisma.lead.update({
        where: { id },
        data: { status: "ENRICHING" },
      });

      // 🔥 Extract domain
      const domain = lead.website
        ?.replace("https://", "")
        .replace("http://", "")
        .split("/")[0];

      // 🔥 Get email
      const email = domain ? await findEmail(domain) : null;

      // 🔥 AI enrichment
      const prompt = `
Company: ${lead.company}
Website: ${lead.website}

Return JSON:
{
  "summary": "...",
  "outreach": "..."
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      let summary = "";
      let outreach = "";

      try {
        const parsed = JSON.parse(
          completion.choices[0].message.content || "{}"
        );
        summary = parsed.summary || "";
        outreach = parsed.outreach || "";
      } catch {
        summary = completion.choices[0].message.content || "";
      }

      // 🔥 Save everything together
      await prisma.$transaction([
        prisma.lead.update({
          where: { id },
          data: {
            email,
            status: "ENRICHED", // ✅ FIXED
          },
        }),

        prisma.leadEnrichment.upsert({
          where: { leadId: id },
          update: {
            summary,
            outreachLine: outreach,
          },
          create: {
            leadId: id,
            summary,
            outreachLine: outreach,
          },
        }),
      ]);
    } catch (err) {
      await prisma.lead.update({
        where: { id },
        data: { status: "FAILED" },
      });
    }
  }
}