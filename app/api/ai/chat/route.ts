import { NextRequest } from "next/server"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  checkAiUsage,
} from "@/shared/lib/ai/usage"

import {
  runAiCore,
} from "@/shared/lib/ai/core"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const MAX_PROMPT_LENGTH = 4000
const FEATURE_NAME = "chat"

function jsonError(
  message: string,
  status: number,
): Response {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

function textResponse(
  text: string,
  status = 200,
): Response {
  return new Response(text, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}

function sanitizePrompt(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return ""
  }

  return value
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, MAX_PROMPT_LENGTH)
}

function toNumber(
  value: unknown,
): number | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (value as { toNumber?: unknown }).toNumber === "function"
  ) {
    const numberValue = (
      value as {
        toNumber: () => number
      }
    ).toNumber()

    return Number.isFinite(numberValue)
      ? numberValue
      : null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : null
}

export async function POST(
  request: NextRequest,
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
        "You must be signed in to use the AI assistant.",
        401,
      )
    }

    const email = session.user.email
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
     * 2. LOAD DATABASE USER
     * ------------------------------------------------------------
     *
     * We resolve the user again from the database instead of
     * trusting organization information from the client.
     */

    const dbUser = await prisma.user.findUnique({
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

    if (
      dbUser.status &&
      String(dbUser.status).toLowerCase() !== "active"
    ) {
      return jsonError(
        "Your account is not active.",
        403,
      )
    }

    const orgId = dbUser.orgId?.trim()

    if (!orgId) {
      return jsonError(
        "Your account is not associated with an organization.",
        403,
      )
    }

    /*
     * ------------------------------------------------------------
     * 3. ORGANIZATION AI SETTINGS
     * ------------------------------------------------------------
     */

    const settings =
      await prisma.organizationSettings.findUnique({
        where: {
          orgId,
        },
        select: {
          aiEnabled: true,
          aiDefaultModel: true,
          aiMonthlyCreditLimit: true,
          aiMonthlySpendLimit: true,
          aiRequireApproval: true,
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
     * 4. PARSE REQUEST
     * ------------------------------------------------------------
     */

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return jsonError(
        "Invalid JSON request body.",
        400,
      )
    }

    const prompt = sanitizePrompt(
      typeof body === "object" &&
        body !== null &&
        "prompt" in body
        ? (body as { prompt?: unknown }).prompt
        : undefined,
    )

    if (!prompt) {
      return jsonError(
        "Please provide a prompt.",
        400,
      )
    }

    /*
     * ------------------------------------------------------------
     * 5. CHECK MONTHLY AI USAGE
     * ------------------------------------------------------------
     *
     * Centralized through shared/lib/ai/usage.ts.
     *
     * This checks:
     * - monthly token/credit usage
     * - monthly estimated spend
     * - organization limits
     */

    const usageCheck = await checkAiUsage(
      orgId,
      {
        monthlyCreditLimit:
          settings?.aiMonthlyCreditLimit ?? null,

        monthlySpendLimit:
          toNumber(
            settings?.aiMonthlySpendLimit,
          ),
      },
    )

    if (!usageCheck.allowed) {
      if (
        usageCheck.reason ===
        "credit_limit"
      ) {
        return jsonError(
          "Your organization's monthly AI credit limit has been reached.",
          429,
        )
      }

      if (
        usageCheck.reason ===
        "spend_limit"
      ) {
        return jsonError(
          "Your organization's monthly AI spending limit has been reached.",
          429,
        )
      }

      return jsonError(
        "AI usage is currently unavailable.",
        429,
      )
    }

    /*
     * ------------------------------------------------------------
     * 6. RUN AI
     * ------------------------------------------------------------
     */

    const result = await runAiCore({
      prompt,
      model:
        settings?.aiDefaultModel ||
        undefined,
      orgId,
    })

    /*
     * ------------------------------------------------------------
     * 7. LOG AI REQUEST
     * ------------------------------------------------------------
     *
     * We record the request after a successful AI response.
     *
     * This powers:
     * - usage dashboard
     * - monthly limits
     * - feature reporting
     * - model reporting
     * - cost tracking
     */

    try {
      await prisma.aiLog.create({
        data: {
          orgId,
          userId: dbUser.id,

          prompt,

          response: result.answer,

          tokens:
            result.totalTokens,

          inputTokens:
            result.inputTokens,

          outputTokens:
            result.outputTokens,

          model:
            result.model,

          estimatedCost:
            result.estimatedCost,

          feature:
            FEATURE_NAME,

          metadata: {
            requestId:
              result.requestId ?? null,

            aiRequireApproval:
              settings?.aiRequireApproval ?? true,

            source:
              "crm_assistant",
          },
        },
      })
    } catch (logError) {
      /*
       * The AI request succeeded, but usage logging failed.
       *
       * We deliberately do not expose database details to the
       * client. The error is logged server-side so it can be
       * investigated.
       */

      console.error(
        "[AI] Failed to record AI usage:",
        logError,
      )

      return jsonError(
        "The AI response was generated, but usage could not be recorded. Please try again.",
        500,
      )
    }

    /*
     * ------------------------------------------------------------
     * 8. RETURN AI RESPONSE
     * ------------------------------------------------------------
     *
     * The current client already reads the response body as a
     * stream. A normal text response is still compatible with
     * that implementation.
     */

    return textResponse(
      result.answer,
      200,
    )
  } catch (error) {
    /*
     * ------------------------------------------------------------
     * GLOBAL ERROR HANDLER
     * ------------------------------------------------------------
     */

    console.error(
      "[AI] Chat route error:",
      error,
    )

    return jsonError(
      "The AI Assistant is temporarily unavailable. Please try again.",
      500,
    )
  }
}

export async function GET(): Promise<Response> {
  return jsonError(
    "Method not allowed.",
    405,
  )
}