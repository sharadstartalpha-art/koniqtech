import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"
import {
  sendChatMessage,
} from "@/shared/lib/ai/chat"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type ChatRequest = {
  message?: unknown
  prompt?: unknown
  conversationId?: unknown
  model?: unknown
}

function getSessionContext(
  session: {
    user?: SessionUser | null
  },
) {
  const userId =
    typeof session.user?.id === "string"
      ? session.user.id.trim()
      : ""

  const orgId =
    typeof session.user?.orgId === "string"
      ? session.user.orgId.trim()
      : ""

  return {
    userId,
    orgId,
  }
}

function normalizeMessage(
  value: unknown,
) {
  if (
    typeof value !== "string"
  ) {
    return ""
  }

  return value.trim()
}

function normalizeOptionalString(
  value: unknown,
  maxLength: number,
) {
  if (
    typeof value !== "string"
  ) {
    return undefined
  }

  const normalized =
    value.trim()

  if (!normalized) {
    return undefined
  }

  return normalized.slice(
    0,
    maxLength,
  )
}

/**
 * POST /api/ai/chat
 *
 * Main conversational AI endpoint.
 *
 * Body:
 *
 * {
 *   "message": "How many open leads do we have?"
 * }
 *
 * Optional:
 *
 * {
 *   "message": "...",
 *   "conversationId": "...",
 *   "model": "gpt-5.6-luna"
 * }
 *
 * Security:
 * - Authentication is required.
 * - orgId always comes from the session.
 * - Conversation ownership is enforced
 *   by the chat service.
 */
export async function POST(
  request: Request,
) {
  const requestId =
    crypto.randomUUID()

  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          requestId,
        },
        {
          status: 401,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    const {
      userId,
      orgId,
    } = getSessionContext(
      session,
    )

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          requestId,
        },
        {
          status: 401,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
          requestId,
        },
        {
          status: 403,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    /**
     * Parse JSON body safely.
     */
    let body: ChatRequest

    try {
      const parsed =
        await request.json()

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Request body must be a JSON object.",
            requestId,
          },
          {
            status: 400,
            headers: {
              "X-Request-Id":
                requestId,
            },
          },
        )
      }

      body =
        parsed as ChatRequest
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
          requestId,
        },
        {
          status: 400,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    /**
     * Support both "message" and the older
     * "prompt" property.
     */
    const message =
      normalizeMessage(
        body.message,
      ) ||
      normalizeMessage(
        body.prompt,
      )

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "message is required.",
          requestId,
        },
        {
          status: 400,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    /**
     * Keep the API request bounded.
     *
     * The core AI layer has its own limit too,
     * but validating at the HTTP boundary prevents
     * unnecessarily large requests from reaching
     * the service.
     */
    if (
      message.length >
      4000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message cannot exceed 4000 characters.",
          requestId,
        },
        {
          status: 413,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    const conversationId =
      normalizeOptionalString(
        body.conversationId,
        200,
      )

    const model =
      normalizeOptionalString(
        body.model,
        100,
      )

    /**
     * If a conversation ID is supplied, verify
     * it belongs to the current organization and
     * authenticated user before calling the AI
     * service.
     *
     * This gives us an early authorization check
     * at the API boundary in addition to the
     * service-layer check.
     */
    if (conversationId) {
      const conversation =
        await prisma.aiConversation.findFirst(
          {
            where: {
              id:
                conversationId,
              orgId,
              userId,
            },

            select: {
              id: true,
              status: true,
              model: true,
            },
          },
        )

      if (!conversation) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Conversation not found.",
            requestId,
          },
          {
            status: 404,
            headers: {
              "X-Request-Id":
                requestId,
            },
          },
        )
      }

      if (
        conversation.status ===
        "archived"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Archived conversations cannot receive new messages.",
            requestId,
          },
          {
            status: 409,
            headers: {
              "X-Request-Id":
                requestId,
            },
          },
        )
      }
    }

    /**
     * Send the message through the service layer.
     *
     * The service is responsible for:
     * - conversation creation
     * - CRM context
     * - OpenAI request
     * - message persistence
     * - usage information
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
     * Fetch the conversation again so the API
     * response contains the canonical persisted
     * message history.
     *
     * We intentionally don't assume that
     * sendChatMessage exposes messages/usage
     * directly on its return type.
     */
    const conversation =
      await prisma.aiConversation.findFirst(
        {
          where: {
            id:
              result.conversation.id,
            orgId,
            userId,
          },

          select: {
            id: true,
            orgId: true,
            userId: true,
            title: true,
            status: true,
            model: true,
            createdAt: true,
            updatedAt: true,

            messages: {
              orderBy: {
                createdAt:
                  "asc",
              },

              take: 100,

              select: {
                id: true,
                conversationId:
                  true,
                role: true,
                content: true,
                model: true,
                inputTokens:
                  true,
                outputTokens:
                  true,
                totalTokens:
                  true,
                metadata: true,
                createdAt: true,
              },
            },
          },
        },
      )

    if (!conversation) {
      /**
       * This should never happen because the
       * service just created/updated this
       * conversation. Keep the defensive check
       * so the API never returns incomplete data.
       */
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation could not be loaded after processing.",
          requestId,
        },
        {
          status: 500,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    return NextResponse.json(
      {
        success: true,

        answer:
          result.answer,

        text:
          result.answer,

        conversation,

        conversationId:
          conversation.id,

        messages:
          conversation.messages,

        requestId:
          "requestId" in result &&
          typeof result.requestId ===
            "string"
            ? result.requestId
            : requestId,
      },
      {
        status: 200,
        headers: {
          "X-Request-Id":
            requestId,
        },
      },
    )
  } catch (error) {
    console.error(
      "[AI_CHAT_POST]",
      {
        requestId,
        error,
      },
    )

    /**
     * Don't expose raw OpenAI, Prisma, or
     * internal server errors to the browser.
     */
    const message =
      error instanceof Error
        ? error.message
        : ""

    const normalizedError =
      message.toLowerCase()

    /**
     * Translate common service-level
     * conditions into useful HTTP responses.
     */
    if (
      normalizedError.includes(
        "archived",
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Archived conversations cannot receive new messages.",
          requestId,
        },
        {
          status: 409,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    if (
      normalizedError.includes(
        "openai_api_key",
      ) ||
      normalizedError.includes(
        "api key",
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI service configuration is unavailable.",
          requestId,
        },
        {
          status: 503,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process AI chat request.",
        requestId,
      },
      {
        status: 500,
        headers: {
          "X-Request-Id":
            requestId,
        },
      },
    )
  }
}

/**
 * GET /api/ai/chat
 *
 * Lightweight health/availability endpoint.
 *
 * Does not make an OpenAI request.
 */
export async function GET() {
  const requestId =
    crypto.randomUUID()

  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          error: "Unauthorized",
          requestId,
        },
        {
          status: 401,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    const {
      orgId,
    } = getSessionContext(
      session,
    )

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          error:
            "Organization context is required.",
          requestId,
        },
        {
          status: 403,
          headers: {
            "X-Request-Id":
              requestId,
          },
        },
      )
    }

    const settings =
      await prisma.organizationSettings.findFirst(
        {
          where: {
            orgId,
          },

          select: {
            aiEnabled: true,
            aiDefaultModel:
              true,
          },
        },
      )

    const available =
      settings?.aiEnabled ??
      true

    return NextResponse.json(
      {
        success: true,
        available,

        model:
          settings?.aiDefaultModel ??
          process.env.OPENAI_MODEL ??
          "gpt-5.6-luna",

        requestId,
      },
      {
        status: 200,
        headers: {
          "X-Request-Id":
            requestId,
        },
      },
    )
  } catch (error) {
    console.error(
      "[AI_CHAT_GET]",
      {
        requestId,
        error,
      },
    )

    return NextResponse.json(
      {
        success: false,
        available: false,
        error:
          "Unable to check AI availability.",
        requestId,
      },
      {
        status: 500,
        headers: {
          "X-Request-Id":
            requestId,
        },
      },
    )
  }
}