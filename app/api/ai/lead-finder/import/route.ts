import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMPORT_COUNT = 100;

type SessionUser = {
  id?: string;
  orgId?: string | null;
};

type ImportBody = {
  candidateIds?: unknown;
  locationId?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as SessionUser | undefined;

    if (!user?.id || !user.orgId) {
      return NextResponse.json(
        { error: "You must be signed in to import leads." },
        { status: 401 },
      );
    }

    let body: ImportBody;
    try {
      body = (await request.json()) as ImportBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const locationId = typeof body.locationId === "string" ? body.locationId.trim() : "";
    const candidateIds = Array.isArray(body.candidateIds)
      ? [...new Set(body.candidateIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0))]
      : [];

    if (!locationId) {
      return NextResponse.json({ error: "Select a CRM location before importing." }, { status: 400 });
    }

    if (candidateIds.length === 0) {
      return NextResponse.json({ error: "Select at least one prospect to import." }, { status: 400 });
    }

    if (candidateIds.length > MAX_IMPORT_COUNT) {
      return NextResponse.json(
        { error: `You can import up to ${MAX_IMPORT_COUNT} prospects at a time.` },
        { status: 400 },
      );
    }

    const location = await prisma.organizationLocation.findFirst({
      where: {
        id: locationId,
        orgId: user.orgId,
        active: true,
      },
      select: { id: true },
    });

    if (!location) {
      return NextResponse.json(
        { error: "The selected CRM location was not found or is inactive." },
        { status: 404 },
      );
    }

    const candidates = await prisma.aiLeadCandidate.findMany({
      where: {
        id: { in: candidateIds },
        orgId: user.orgId,
      },
      select: {
        id: true,
        businessName: true,
        businessPhone: true,
        website: true,
        industry: true,
        address: true,
        city: true,
        state: true,
        country: true,
        source: true,
        sourceUrl: true,
        status: true,
        importedLeadId: true,
      },
    });

    if (candidates.length !== candidateIds.length) {
      return NextResponse.json(
        { error: "One or more selected prospects could not be found in your organization. Refresh and try again." },
        { status: 404 },
      );
    }

    const imported: Array<{ candidateId: string; leadId: string; companyName: string }> = [];
    const alreadyImported: string[] = [];

    for (const candidate of candidates) {
      if (candidate.importedLeadId || candidate.status === "imported") {
        alreadyImported.push(candidate.id);
        continue;
      }

      const companyName = candidate.businessName.trim();
      if (!companyName) continue;

      const lead = await prisma.$transaction(async (tx) => {
        // Re-check inside the transaction so a repeated request does not create
        // another CRM lead after a prior successful import.
        const current = await tx.aiLeadCandidate.findFirst({
          where: { id: candidate.id, orgId: user.orgId! },
          select: { status: true, importedLeadId: true },
        });

        if (!current || current.importedLeadId || current.status === "imported") {
          return null;
        }

        const createdLead = await tx.lead.create({
          data: {
            orgId: user.orgId!,
            locationId: location.id,
            source: `ai_lead_finder:${candidate.source}`,
            firstName: companyName,
            companyName,
            phone: candidate.businessPhone,
            address: candidate.address || [candidate.city, candidate.state, candidate.country]
              .filter((part): part is string => Boolean(part))
              .join(", ") || null,
            tags: ["AI Lead Finder", candidate.industry].filter(Boolean).join(", "),
            // The Lead model's industry field is an enum; omit it here because
            // external search strings are not guaranteed to match enum values.
          },
          select: { id: true, companyName: true },
        });

        await tx.aiLeadCandidate.update({
          where: { id: candidate.id },
          data: {
            status: "imported",
            importedLeadId: createdLead.id,
          },
        });

        return createdLead;
      });

      if (lead) {
        imported.push({
          candidateId: candidate.id,
          leadId: lead.id,
          companyName: lead.companyName || companyName,
        });
      } else {
        alreadyImported.push(candidate.id);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: imported.length,
      alreadyImportedCount: alreadyImported.length,
      imported,
      alreadyImported,
      message: imported.length
        ? `Imported ${imported.length} prospect${imported.length === 1 ? "" : "s"} into your CRM.`
        : "No new prospects were imported. The selected prospects may already be imported.",
    });
  } catch (error) {
    console.error("AI Lead Finder import failed:", error);
    return NextResponse.json(
      { error: "The prospects could not be imported. Please try again." },
      { status: 500 },
    );
  }
}
