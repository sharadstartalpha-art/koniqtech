import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = "GET_FROM_SESSION"; // replace

  const balance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  return NextResponse.json(balance);
}