import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    where: { type: "USAGE" },
  });

  return NextResponse.json({
    totalUsage: transactions.length,
  });
}