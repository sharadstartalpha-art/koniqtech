import { NextRequest, NextResponse } from "next/server";
import { requirePlatformSuperAdmin } from "@/shared/lib/require-platform-super-admin";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLACES_SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const MAX_LIMIT = 10;
const SOURCE = "google_places";

type SessionUser = {
  id?: string;
  orgId?: string;
  email?: string | null;
};

type PlacesItem = {
  id?: string;
  displayName?: { text?: string; languageCode?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
};

type PlacesResponse = {
  places?: PlacesItem[];
  error?: { message?: string; status?: string; code?: number };
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function safeWebsite(url?: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  } catch {
    return null;
  }
}

async function getAuthenticatedUser() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id || !user.orgId) return null;

  return { id: user.id, orgId: user.orgId };
}


export async function GET() {

  const access = await requirePlatformSuperAdmin();

  if (access.response) {
    return access.response;
  }

  const user = access.user;

  try {
    const user = await getAuthenticatedUser();
    if (!user) return jsonError("Please sign in to use AI Lead Finder.", 401);

    const searches = await prisma.aiLeadSearch.findMany({
      where: { orgId: user.orgId, userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        query: true,
        industry: true,
        city: true,
        state: true,
        country: true,
        status: true,
        resultCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ searches });
  } catch (error) {
    console.error("AI Lead Finder history error:", error);
    return jsonError("Could not load search history.", 500);
  }
}


export async function POST(request: NextRequest) {
  const access = await requirePlatformSuperAdmin();

  if (access.response) {
    return access.response;
  }

  const user = access.user;
  let searchId: string | undefined;

  try {
    const user = await getAuthenticatedUser();
    if (!user) return jsonError("Please sign in to use AI Lead Finder.", 401);

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return jsonError(
        "Google Places is not configured. Set GOOGLE_API_KEY in the server environment.",
        503,
      );
    }

    const body = (await request.json().catch(() => null)) as {
      industry?: unknown;
      city?: unknown;
      state?: unknown;
      country?: unknown;
      keywords?: unknown;
      limit?: unknown;
    } | null;

    if (!body || typeof body !== "object") {
      return jsonError("Invalid request body.", 400);
    }

    const industry =
      typeof body.industry === "string" ? body.industry.trim().slice(0, 80) : "";
    const city = typeof body.city === "string" ? body.city.trim().slice(0, 100) : "";
    const state =
      typeof body.state === "string" ? body.state.trim().slice(0, 100) : "";
    const country =
      typeof body.country === "string" ? body.country.trim().slice(0, 100) : "USA";
    const keywords =
      typeof body.keywords === "string" ? body.keywords.trim().slice(0, 160) : "";
    const requested = Number(body.limit);
    const limit = Number.isFinite(requested)
      ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(requested)))
      : MAX_LIMIT;

    if (!industry) return jsonError("Choose an industry before searching.", 400);
    if (!city) return jsonError("Enter a city before searching.", 400);

    const query = [industry, "businesses", city, state, country, keywords]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .slice(0, 500);

    const defaultLocation = await prisma.organizationLocation.findFirst({
      where: { orgId: user.orgId, active: true, isDefault: true },
      select: { id: true },
    });

    const search = await prisma.aiLeadSearch.create({
      data: {
        orgId: user.orgId,
        userId: user.id,
        locationId: defaultLocation?.id ?? null,
        query,
        industry,
        city,
        state: state || null,
        country: country || "USA",
        provider: SOURCE,
        status: "running",
        requestedCount: limit,
        filters: { keywords, limit },
        startedAt: new Date(),
      },
      select: { id: true },
    });
    searchId = search.id;

    const placesResponse = await fetch(PLACES_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri",
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: limit,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    const placesData = (await placesResponse.json().catch(() => ({}))) as PlacesResponse;

    if (!placesResponse.ok) {
      const googleMessage = placesData.error?.message;
      console.error("Google Places API error:", {
        status: placesResponse.status,
        code: placesData.error?.code,
        reason: placesData.error?.status,
        message: googleMessage,
      });

      const detail =
        placesResponse.status === 400
          ? "Google Places rejected the search request. Check the search parameters and API configuration."
          : placesResponse.status === 401 || placesResponse.status === 403
            ? "Google Places denied the request. Check that Places API (New) is enabled, the API key permits it, and billing is active."
            : placesResponse.status === 429
              ? "Google Places quota or rate limit reached. Please wait and try again."
              : "Google Places could not complete the request.";

      await prisma.aiLeadSearch.update({
        where: { id: search.id },
        data: {
          status: "failed",
          error: (googleMessage || detail).slice(0, 1000),
          completedAt: new Date(),
        },
      });

      return jsonError(detail, placesResponse.status === 429 ? 429 : 502);
    }

    const places = (placesData.places ?? []).slice(0, limit);
    const results: Array<{
      id: string;
      businessName: string;
      website: string | null;
      businessPhone: string | null;
      industry: string;
      address: string;
      city: string;
      state: string;
      country: string;
      sourceUrl: string | null;
      status: string;
      matchScore: number | null;
    }> = [];

    for (let index = 0; index < places.length; index += 1) {
      const place = places[index];
      if (!place.id) continue;

      const businessName = (place.displayName?.text || "Unnamed business").slice(0, 240);
      const address = (place.formattedAddress || "").slice(0, 500);
      const website = safeWebsite(place.websiteUri ?? undefined);
      const businessPhone = place.nationalPhoneNumber?.slice(0, 80) ?? null;
      const sourceUrl = place.googleMapsUri ?? place.websiteUri ?? null;
      const externalId = place.id.slice(0, 500);
      const matchReasons = {
        provider: SOURCE,
        formattedAddress: address || null,
        googleMapsUri: place.googleMapsUri ?? null,
      };

      const candidate = await prisma.aiLeadCandidate.upsert({
        where: {
          orgId_source_externalId: {
            orgId: user.orgId,
            source: SOURCE,
            externalId,
          },
        },
        create: {
          orgId: user.orgId,
          source: SOURCE,
          externalId,
          businessName,
          website,
          businessPhone,
          industry,
          address: address || null,
          city,
          state: state || null,
          country: country || "USA",
          sourceUrl,
          lastVerifiedAt: new Date(),
          matchReasons,
          status: "discovered",
        },
        update: {
          businessName,
          website,
          businessPhone,
          industry,
          address: address || null,
          city,
          state: state || null,
          country: country || "USA",
          sourceUrl,
          lastVerifiedAt: new Date(),
          matchReasons,
        },
        select: {
          id: true,
          businessName: true,
          website: true,
          businessPhone: true,
          industry: true,
          address: true,
          city: true,
          state: true,
          country: true,
          sourceUrl: true,
          status: true,
          matchScore: true,
        },
      });

      await prisma.aiLeadSearchResult.upsert({
        where: {
          searchId_candidateId: { searchId: search.id, candidateId: candidate.id },
        },
        create: {
          searchId: search.id,
          candidateId: candidate.id,
          rank: index + 1,
          matchScore: candidate.matchScore,
          matchReasons,
        },
        update: {
          rank: index + 1,
          matchScore: candidate.matchScore,
          matchReasons,
        },
      });

      results.push({
        id: candidate.id,
        businessName: candidate.businessName,
        website: candidate.website,
        businessPhone: candidate.businessPhone,
        industry: candidate.industry ?? industry,
        address: candidate.address ?? "",
        city: candidate.city ?? city,
        state: candidate.state ?? state,
        country: candidate.country ?? country,
        sourceUrl: candidate.sourceUrl,
        status: candidate.status,
        matchScore: candidate.matchScore,
      });
    }

    await prisma.aiLeadSearch.update({
      where: { id: search.id },
      data: {
        status: "completed",
        resultCount: results.length,
        completedAt: new Date(),
        error: null,
      },
    });

    return NextResponse.json({
      searchId: search.id,
      results,
     searches: await getRecentSearches(user.orgId),
    });
  } catch (error) {
    console.error("AI Lead Finder Places search error:", error);

    if (searchId) {
      try {
        await prisma.aiLeadSearch.update({
          where: { id: searchId },
          data: {
            status: "failed",
            error: (error instanceof Error ? error.message : "Unknown search error").slice(
              0,
              1000,
            ),
            completedAt: new Date(),
          },
        });
      } catch (updateError) {
        console.error("Could not update failed lead search:", updateError);
      }
    }

    if (error instanceof Error && error.name === "TimeoutError") {
      return jsonError("The business search timed out. Please try again.", 504);
    }

    return jsonError("The business search failed. Check the server logs for details.", 500);
  }
}

async function getRecentSearches(orgId: string) {
  return prisma.aiLeadSearch.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      query: true,
      industry: true,
      city: true,
      state: true,
      country: true,
      status: true,
      resultCount: true,
      createdAt: true,
    },
  });
}