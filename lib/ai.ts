import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ✅ AI EMAIL GENERATOR
export async function generateEmail(name?: string, company?: string) {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Write a short cold email to ${name || "a prospect"} about ${company || "their company"}. Keep it persuasive.`,
        },
      ],
    });

    return res.choices[0].message.content || "";
  } catch (err) {
    console.log("AI failed → fallback");

    return `
      <p>Hi ${name || "there"},</p>
      <p>I came across ${company || "your company"} and it looks interesting.</p>
      <p>We help generate leads automatically.</p>
      <p>Would love to connect 🚀</p>
    `;
  }
}

// ✅ LEAD SCORING
export function scoreLead(lead: any) {
  let score = 0;

  if (lead.email?.includes("ceo")) score += 40;
  if (lead.company?.includes("Tech")) score += 30;
  if (lead.email?.includes("gmail")) score -= 10;

  return score;
}