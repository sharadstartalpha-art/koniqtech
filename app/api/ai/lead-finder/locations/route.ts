
import { NextResponse } from "next/server";
import { requirePlatformSuperAdmin } from "@/shared/lib/require-platform-super-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Platform Lead Finder does not use customer CRM locations.
 * This endpoint remains available for compatibility with the existing UI,
 * but returns an empty list after verifying Super Admin authorization.
 */
export async function GET() {
  const access = await requirePlatformSuperAdmin();

  if (access.response) {
    return access.response;
  }

  return NextResponse.json(
    { locations: [] },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
