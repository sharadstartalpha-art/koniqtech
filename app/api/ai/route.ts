import { NextResponse } from "next/server"

import { auth } from "@/auth"

import {
  sendChatMessage,
} from "@/shared/lib/ai/chat"

import {
  getDefaultAiModel,
} from "@/shared/lib/ai/core"

const MAX_MESSAGE_LENGTH = 4000

type ChatRequestBody = {
  message?: unknown
  prompt?: unknown
  conversationId?: unknown
  model?: unknown
}

function getString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : ""
}

function errorResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
    },
  )
}

/**
 * POST /api/ai
 *
 * Production AI chat endpoint.
 *
 * Responsibilities:
 * - authenticate the current user
 * - obtain organization from the authenticated session
 * - validate the request
 * - send the message through chat.ts
 * - return the persisted conversation/message result
 *
 * AI execution itself belongs to:
 *
 * shared/lib/ai/chat.ts
 * shared/lib/ai/core.ts
 */
export async function POST(
  request: Request,
) {
  try {
    const session =
      await auth()

    /**
     * Authentication
     */
    if (!session?.user?.id) {
      return errorResponse(
        "Unauthorized.",
        401,
      )
    }

    /**
     * The AI API must never accept an arbitrary
     * userId from the browser.
     *
     * The authenticated session is the source
     * of truth for the current user.
     */
    const userId =
      session.user.id

    /**
     * Organization must also come from the
     * authenticated application context.
     *
     * KoniqTech sessions may expose orgId
     * directly depending on the Auth.js setup.
     */
    const orgId =
      typeof session.user.orgId ===
      "string"
        ? session.user.orgId.trim()
        : ""

    if (!orgId) {
      return errorResponse(
        "No organization is associated with the current session.",
        403,
      )
    }

    /**
     * Parse request body safely.
     */
    let body: ChatRequestBody

    try {
      body =
        (await request.json()) as ChatRequestBody
    } catch {
      return errorResponse(
        "Invalid JSON request body.",
        400,
      )
    }

    /**
     * Support both:
     *
     * {
     *   message: "..."
     * }
     *
     * and the older:
     *
     * {
     *   prompt: "..."
     * }
     *
     * This helps keep the route backward-compatible
     * with the existing AI UI.
     */
    const message =
      getString(body.message) ||
      getString(body.prompt)

    if (!message) {
      return errorResponse(
        "Message is required.",
        400,
      )
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
      return errorResponse(
        `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
        400,
      )
    }

    /**
     * Conversation ID is optional.
     *
     * No conversation ID:
     *   chat.ts creates a new conversation.
     *
     * Existing conversation ID:
     *   chat.ts verifies organization + user
     *   ownership before loading it.
     */
    const conversationId =
      getString(
        body.conversationId,
      ) || null

    /**
     * Model is optional.
     *
     * The actual default is resolved inside
     * core.ts so there is only one source of
     * truth for the production default model.
     */
    const requestedModel =
      getString(body.model)

    const model =
      requestedModel ||
      getDefaultAiModel()

    /**
     * Run the complete chat pipeline.
     */
    const result =
      await sendChatMessage({
        orgId,
        userId,
        message,
        conversationId,
        model,
      })

    /**
     * Return a stable API shape.
     *
     * `answer` is retained for simple existing
     * clients.
     *
     * `assistantMessage` and `conversation`
     * support the production chat UI/history.
     */
    return NextResponse.json(
      {
        success: true,

        answer:
          result.answer,

        text:
          result.answer,

        conversation:
          result.conversation,

        userMessage:
          result.userMessage,

        assistantMessage:
          result.assistantMessage,

        model:
          result.model,

        usage: {
          inputTokens:
            result.inputTokens,

          outputTokens:
            result.outputTokens,

          totalTokens:
            result.totalTokens,

          estimatedCost:
            result.estimatedCost,
        },

        requestId:
          result.requestId,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.error(
      "[KoniqTech AI API] Request failed:",
      error,
    )

    if (
      error instanceof Error
    ) {
      const message =
        error.message

      /**
       * Do not expose internal stack traces
       * or implementation details to the browser.
       */
      if (
        message ===
          "AI conversation not found." ||
        message ===
          "AI conversation is not active."
      ) {
        return errorResponse(
          message,
          404,
        )
      }

      if (
        message ===
          "Cannot add messages to an archived conversation."
      ) {
        return errorResponse(
          message,
          409,
        )
      }

      if (
        message ===
          "Organization ID is required." ||
        message ===
          "User ID is required."
      ) {
        return errorResponse(
          "AI request context is incomplete.",
          400,
        )
      }

      if (
        message.includes(
          "OPENAI_API_KEY is not configured",
        )
      ) {
        return errorResponse(
          "AI service is not configured.",
          503,
        )
      }

      return errorResponse(
        message,
        500,
      )
    }

    return errorResponse(
      "Unable to process the AI request.",
      500,
    )
  }
}

/**
 * Health/configuration check.
 *
 * GET /api/ai
 *
 * Does NOT perform an OpenAI request.
 */
export async function GET() {
  try {
    const session =
      await auth()

    if (!session?.user?.id) {
      return errorResponse(
        "Unauthorized.",
        401,
      )
    }

    const orgId =
      typeof session.user.orgId ===
      "string"
        ? session.user.orgId.trim()
        : ""

    if (!orgId) {
      return errorResponse(
        "No organization is associated with the current session.",
        403,
      )
    }

    return NextResponse.json(
      {
        success: true,
        enabled: true,
        model:
          getDefaultAiModel(),
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.error(
      "[KoniqTech AI API] Health check failed:",
      error,
    )

    return errorResponse(
      "AI service unavailable.",
      503,
    )
  }
}