import { NextRequest } from "next/server"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  formatAiUsage,
  getAiUsageByFeature,
  getAiUsageByModel,
  getOrganizationAiUsage,
} from "@/shared/lib/ai/usage"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function jsonResponse(
  data: unknown,
  status = 200,
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  )
}

function jsonError(
  message: string,
  status: number,
): Response {
  return jsonResponse(
    {
      error: message,
    },
    status,
  )
}

/**
 * GET /api/ai/usage
 *
 * Returns organization-scoped AI usage for the
 * current calendar month.
 *
 * This endpoint is read-only.
 *
 * It returns:
 * - request count
 * - input tokens
 * - output tokens
 * - total tokens
 * - estimated cost
 * - monthly credit limit
 * - remaining credits
 * - monthly spend limit
 * - remaining spend
 * - limit status
 * - usage percentages
 * - usage by feature
 * - usage by model
 */
export async function GET(
  _request: NextRequest,
): Promise<Response> {
  try {
    /*
     * ------------------------------------------------------------
     * 1. AUTHENTICATION
     * ------------------------------------------------------------
     */

    const session = await auth()

    if (!session?.user) {
      return jsonError(
        "You must be signed in to view AI usage.",
        401,
      )
    }

    const email =
      session.user.email
        ?.trim()
        .toLowerCase()

    if (!email) {
      return jsonError(
        "Authenticated user email is unavailable.",
        401,
      )
    }

    /*
     * ------------------------------------------------------------
     * 2. RESOLVE DATABASE USER
     * ------------------------------------------------------------
     *
     * Never accept orgId from the browser.
     *
     * The organization is always resolved from the
     * authenticated database user.
     */

    const dbUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          orgId: true,
          status: true,
        },
      })

    if (!dbUser) {
      return jsonError(
        "User account was not found.",
        404,
      )
    }

    /*
     * ------------------------------------------------------------
     * 3. ACCOUNT STATUS
     * ------------------------------------------------------------
     */

    if (
      dbUser.status &&
      String(dbUser.status).toLowerCase() !==
        "active"
    ) {
      return jsonError(
        "Your account is not active.",
        403,
      )
    }

    /*
     * ------------------------------------------------------------
     * 4. ORGANIZATION
     * ------------------------------------------------------------
     */

    const orgId =
      dbUser.orgId?.trim()

    if (!orgId) {
      return jsonError(
        "Your account is not associated with an organization.",
        403,
      )
    }

    /*
     * ------------------------------------------------------------
     * 5. CHECK AI ACCESS
     * ------------------------------------------------------------
     */

    const settings =
      await prisma.organizationSettings.findUnique({
        where: {
          orgId,
        },
        select: {
          aiEnabled: true,
        },
      })

    const aiEnabled =
      settings?.aiEnabled ?? true

    if (!aiEnabled) {
      return jsonError(
        "AI features are disabled for this organization.",
        403,
      )
    }

    /*
     * ------------------------------------------------------------
     * 6. LOAD USAGE
     * ------------------------------------------------------------
     *
     * getOrganizationAiUsage() automatically:
     * - determines the current month
     * - reads AI logs
     * - calculates tokens
     * - calculates estimated spend
     * - loads configured organization limits
     */

    const usage =
      await getOrganizationAiUsage(
        orgId,
      )

    /*
     * ------------------------------------------------------------
     * 7. LOAD BREAKDOWNS
     * ------------------------------------------------------------
     */

    const [
      byFeature,
      byModel,
    ] = await Promise.all([
      getAiUsageByFeature(orgId),
      getAiUsageByModel(orgId),
    ])

    /*
     * ------------------------------------------------------------
     * 8. RETURN SAFE API RESPONSE
     * ------------------------------------------------------------
     *
     * Dates are converted to ISO strings so the response
     * is safe for browser/client consumption.
     */

    return jsonResponse({
      success: true,

      period: {
        start:
          usage.periodStart.toISOString(),

        end:
          usage.periodEnd.toISOString(),
      },

      usage: {
        requestCount:
          usage.requestCount,

        inputTokens:
          usage.inputTokens,

        outputTokens:
          usage.outputTokens,

        totalTokens:
          usage.totalTokens,

        estimatedCost:
          usage.estimatedCost,

        monthlyCreditLimit:
          usage.monthlyCreditLimit,

        remainingCredits:
          usage.remainingCredits,

        monthlySpendLimit:
          usage.monthlySpendLimit,

        remainingSpend:
          usage.remainingSpend,

        creditsExceeded:
          usage.creditsExceeded,

        spendExceeded:
          usage.spendExceeded,

        limitExceeded:
          usage.limitExceeded,
      },

      status: {
        creditsExceeded:
          usage.creditsExceeded,

        spendExceeded:
          usage.spendExceeded,

        limitExceeded:
          usage.limitExceeded,
      },

      formatted:
        formatAiUsage(usage),

      byFeature,

      byModel,
    })
  } catch (error) {
    /*
     * ------------------------------------------------------------
     * GLOBAL ERROR HANDLER
     * ------------------------------------------------------------
     */

    console.error(
      "[AI Usage] Failed to load AI usage:",
      error,
    )

    return jsonError(
      "Unable to load AI usage right now.",
      500,
    )
  }
}

/**
 * AI usage is currently read-only.
 *
 * Usage cannot be modified through this endpoint.
 */
export async function POST(): Promise<Response> {
  return jsonError(
    "Method not allowed.",
    405,
  )
}

export async function PUT(): Promise<Response> {
  return jsonError(
    "Method not allowed.",
    405,
  )
}

export async function DELETE(): Promise<Response> {
  return jsonError(
    "Method not allowed.",
    405,
  )
}