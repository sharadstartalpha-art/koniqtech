import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  // 🔥 Mock leads (replace later with OpenAI)
  const leads = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
  ];

  return NextResponse.json({ leads });
}