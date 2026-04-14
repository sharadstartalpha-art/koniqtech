import { handleFailedPayments } from "@/lib/billing";
import { NextResponse } from "next/server";

export async function GET() {
  await handleFailedPayments();
  return NextResponse.json({ success: true });
}