import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOOGLE_SEARCH_ENDPOINT = "https://www.googleapis.com/customsearch/v1";
const MAX_LIMIT = 10; // Google Custom Search JSON API returns at most 10 results per request.

type SessionUser = {
  id?: string;
  orgId?: string;
  email?: string | null;
};

type GoogleSearchItem = {
  title?: string;
  link?: string;
  snippet?: string;
  displayLink?: string;
  pagemap?: {
    metatags?: Array<Record<string, string | undefined>>;
    localbusiness?: Array<Record<string, string | undefined>>;
  };
};

type GoogleSearchResponse = {
  items?: GoogleSearchItem[];
  error?: { message?: string };
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function safeWebsite(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return null;
  }
}

function getBusinessPhone(item: GoogleSearchItem): string | null {
  const localBusiness = item.pagemap?.localbusiness?.[0];
  const metadata = item.pagemap?.metatags?.[0];
  return (
    localBusiness?.telephone ||
    localBusiness?.phone ||
    metadata?.["telephone"] ||
    metadata?.["og:phone_number"] ||
    null
  );
}

async function getAuthenticatedUser() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id || !user.orgId) {
    return null;
  }

  return {
    id: user.id,
    orgId: user.orgId,
  };
}
export async function GET() {
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
  let searchId: string | undefined;

  try {
    const user = await getAuthenticatedUser();
    if (!user) return jsonError("Please sign in to use AI Lead Finder.", 401);

    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_CSE_ID;
    if (!apiKey || !searchEngineId) {
      return jsonError(
        "Google search is not configured. Set GOOGLE_API_KEY and GOOGLE_CSE_ID in the server environment.",
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

    if (!body || typeof body !== "object") return jsonError("Invalid request body.", 400);

    const industry = typeof body.industry === "string" ? body.industry.trim().slice(0, 80) : "";
    const city = typeof body.city === "string" ? body.city.trim().slice(0, 100) : "";
    const state = typeof body.state === "string" ? body.state.trim().slice(0, 100) : "";
    const country = typeof body.country === "string" ? body.country.trim().slice(0, 100) : "USA";
    const keywords = typeof body.keywords === "string" ? body.keywords.trim().slice(0, 160) : "";
    const requested = Number(body.limit);
    const limit = Number.isFinite(requested) ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(requested))) : 10;

    if (!industry) return jsonError("Choose an industry before searching.", 400);
    if (!city) return jsonError("Enter a city before searching.", 400);

    const queryParts = [industry, "business", city, state, country, keywords].filter(Boolean);
    const query = queryParts.join(" ").replace(/\s+/g, " ").slice(0, 500);

    // Only accept a location belonging to this user's organization when one is selected by the UI.
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
        provider: "google_custom_search",
        status: "running",
        requestedCount: limit,
        filters: { keywords, limit },
        startedAt: new Date(),
      },
      select: { id: true },
    });
    searchId = search.id;

    const googleUrl = new URL(GOOGLE_SEARCH_ENDPOINT);
    googleUrl.searchParams.set("key", apiKey);
    googleUrl.searchParams.set("cx", searchEngineId);
    googleUrl.searchParams.set("q", query);
    googleUrl.searchParams.set("num", String(limit));

    const googleResponse = await fetch(googleUrl.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const googleData = (await googleResponse.json().catch(() => ({}))) as GoogleSearchResponse;
    if (!googleResponse.ok) {
      const googleMessage = googleData.error?.message;
      const detail = googleResponse.status === 403
        ? "Google rejected the request. Check API access, billing/quota, and Custom Search API availability for your account."
        : googleResponse.status === 400
          ? "Google rejected the search configuration. Check GOOGLE_CSE_ID and your search settings."
          : "The search provider could not complete the request.";
      await prisma.aiLeadSearch.update({
        where: { id: search.id },
        data: {
          status: "failed",
          error: (googleMessage || detail).slice(0, 1000),
          completedAt: new Date(),
        },
      });
      return jsonError(detail, 502);
    }

    const items = (googleData.items ?? []).slice(0, limit);
    const results: Array<{
      id: string;
      businessName: string;
      website: string | null;
      businessPhone: string | null;
      industry: string;
      address: string | null;
      city: string;
      state: string | null;
      country: string;
      sourceUrl: string | null;
      status: string;
      matchScore: number | null;
    }> = [];

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const sourceUrl = item.link ?? null;
      if (!sourceUrl) continue;
      const businessName = (item.title || item.displayLink || "Untitled business").slice(0, 240);
      // Stable ID per canonical result URL. The unique constraint also prevents duplicate candidates per org.
      const externalId = sourceUrl.slice(0, 500);
      const website = safeWebsite(sourceUrl);
      const snippet = (item.snippet || "").slice(0, 1000);
      const businessPhone = getBusinessPhone(item);

      const candidate = await prisma.aiLeadCandidate.upsert({
        where: {
          orgId_source_externalId: {
            orgId: user.orgId,
            source: "google_custom_search",
            externalId,
          },
        },
        create: {
          orgId: user.orgId,
          source: "google_custom_search",
          externalId,
          businessName,
          website,
          businessPhone,
          industry,
          address: null,
          city,
          state: state || null,
          country: country || "USA",
          sourceUrl,
          lastVerifiedAt: new Date(),
          matchReasons: { snippet },
          status: "discovered",
        },
        update: {
          businessName,
          website,
          businessPhone,
          industry,
          address: null,
          city,
          state: state || null,
          country: country || "USA",
          sourceUrl,
          lastVerifiedAt: new Date(),
          matchReasons: { snippet },
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
          matchReasons: { snippet },
        },
        update: { rank: index + 1, matchScore: candidate.matchScore, matchReasons: { snippet } },
      });

     results.push({
  id: candidate.id,
  businessName: candidate.businessName,
  website: candidate.website,
  businessPhone: candidate.businessPhone,
  industry: candidate.industry ?? industry,
  address: candidate.address ?? "",
  city: candidate.city ?? "",
  state: candidate.state ?? "",
  country: candidate.country ?? "",
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

    return NextResponse.json({ searchId: search.id, results, searches: await getRecentSearches(user.orgId, user.id) });
  } catch (error) {
    console.error("AI Lead Finder search error:", error);
    if (searchId) {
      try {
        await prisma.aiLeadSearch.update({
          where: { id: searchId },
          data: {
            status: "failed",
            error: (error instanceof Error ? error.message : "Unknown search error").slice(0, 1000),
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

async function getRecentSearches(orgId: string, userId: string) {
  return prisma.aiLeadSearch.findMany({
    where: { orgId, userId },
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
