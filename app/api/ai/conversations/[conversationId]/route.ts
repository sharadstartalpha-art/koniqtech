import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type RouteContext = {
  params: Promise<{
    conversationId: string
  }>
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

function getConversationId(
  params: {
    conversationId: string
  },
) {
  return params.conversationId.trim()
}

/**
 * GET
 *
 * GET /api/ai/conversations/:conversationId
 *
 * Returns one conversation and its messages.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
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

    const params =
      await context.params

    const conversationId =
      getConversationId(
        params,
      )

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation ID is required.",
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

              take: 200,

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
  } catch (error) {
    console.error(
      "[AI_CONVERSATION_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI conversation.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH
 *
 * PATCH /api/ai/conversations/:conversationId
 *
 * Supported:
 *
 * {
 *   "title": "New title"
 * }
 *
 * {
 *   "status": "archived"
 * }
 *
 * {
 *   "status": "active"
 * }
 *
 * {
 *   "model": "gpt-5.6-luna"
 * }
 */
export async function PATCH(
  request: Request,
  context: RouteContext,
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

    const params =
      await context.params

    const conversationId =
      getConversationId(
        params,
      )

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation ID is required.",
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
      if (
        body.title === null
      ) {
        data.title = null
      } else if (
        typeof body.title ===
        "string"
      ) {
        const title =
          body.title.trim()

        if (
          title.length >
          200
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Conversation title cannot exceed 200 characters.",
            },
            {
              status: 400,
            },
          )
        }

        data.title =
          title || null
      } else {
        return NextResponse.json(
          {
            success: false,
            error:
              "title must be a string or null.",
          },
          {
            status: 400,
          },
        )
      }
    }

    if (hasStatus) {
      if (
        body.status !==
          "active" &&
        body.status !==
          "archived"
      ) {
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
        body.status as any
    }

    if (hasModel) {
      if (
        body.model === null
      ) {
        data.model = null
      } else if (
        typeof body.model ===
        "string"
      ) {
        const model =
          body.model.trim()

        if (
          model.length >
          100
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Model name cannot exceed 100 characters.",
            },
            {
              status: 400,
            },
          )
        }

        data.model =
          model || null
      } else {
        return NextResponse.json(
          {
            success: false,
            error:
              "model must be a string or null.",
          },
          {
            status: 400,
          },
        )
      }
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
      "[AI_CONVERSATION_PATCH]",
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
 * DELETE
 *
 * DELETE /api/ai/conversations/:conversationId
 *
 * Permanently deletes the conversation.
 *
 * AiMessage records are removed by the
 * database relationship cascade.
 */
export async function DELETE(
  _request: Request,
  context: RouteContext,
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

    const params =
      await context.params

    const conversationId =
      getConversationId(
        params,
      )

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation ID is required.",
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
      "[AI_CONVERSATION_DELETE]",
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