import {prisma} from "@/lib/prisma";

export async function GET() {
  const payments = await prisma.payment.findMany();

  const csv = [
    ["Date", "Amount"],
    ...payments.map((p) => [
      new Date(p.createdAt).toISOString(),
      p.amount,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=revenue.csv",
    },
  });
}