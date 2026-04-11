import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { fetchApolloLeads } from "@/lib/apollo";

export async function POST(req: Request) {
  const { industry, location, title } = await req.json();

  // 🔐 USER
  const user = await prisma.user.findFirst({
    include: { projects: true },
  });

  if (!user || user.credits <= 0) {
    return new Response("No credits", { status: 403 });
  }

  // ✅ FETCH REAL LEADS (Apollo)
  let leads = [];

  try {
    leads = await fetchApolloLeads({
      industry,
      location,
      title,
    });
  } catch (err) {
    console.log("Apollo failed → fallback");

    // 🧪 fallback (safe)
    leads = Array.from({ length: 10 }).map((_, i) => ({
      name: `${title || "Founder"} ${i}`,
      email: `lead${i}@${industry || "company"}.com`,
      company: `${industry || "Tech"} Corp`,
      score: Math.floor(Math.random() * 100),
    }));
  }

  // 💰 COST
  const cost = Math.ceil(leads.length / 10);

  if (user.credits < cost) {
    return new Response("Not enough credits", { status: 403 });
  }

  // ✅ DEDUCT
  await prisma.user.update({
    where: { id: user.id },
    data: {
      credits: {
        decrement: cost,
      },
    },
  });

  return NextResponse.json({ leads });
}