import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "This endpoint is no longer available.",
    },
    {
      status: 410,
    }
  );
}