import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  const data: any = {};

  users.forEach((u) => {
    const date = new Date(u.createdAt).toLocaleDateString();

    if (!data[date]) data[date] = 0;

    data[date] += 1;
  });

  const formatted = Object.keys(data).map((date) => ({
    date,
    users: data[date],
  }));

  return NextResponse.json(formatted);
}