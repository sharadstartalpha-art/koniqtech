import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

/* =========================
   GET ALL LINKS
========================= */
export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json([]);

  const { payload } = await jwtVerify(token, secret);
  const userId = payload.id as string;

  const links = await prisma.paymentLink.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(links);
}

/* =========================
   CREATE LINK
========================= */
/* CREATE LINK */
export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { payload } = await jwtVerify(token, secret);
  const userId = payload.id as string;

  const { title, url } = await req.json();

  if (!title || !url) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await prisma.paymentLink.create({
    data: {
      userId,
      title,
      url, // ✅ user provided
    },
  });

  return NextResponse.json(created);
}
/* =========================
   DELETE
========================= */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await prisma.paymentLink.delete({
    where: { id: id! },
  });

  return NextResponse.json({ success: true });
}