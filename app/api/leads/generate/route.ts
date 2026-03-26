import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { projectId, query } = await req.json();

  // 🔥 ADD HERE
  const optimizedQuery = `${query} company website`;

  const userId = "GET_FROM_SESSION"; // use your auth logic

const userCredits = await prisma.userCredits.findUnique({
  where: { userId },
});

if (!userCredits || userCredits.credits <= 0) {
  return NextResponse.json(
    { error: "No credits left" },
    { status: 403 }
  );
}

await prisma.userCredits.update({
  where: { userId },
  data: {
    credits: {
      decrement: leads.length,
    },
  },
});

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: optimizedQuery, // 🔥 USE HERE
      num: 10,
    }),
  });

  const data = await res.json();

  const results = data.organic || [];

  // 🔥 Extract leads
  const leads = await Promise.all(
    results.map((item: any) =>
      prisma.lead.create({
        data: {
          projectId,
          company: item.title,
          website: item.link,
          status: "NEW",
        },
      })
    )
  );

  // 🔥 trigger enrichment
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leads/enrich-batch`, {
    method: "POST",
    body: JSON.stringify({
      leadIds: leads.map((l) => l.id),
    }),
  });

  return NextResponse.json(leads);
}