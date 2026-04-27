import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set("user", "", {
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}