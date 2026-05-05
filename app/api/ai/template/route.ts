import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { type } = await req.json();

  const prompt = `
Write a professional ${type} invoice reminder email.
Include placeholders: {{name}}, {{amount}}, {{link}}.
Return HTML only.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({
    html: res.choices[0].message.content,
  });
}