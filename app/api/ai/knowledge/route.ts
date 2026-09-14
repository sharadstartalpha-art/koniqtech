import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type KnowledgeStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed"
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

function normalizeText(
  value: unknown,
  maxLength: number,
): string | undefined {
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

function normalizeStatus(
  value: unknown,
): KnowledgeStatus | undefined {
  if (
    value === "pending" ||
    value === "processing" ||
    value === "ready" ||
    value === "failed" ||
    value === "archived"
  ) {
    return value
  }

  return undefined
}

function normalizePositiveInteger(
  value: unknown,
): number | undefined {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return undefined
  }

  return value
}

function normalizeConfig(
  value: unknown,
): Prisma.InputJsonValue | undefined {
  if (
    value === undefined
  ) {
    return undefined
  }

  if (
    value === null
  ) {
    return null as any
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value
  }

  if (
    Array.isArray(value)
  ) {
    return value as Prisma.InputJsonValue
  }

  if (
    typeof value === "object"
  ) {
    return value as Prisma.InputJsonObject
  }

  return undefined
}

const knowledgeSelect = {
  id: true,
  orgId: true,
  articleId: true,
  name: true,
  sourceType: true,
  fileName: true,
  fileUrl: true,
  mimeType: true,
  fileSize: true,
  vectorStoreId: true,
  vectorFileId: true,
  status: true,
  error: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AiKnowledgeSourceSelect

/**
 * GET /api/ai/knowledge
 *
 * Lists knowledge sources belonging to the
 * authenticated organization.
 *
 * Optional:
 *
 * ?status=ready
 * ?sourceType=file
 * ?limit=50
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

    const statusParam =
      searchParams.get(
        "status",
      )

    const sourceType =
      searchParams
        .get("sourceType")
        ?.trim() || ""

    const limitParam =
      searchParams.get(
        "limit",
      )

    let status:
      | KnowledgeStatus
      | undefined

    if (
      statusParam
    ) {
      status =
        normalizeStatus(
          statusParam,
        )

      if (!status) {
        return NextResponse.json(
          {
            success: false,
            error:
              "status must be pending, processing, ready, failed, or archived.",
          },
          {
            status: 400,
          },
        )
      }
    }

    let limit = 50

    if (
      limitParam
    ) {
      const parsed =
        Number(
          limitParam,
        )

      if (
        !Number.isInteger(
          parsed,
        ) ||
        parsed < 1 ||
        parsed > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "limit must be an integer between 1 and 100.",
          },
          {
            status: 400,
          },
        )
      }

      limit = parsed
    }

    const sources =
      await prisma.aiKnowledgeSource.findMany(
        {
          where: {
            orgId,

            ...(status
              ? {
                  status:
                    status as any,
                }
              : {}),

            ...(sourceType
              ? {
                  sourceType,
                }
              : {}),
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

          select:
            knowledgeSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,
        sources,
        count:
          sources.length,
      },
    )
  } catch (error) {
    console.error(
      "[AI_KNOWLEDGE_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI knowledge sources.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * POST /api/ai/knowledge
 *
 * Creates a knowledge-source record.
 *
 * This endpoint does NOT claim that the source
 * has been uploaded or vectorized. Processing
 * is handled separately.
 *
 * Body example:
 *
 * {
 *   "name": "Roofing Installation Guide",
 *   "sourceType": "file",
 *   "fileName": "roofing-guide.pdf",
 *   "fileUrl": "...",
 *   "mimeType": "application/pdf",
 *   "fileSize": 123456,
 *   "metadata": {}
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

    /**
     * Respect the organization's AI knowledge
     * setting.
     */
    const settings =
      await prisma.organizationSettings.findFirst(
        {
          where: {
            orgId,
          },

          select: {
            aiEnabled: true,
            aiKnowledgeEnabled:
              true,
          },
        },
      )

    if (
      settings &&
      !settings.aiEnabled
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI is disabled for this organization.",
          code:
            "AI_DISABLED",
        },
        {
          status: 403,
        },
      )
    }

    if (
      settings &&
      !settings.aiKnowledgeEnabled
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge is disabled for this organization.",
          code:
            "AI_KNOWLEDGE_DISABLED",
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

    const name =
      normalizeText(
        body.name,
        200,
      )

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error:
            "name is required.",
        },
        {
          status: 400,
        },
      )
    }

    const sourceType =
      normalizeText(
        body.sourceType,
        100,
      )

    if (!sourceType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "sourceType is required.",
        },
        {
          status: 400,
        },
      )
    }

    const articleId =
      body.articleId ===
      null
        ? null
        : body.articleId !==
            undefined
          ? normalizeText(
              body.articleId,
              200,
            )
          : undefined

    if (
      body.articleId !==
        undefined &&
      body.articleId !==
        null &&
      !articleId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "articleId must be a valid string or null.",
        },
        {
          status: 400,
        },
      )
    }

    const fileName =
      body.fileName ===
      null
        ? null
        : body.fileName !==
            undefined
          ? normalizeText(
              body.fileName,
              500,
            )
          : undefined

    if (
      body.fileName !==
        undefined &&
      body.fileName !==
        null &&
      !fileName
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "fileName must be a valid string or null.",
        },
        {
          status: 400,
        },
      )
    }

    const fileUrl =
      body.fileUrl ===
      null
        ? null
        : body.fileUrl !==
            undefined
          ? normalizeText(
              body.fileUrl,
              2000,
            )
          : undefined

    if (
      body.fileUrl !==
        undefined &&
      body.fileUrl !==
        null &&
      !fileUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "fileUrl must be a valid string or null.",
        },
        {
          status: 400,
        },
      )
    }

    const mimeType =
      body.mimeType ===
      null
        ? null
        : body.mimeType !==
            undefined
          ? normalizeText(
              body.mimeType,
              200,
            )
          : undefined

    if (
      body.mimeType !==
        undefined &&
      body.mimeType !==
        null &&
      !mimeType
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "mimeType must be a valid string or null.",
        },
        {
          status: 400,
        },
      )
    }

    let fileSize:
      | number
      | null
      | undefined =
      undefined

    if (
      body.fileSize ===
      null
    ) {
      fileSize =
        null
    } else if (
      body.fileSize !==
      undefined
    ) {
      const parsedSize =
        normalizePositiveInteger(
          body.fileSize,
        )

      if (
        parsedSize ===
        undefined
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "fileSize must be a non-negative integer or null.",
          },
          {
            status: 400,
          },
        )
      }

      fileSize =
        parsedSize
    }

    const metadata =
      normalizeConfig(
        body.metadata,
      )

    if (
      body.metadata !==
        undefined &&
      metadata ===
        undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "metadata must contain valid JSON.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * New sources begin in pending state.
     *
     * Clients cannot create a fake "ready"
     * vectorized source.
     */
    const source =
      await prisma.aiKnowledgeSource.create(
        {
          data: {
            orgId,
            name,
            sourceType,

            ...(articleId !==
            undefined
              ? {
                  articleId,
                }
              : {}),

            ...(fileName !==
            undefined
              ? {
                  fileName,
                }
              : {}),

            ...(fileUrl !==
            undefined
              ? {
                  fileUrl,
                }
              : {}),

            ...(mimeType !==
            undefined
              ? {
                  mimeType,
                }
              : {}),

            ...(fileSize !==
            undefined
              ? {
                  fileSize,
                }
              : {}),

            status:
              "pending" as any,

            ...(metadata !==
            undefined
              ? {
                  metadata:
                    metadata as any,
                }
              : {}),
          } as any,

          select:
            knowledgeSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,
        source,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error(
      "[AI_KNOWLEDGE_POST]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create AI knowledge source.",
      },
      {
        status: 500,
      },
    )
  }
}