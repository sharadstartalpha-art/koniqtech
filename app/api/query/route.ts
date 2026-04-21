import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { query } = await req.json();

  const newQuery = await prisma.query.create({
    data: {
      text: query,
    },
  });

  return Response.json(newQuery);
}