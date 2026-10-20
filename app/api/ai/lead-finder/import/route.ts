
import { NextRequest, NextResponse } from "next/server";
import { requirePlatformSuperAdmin } from "@/shared/lib/require-platform-super-admin";
import { prisma } from "@/shared/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SELECTION_COUNT = 100;

type RequestBody = {
  candidateIds?: unknown;
};

export async function POST(request: NextRequest) {
  // Authorize every request before accessing prospect records.
  const access = await requirePlatformSuperAdmin();

  if (access.response) {
    return access.response;
  }

  const { orgId } = access.user;

  try {
    let body: RequestBody;

    try {
      body = (await request.json()) as RequestBody;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const candidateIds = Array.isArray(body.candidateIds)
      ? [
          ...new Set(
            body.candidateIds
              .filter(
                (id): id is string =>
                  typeof id === "string" && id.trim().length > 0,
              )
              .map((id) => id.trim()),
          ),
        ]
      : [];

    if (candidateIds.length === 0) {
      return NextResponse.json(
        { error: "Select at least one prospect." },
        { status: 400 },
      );
    }

    if (candidateIds.length > MAX_SELECTION_COUNT) {
      return NextResponse.json(
        {
          error: `You can select up to ${MAX_SELECTION_COUNT} prospects at a time.`,
        },
        { status: 400 },
      );
    }

    const candidates = await prisma.aiLeadCandidate.findMany({
      where: {
        id: { in: candidateIds },
        orgId,
      },
      select: {
        id: true,
        businessName: true,
        status: true,
      },
    });

    if (candidates.length !== candidateIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more prospects were not found in the platform database.",
        },
        { status: 404 },
      );
    }

    const alreadyQualified = candidates.filter(
      (candidate) => candidate.status === "qualified",
    );

    const toQualify = candidates.filter(
      (candidate) => candidate.status === "discovered",
    );

    const unsupported = candidates.filter(
      (candidate) =>
        candidate.status !== "discovered" &&
        candidate.status !== "qualified",
    );

    if (unsupported.length > 0) {
      return NextResponse.json(
        {
          error:
            "Some selected prospects have been dismissed, disqualified, or processed already. Refresh the results and select eligible prospects.",
        },
        { status: 409 },
      );
    }

    if (toQualify.length > 0) {
      await prisma.aiLeadCandidate.updateMany({
        where: {
          id: { in: toQualify.map((candidate) => candidate.id) },
          orgId,
          status: "discovered",
        },
        data: {
          status: "qualified",
        },
      });
    }

    return NextResponse.json({
      success: true,
      savedCount: toQualify.length,
      alreadySavedCount: alreadyQualified.length,
      saved: [...toQualify, ...alreadyQualified].map((candidate) => ({
        candidateId: candidate.id,
        businessName: candidate.businessName,
      })),
      message: `${toQualify.length} prospect(s) qualified; ${alreadyQualified.length} were already qualified. No customer CRM leads were created.`,
    });
  } catch (error) {
    console.error("Platform Lead Finder prospect update failed:", error);

    return NextResponse.json(
      { error: "Could not update the selected prospects. Please try again." },
      { status: 500 },
    );
  }
}
