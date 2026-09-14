import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type ToolCallStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "rejected"

type JsonRecord = Record<string, unknown>

function getSessionContext(session: {
  user?: SessionUser | null
}) {
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

function normalizeString(
  value: unknown,
  maxLength = 200,
) {
  if (
    typeof value !== "string"
  ) {
    return null
  }

  const result =
    value.trim()

  if (!result) {
    return null
  }

  return result.slice(
    0,
    maxLength,
  )
}

function normalizeLimit(
  value: unknown,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 50
  }

  return Math.min(
    100,
    Math.max(
      1,
      Math.floor(value),
    ),
  )
}

function normalizeStatus(
  value: unknown,
): ToolCallStatus | null {
  const status =
    normalizeString(
      value,
      50,
    )

  if (!status) {
    return null
  }

  const allowed: ToolCallStatus[] = [
    "pending",
    "running",
    "completed",
    "failed",
    "rejected",
  ]

  return allowed.includes(
    status as ToolCallStatus,
  )
    ? (status as ToolCallStatus)
    : null
}

function serializeJson(
  value: unknown,
): unknown {
  if (
    value === null ||
    value === undefined
  ) {
    return value
  }

  if (
    typeof value === "bigint"
  ) {
    return value.toString()
  }

  if (
    value instanceof Date
  ) {
    return value.toISOString()
  }

  if (
    value instanceof Prisma.Decimal
  ) {
    return value.toNumber()
  }

  if (
    Array.isArray(value)
  ) {
    return value.map(
      serializeJson,
    )
  }

  if (
    typeof value === "object"
  ) {
    const result: JsonRecord =
      {}

    for (
      const [
        key,
        item,
      ] of Object.entries(
        value as Record<
          string,
          unknown
        >,
      )
    ) {
      result[key] =
        serializeJson(item)
    }

    return result
  }

  return value
}

/*
 * --------------------------------------------------------------------------
 * GET /api/ai/executions
 * --------------------------------------------------------------------------
 *
 * Returns AI tool execution history for the authenticated organization.
 *
 * Supported query parameters:
 *
 * ?status=pending
 * ?status=running
 * ?status=completed
 * ?status=failed
 * ?status=rejected
 *
 * ?toolName=customer_lookup
 * ?toolType=crm_read
 * ?agentId=...
 * ?conversationId=...
 * ?search=customer
 * ?limit=50
 *
 * Organization and user ownership are always enforced server-side.
 */

export async function GET(
  request: Request,
) {
  try {
    /*
     * ----------------------------------------------------------------------
     * AUTH
     * ----------------------------------------------------------------------
     */

    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        },
      )
    }

    const {
      userId,
      orgId,
    } =
      getSessionContext(
        session,
      )

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
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

    /*
     * ----------------------------------------------------------------------
     * QUERY PARAMETERS
     * ----------------------------------------------------------------------
     */

    const url =
      new URL(
        request.url,
      )

    const status =
      normalizeStatus(
        url.searchParams.get(
          "status",
        ),
      )

    const toolName =
      normalizeString(
        url.searchParams.get(
          "toolName",
        ),
        100,
      )

    const toolType =
      normalizeString(
        url.searchParams.get(
          "toolType",
        ),
        100,
      )

    const agentId =
      normalizeString(
        url.searchParams.get(
          "agentId",
        ),
        100,
      )

    const conversationId =
      normalizeString(
        url.searchParams.get(
          "conversationId",
        ),
        100,
      )

    const search =
      normalizeString(
        url.searchParams.get(
          "search",
        ),
        200,
      )

    const limitParam =
      Number(
        url.searchParams.get(
          "limit",
        ),
      )

    const limit =
      Number.isFinite(
        limitParam,
      )
        ? normalizeLimit(
            limitParam,
          )
        : 50

    /*
     * ----------------------------------------------------------------------
     * DATE FILTERS
     * ----------------------------------------------------------------------
     */

    const fromParam =
      normalizeString(
        url.searchParams.get(
          "from",
        ),
        50,
      )

    const toParam =
      normalizeString(
        url.searchParams.get(
          "to",
        ),
        50,
      )

    let fromDate:
      | Date
      | undefined

    let toDate:
      | Date
      | undefined

    if (fromParam) {
      const parsed =
        new Date(
          fromParam,
        )

      if (
        !Number.isNaN(
          parsed.getTime(),
        )
      ) {
        fromDate =
          parsed
      }
    }

    if (toParam) {
      const parsed =
        new Date(
          toParam,
        )

      if (
        !Number.isNaN(
          parsed.getTime(),
        )
      ) {
        toDate =
          parsed
      }
    }

    /*
     * ----------------------------------------------------------------------
     * WHERE
     * ----------------------------------------------------------------------
     *
     * IMPORTANT:
     *
     * orgId is mandatory.
     *
     * We intentionally do not accept orgId from the browser.
     */

    const where: Prisma.AiToolCallWhereInput =
      {
        orgId,
      }

    if (status) {
      where.status =
        status as Prisma.AiToolCallWhereInput["status"]
    }

    if (toolName) {
      where.toolName =
        toolName
    }

    if (toolType) {
      where.toolType =
        toolType as Prisma.AiToolCallWhereInput["toolType"]
    }

    if (agentId) {
      where.agentId =
        agentId
    }

    if (conversationId) {
      where.conversationId =
        conversationId
    }

    if (
      fromDate ||
      toDate
    ) {
      where.createdAt = {
        ...(fromDate
          ? {
              gte: fromDate,
            }
          : {}),
        ...(toDate
          ? {
              lte: toDate,
            }
          : {}),
      }
    }

    /*
     * Search across fields that are safe and useful for the monitor.
     */

    if (search) {
      where.OR = [
        {
          toolName: {
            contains:
              search,
            mode:
              "insensitive",
          },
        },
        {
          error: {
            contains:
              search,
            mode:
              "insensitive",
          },
        },
      ]
    }

    /*
     * ----------------------------------------------------------------------
     * FETCH
     * ----------------------------------------------------------------------
     */

    const executions =
      await prisma.aiToolCall.findMany(
        {
          where,

          orderBy: [
            {
              createdAt:
                "desc",
            },
            {
              id:
                "desc",
            },
          ],

          take: limit,

          select: {
            id: true,
            orgId: true,
            conversationId:
              true,
            agentId: true,
            userId: true,
            toolName: true,
            toolType: true,
            input: true,
            output: true,
            status: true,
            error: true,
            startedAt: true,
            completedAt: true,
            createdAt: true,

            agent: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
              },
            },

            conversation: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },

            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      )

    /*
     * ----------------------------------------------------------------------
     * SUMMARY
     * ----------------------------------------------------------------------
     */

    const summary =
      executions.reduce(
        (
          accumulator,
          item,
        ) => {
          accumulator.total += 1

          switch (
            item.status
          ) {
            case "pending":
              accumulator.pending += 1
              break

            case "running":
              accumulator.running += 1
              break

            case "completed":
              accumulator.completed += 1
              break

            case "failed":
              accumulator.failed += 1
              break

            case "rejected":
              accumulator.rejected += 1
              break
          }

          return accumulator
        },
        {
          total: 0,
          pending: 0,
          running: 0,
          completed: 0,
          failed: 0,
          rejected: 0,
        },
      )

    /*
     * ----------------------------------------------------------------------
     * RESPONSE
     * ----------------------------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      executions:
        serializeJson(
          executions,
        ),

      /*
       * "items" is included as a compatibility alias so the
       * frontend can consume either response convention.
       */
      items:
        serializeJson(
          executions,
        ),

      summary,

      pagination: {
        limit,
        returned:
          executions.length,
        hasMore:
          executions.length >=
          limit,
      },
    })
  } catch (error) {
    console.error(
      "[AI_EXECUTIONS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI execution history.",
      },
      {
        status: 500,
      },
    )
  }
}