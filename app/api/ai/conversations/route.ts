import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type ConversationStatus =
  | "active"
  | "archived"

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

function normalizeLimit(
  value: string | null,
) {
  const parsed =
    Number.parseInt(
      value ?? "50",
      10,
    )

  if (!Number.isFinite(parsed)) {
    return 50
  }

  return Math.min(
    Math.max(parsed, 1),
    100,
  )
}

function normalizeStatus(
  value: string | null,
): ConversationStatus | undefined {
  if (
    value === "active" ||
    value === "archived"
  ) {
    return value
  }

  return undefined
}

function normalizeTitle(
  value: unknown,
): string | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined
  }

  const title =
    value.trim()

  if (!title) {
    return undefined
  }

  return title.slice(
    0,
    200,
  )
}

function normalizeModel(
  value: unknown,
): string | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined
  }

  const model =
    value.trim()

  if (!model) {
    return undefined
  }

  return model.slice(
    0,
    100,
  )
}

/**
 * GET /api/ai/conversations
 *
 * Lists conversations belonging to the
 * authenticated user and organization.
 *
 * Supported query parameters:
 *
 *   ?status=active
 *   ?status=archived
 *   ?limit=50
 *
 * GET /api/ai/conversations?id=...
 *
 * Returns one conversation including its
 * recent messages.
 */
export async function GET(
  request: Request,
) {
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
        },
        {
          status: 401,
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
        },
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    const {
      searchParams,
    } = new URL(
      request.url,
    )

    const conversationId =
      searchParams
        .get("id")
        ?.trim() || ""

    const status =
      normalizeStatus(
        searchParams.get(
          "status",
        ),
      )

    const limit =
      normalizeLimit(
        searchParams.get(
          "limit",
        ),
      )

    /**
     * Single conversation.
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
              orgId: true,
              userId: true,
              title: true,
              status: true,
              model: true,
              context: true,
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
        return NextResponse.json(
          {
            success: false,
            error:
              "Conversation not found.",
          },
          {
            status: 404,
          },
        )
      }

      return NextResponse.json(
        {
          success: true,
          conversation,
        },
      )
    }

    /**
     * Conversation list.
     *
     * Default status is active so archived
     * conversations don't unexpectedly appear
     * in the normal chat sidebar.
     */
    const conversations =
      await prisma.aiConversation.findMany(
        {
          where: {
            orgId,
            userId,

            ...(status
              ? {
                  status:
                    status as any,
                }
              : {
                  status:
                    "active" as any,
                }),
          },

          orderBy: [
            {
              updatedAt:
                "desc",
            },
            {
              createdAt:
                "desc",
            },
          ],

          take: limit,

          select: {
            id: true,
            orgId: true,
            userId: true,
            title: true,
            status: true,
            model: true,
            createdAt: true,
            updatedAt: true,

            _count: {
              select: {
                messages: true,
              },
            },
          },
        },
      )

    return NextResponse.json(
      {
        success: true,

        conversations:
          conversations.map(
            (conversation) => ({
              ...conversation,
              messageCount:
                conversation
                  ._count
                  .messages,
              _count:
                undefined,
            }),
          ),

        count:
          conversations.length,

        limit,
        status:
          status ?? "active",
      },
    )
  } catch (error) {
    console.error(
      "[AI_CONVERSATIONS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI conversations.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * POST /api/ai/conversations
 *
 * Creates a new conversation.
 *
 * Body:
 * {
 *   "title": "Customer follow-up",
 *   "model": "gpt-5.6-luna",
 *   "context": {}
 * }
 */
export async function POST(
  request: Request,
) {
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
        },
        {
          status: 401,
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
        },
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    let body: Record<
      string,
      unknown
    >

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
          },
          {
            status: 400,
          },
        )
      }

      body =
        parsed as Record<
          string,
          unknown
        >
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      )
    }

    const title =
      normalizeTitle(
        body.title,
      )

    const model =
      normalizeModel(
        body.model,
      )

    /**
     * Context is optional. We deliberately
     * keep validation conservative because
     * Prisma JSON fields accept structured
     * JSON values.
     */
    const context =
      body.context !== undefined
        ? body.context
        : undefined

    if (
      context !== undefined &&
      (typeof context === "function" ||
        typeof context === "symbol" ||
        typeof context === "bigint")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid conversation context.",
        },
        {
          status: 400,
        },
      )
    }

    const conversation =
      await prisma.aiConversation.create(
        {
          data: {
            orgId,
            userId,
            ...(title
              ? {
                  title,
                }
              : {}),
            ...(model
              ? {
                  model,
                }
              : {}),
            ...(context !== undefined
              ? {
                  context:
                    context as any,
                }
              : {}),
          },

          select: {
            id: true,
            orgId: true,
            userId: true,
            title: true,
            status: true,
            model: true,
            context: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      )

    return NextResponse.json(
      {
        success: true,
        conversation,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error(
      "[AI_CONVERSATIONS_POST]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create AI conversation.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH /api/ai/conversations
 *
 * Rename, archive, restore, or change model.
 *
 * Body:
 * {
 *   "conversationId": "...",
 *   "title": "...",
 *   "status": "archived",
 *   "model": "gpt-5.6-luna"
 * }
 */
export async function PATCH(
  request: Request,
) {
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
        },
        {
          status: 401,
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
        },
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    let body: Record<
      string,
      unknown
    >

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
          },
          {
            status: 400,
          },
        )
      }

      body =
        parsed as Record<
          string,
          unknown
        >
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      )
    }

    const conversationId =
      typeof body.conversationId ===
      "string"
        ? body.conversationId.trim()
        : ""

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "conversationId is required.",
        },
        {
          status: 400,
        },
      )
    }

    const existing =
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
          },
        },
      )

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation not found.",
        },
        {
          status: 404,
        },
      )
    }

    const hasTitle =
      Object.prototype.hasOwnProperty.call(
        body,
        "title",
      )

    const hasStatus =
      Object.prototype.hasOwnProperty.call(
        body,
        "status",
      )

    const hasModel =
      Object.prototype.hasOwnProperty.call(
        body,
        "model",
      )

    if (
      !hasTitle &&
      !hasStatus &&
      !hasModel
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one of title, status, or model is required.",
        },
        {
          status: 400,
        },
      )
    }

    const data: {
      title?: string | null
      status?: any
      model?: string | null
    } = {}

    if (hasTitle) {
      const title =
        normalizeTitle(
          body.title,
        )

      /**
       * Empty title intentionally clears
       * the custom title.
       */
      data.title =
        title ?? null
    }

    if (hasStatus) {
      const nextStatus =
        normalizeStatus(
          typeof body.status ===
            "string"
            ? body.status
            : null,
        )

      if (!nextStatus) {
        return NextResponse.json(
          {
            success: false,
            error:
              "status must be active or archived.",
          },
          {
            status: 400,
          },
        )
      }

      data.status =
        nextStatus
    }

    if (hasModel) {
      const nextModel =
        normalizeModel(
          body.model,
        )

      /**
       * Empty model clears the explicit model
       * and allows the AI service to use its
       * configured default.
       */
      data.model =
        nextModel ?? null
    }

    const conversation =
      await prisma.aiConversation.update(
        {
          where: {
            id:
              conversationId,
          },

          data,

          select: {
            id: true,
            orgId: true,
            userId: true,
            title: true,
            status: true,
            model: true,
            context: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      )

    return NextResponse.json(
      {
        success: true,
        conversation,
      },
    )
  } catch (error) {
    console.error(
      "[AI_CONVERSATIONS_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI conversation.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * DELETE /api/ai/conversations
 *
 * Permanently deletes a conversation and
 * its messages through the database cascade.
 *
 * Body:
 * {
 *   "conversationId": "..."
 * }
 */
export async function DELETE(
  request: Request,
) {
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
        },
        {
          status: 401,
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
        },
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    let body: Record<
      string,
      unknown
    >

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
          },
          {
            status: 400,
          },
        )
      }

      body =
        parsed as Record<
          string,
          unknown
        >
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      )
    }

    const conversationId =
      typeof body.conversationId ===
      "string"
        ? body.conversationId.trim()
        : ""

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "conversationId is required.",
        },
        {
          status: 400,
        },
      )
    }

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
          },
        },
      )

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation not found.",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.aiConversation.delete(
      {
        where: {
          id:
            conversation.id,
        },
      },
    )

    return NextResponse.json(
      {
        success: true,
        deleted: true,
        conversationId:
          conversation.id,
      },
    )
  } catch (error) {
    console.error(
      "[AI_CONVERSATIONS_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete AI conversation.",
      },
      {
        status: 500,
      },
    )
  }
}