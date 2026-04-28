import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  const invoices = await prisma.invoice.findMany();

  const prompt = `
Analyze these invoices and explain why payments are delayed:

${JSON.stringify(invoices)}

Give short actionable insights.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({
    insights: res.choices[0].message.content,
  });
}