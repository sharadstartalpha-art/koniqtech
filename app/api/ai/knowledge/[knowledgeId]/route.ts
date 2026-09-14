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

type RouteContext = {
  params: Promise<{
    knowledgeId: string
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

function normalizeJson(
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
 * GET /api/ai/knowledge/[knowledgeId]
 *
 * Returns one organization-owned knowledge source.
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

    const knowledgeId =
      typeof params.knowledgeId ===
      "string"
        ? params.knowledgeId.trim()
        : ""

    if (!knowledgeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Knowledge source ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const source =
      await prisma.aiKnowledgeSource.findFirst(
        {
          where: {
            id: knowledgeId,
            orgId,
          },

          select:
            knowledgeSelect,
        },
      )

    if (!source) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge source not found.",
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        source,
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
          "Unable to load AI knowledge source.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH /api/ai/knowledge/[knowledgeId]
 *
 * Updates knowledge-source metadata.
 *
 * Supported fields:
 *
 * {
 *   "name": "...",
 *   "sourceType": "...",
 *   "articleId": "...",
 *   "fileName": "...",
 *   "fileUrl": "...",
 *   "mimeType": "...",
 *   "fileSize": 12345,
 *   "metadata": {}
 * }
 *
 * Status is intentionally restricted.
 *
 * Clients may archive a source, but may not
 * falsely mark a source as processing/ready.
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

    const knowledgeId =
      typeof params.knowledgeId ===
      "string"
        ? params.knowledgeId.trim()
        : ""

    if (!knowledgeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Knowledge source ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const existing =
      await prisma.aiKnowledgeSource.findFirst(
        {
          where: {
            id: knowledgeId,
            orgId,
          },

          select: {
            id: true,
            status: true,
            articleId: true,
            name: true,
            sourceType: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            fileSize: true,
            metadata: true,
          },
        },
      )

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge source not found.",
        },
        {
          status: 404,
        },
      )
    }

    if (
      existing.status ===
      "processing"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A knowledge source currently being processed cannot be modified.",
          code:
            "KNOWLEDGE_SOURCE_PROCESSING",
        },
        {
          status: 409,
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

    const supportedFields = [
      "name",
      "sourceType",
      "articleId",
      "fileName",
      "fileUrl",
      "mimeType",
      "fileSize",
      "metadata",
      "status",
    ]

    const hasSupportedField =
      supportedFields.some(
        (field) =>
          Object.prototype.hasOwnProperty.call(
            body,
            field,
          ),
      )

    if (!hasSupportedField) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No supported fields were provided.",
        },
        {
          status: 400,
        },
      )
    }

    const data: Record<
      string,
      unknown
    > = {}

    /**
     * Name
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "name",
      )
    ) {
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
              "name must be a non-empty string.",
          },
          {
            status: 400,
          },
        )
      }

      data.name =
        name
    }

    /**
     * Source type
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "sourceType",
      )
    ) {
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
              "sourceType must be a non-empty string.",
          },
          {
            status: 400,
          },
        )
      }

      data.sourceType =
        sourceType
    }

    /**
     * Article ID
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "articleId",
      )
    ) {
      if (
        body.articleId ===
        null
      ) {
        data.articleId =
          null
      } else {
        const articleId =
          normalizeText(
            body.articleId,
            200,
          )

        if (!articleId) {
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

        data.articleId =
          articleId
      }
    }

    /**
     * File name
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "fileName",
      )
    ) {
      if (
        body.fileName ===
        null
      ) {
        data.fileName =
          null
      } else {
        const fileName =
          normalizeText(
            body.fileName,
            500,
          )

        if (!fileName) {
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

        data.fileName =
          fileName
      }
    }

    /**
     * File URL
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "fileUrl",
      )
    ) {
      if (
        body.fileUrl ===
        null
      ) {
        data.fileUrl =
          null
      } else {
        const fileUrl =
          normalizeText(
            body.fileUrl,
            2000,
          )

        if (!fileUrl) {
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

        data.fileUrl =
          fileUrl
      }
    }

    /**
     * MIME type
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "mimeType",
      )
    ) {
      if (
        body.mimeType ===
        null
      ) {
        data.mimeType =
          null
      } else {
        const mimeType =
          normalizeText(
            body.mimeType,
            200,
          )

        if (!mimeType) {
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

        data.mimeType =
          mimeType
      }
    }

    /**
     * File size
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "fileSize",
      )
    ) {
      if (
        body.fileSize ===
        null
      ) {
        data.fileSize =
          null
      } else {
        const fileSize =
          normalizePositiveInteger(
            body.fileSize,
          )

        if (
          fileSize ===
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

        data.fileSize =
          fileSize
      }
    }

    /**
     * Metadata
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "metadata",
      )
    ) {
      const metadata =
        normalizeJson(
          body.metadata,
        )

      if (
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

      data.metadata =
        metadata as any
    }

    /**
     * Status
     *
     * Only archive/unarchive operations are
     * accepted through the normal PATCH route.
     *
     * Processing state must be controlled by
     * the dedicated processing endpoint.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "status",
      )
    ) {
      const requestedStatus =
        normalizeStatus(
          body.status,
        )

      if (!requestedStatus) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid knowledge source status.",
          },
          {
            status: 400,
          },
        )
      }

      const allowedStatusChange =
        requestedStatus ===
          "archived" ||
        (
          requestedStatus !==
            "processing" &&
          existing.status ===
            "archived" &&
          requestedStatus ===
            "pending"
        )

      if (
        !allowedStatusChange
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Status can only be changed to archived, or restored from archived to pending.",
            code:
              "INVALID_KNOWLEDGE_STATUS_CHANGE",
          },
          {
            status: 400,
          },
        )
      }

      data.status =
        requestedStatus as any

      /**
       * When archiving, clear a stale processing
       * error only when the source is being restored
       * later through the processing pipeline.
       */
      if (
        requestedStatus ===
        "pending"
      ) {
        data.error =
          null
      }
    }

    if (
      Object.keys(data).length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No changes were provided.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * If a source is archived, don't allow normal
     * metadata updates in the same request to
     * accidentally reactivate it.
     */
    if (
      existing.status ===
        "archived" &&
      !Object.prototype.hasOwnProperty.call(
        body,
        "status",
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Archived knowledge sources must be restored before they can be modified.",
          code:
            "KNOWLEDGE_SOURCE_ARCHIVED",
        },
        {
          status: 409,
        },
      )
    }

    const source =
      await prisma.aiKnowledgeSource.update(
        {
          where: {
            id:
              existing.id,
          },

          data:
            data as Prisma.AiKnowledgeSourceUpdateInput,

          select:
            knowledgeSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,
        source,
      },
    )
  } catch (error) {
    console.error(
      "[AI_KNOWLEDGE_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI knowledge source.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * DELETE /api/ai/knowledge/[knowledgeId]
 *
 * Archives a knowledge source instead of
 * physically deleting it.
 *
 * This preserves auditability and allows the
 * processing layer to clean up any external
 * vector/file resources later.
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

    const knowledgeId =
      typeof params.knowledgeId ===
      "string"
        ? params.knowledgeId.trim()
        : ""

    if (!knowledgeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Knowledge source ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const existing =
      await prisma.aiKnowledgeSource.findFirst(
        {
          where: {
            id: knowledgeId,
            orgId,
          },

          select: {
            id: true,
            status: true,
            name: true,
          },
        },
      )

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge source not found.",
        },
        {
          status: 404,
        },
      )
    }

    if (
      existing.status ===
      "archived"
    ) {
      return NextResponse.json(
        {
          success: true,
          deleted: false,
          archived: true,
          sourceId:
            existing.id,
          message:
            "Knowledge source is already archived.",
        },
      )
    }

    const source =
      await prisma.aiKnowledgeSource.update(
        {
          where: {
            id:
              existing.id,
          },

          data: {
            status:
              "archived" as any,
          },

          select:
            knowledgeSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,
        deleted: false,
        archived: true,
        source,
      },
    )
  } catch (error) {
    console.error(
      "[AI_KNOWLEDGE_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to archive AI knowledge source.",
      },
      {
        status: 500,
      },
    )
  }
}