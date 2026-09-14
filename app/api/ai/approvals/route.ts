import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

/*
 * --------------------------------------------------------------------------
 * TYPES
 * --------------------------------------------------------------------------
 */

type SessionUser = {
  id?: string
  orgId?: string | null
}

type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"

type ApprovalAction =
  | "approve"
  | "reject"

type JsonRecord = Record<string, unknown>

type ApprovalPayload = {
  toolCallId?: unknown
  toolName?: unknown
  toolType?: unknown
  agentId?: unknown
  input?: unknown
}

/*
 * --------------------------------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------------------------------
 */

const MAX_LIMIT = 50

const DEFAULT_LIMIT = 20

const MAX_REJECTION_REASON_LENGTH =
  1_000

/*
 * --------------------------------------------------------------------------
 * HELPERS
 * --------------------------------------------------------------------------
 */

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
  value: string | null,
) {
  if (!value) {
    return DEFAULT_LIMIT
  }

  const parsed =
    Number(value)

  if (
    !Number.isFinite(parsed)
  ) {
    return DEFAULT_LIMIT
  }

  return Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      Math.floor(parsed),
    ),
  )
}

function isPlainObject(
  value: unknown,
): value is JsonRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function parseApprovalPayload(
  value: unknown,
) {
  if (
    !isPlainObject(value)
  ) {
    return null
  }

  return value as ApprovalPayload
}

function sanitizeJson(
  value: unknown,
): unknown {
  if (
    value === null ||
    value === undefined
  ) {
    return value
  }

  if (
    value instanceof Date
  ) {
    return value.toISOString()
  }

  if (
    typeof value === "bigint"
  ) {
    return value.toString()
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    if (Array.isArray(value)) {
      return value.map(
        sanitizeJson,
      )
    }

    const result: Record<
      string,
      unknown
    > = {}

    for (const [
      key,
      item,
    ] of Object.entries(
      value as Record<
        string,
        unknown
      >,
    )) {
      result[key] =
        sanitizeJson(item)
    }

    return result
  }

  return value
}

function toJsonValue(
  value: unknown,
): Prisma.InputJsonValue {
  const serialized =
    JSON.stringify(value)

  if (serialized === undefined) {
    return {}
  }

  return JSON.parse(
    serialized,
  ) as Prisma.InputJsonValue
}

/*
 * --------------------------------------------------------------------------
 * EXPIRATION
 * --------------------------------------------------------------------------
 *
 * Approvals created by /api/ai/execute have an expiration timestamp.
 *
 * Before returning pending approvals, expired records are moved to the
 * "expired" state.
 *
 * This is intentionally scoped to the authenticated organization and user.
 */

async function expireOldApprovals(
  orgId: string,
  userId: string,
) {
  const now = new Date()

  await prisma.aiApproval.updateMany(
    {
      where: {
        orgId,
        userId,
        status: "pending",
        expiresAt: {
          lte: now,
        },
      },

      data: {
        status: "expired",
      },
    },
  )
}

/*
 * --------------------------------------------------------------------------
 * TOOL CALL OWNERSHIP
 * --------------------------------------------------------------------------
 *
 * Every approval created by /api/ai/execute contains a toolCallId in its
 * payload.
 *
 * Before changing approval state, verify that:
 *
 * - the tool call exists
 * - it belongs to this organization
 * - it belongs to this authenticated user
 * - it belongs to the same agent
 * - it belongs to the same tool
 *
 * This prevents an approval from being used to authorize a different action.
 */

async function verifyToolCallForApproval({
  orgId,
  userId,
  approvalPayload,
  actionType,
}: {
  orgId: string
  userId: string
  approvalPayload: ApprovalPayload
  actionType: string
}) {
  const toolCallId =
    normalizeString(
      approvalPayload.toolCallId,
      100,
    )

  const toolName =
    normalizeString(
      approvalPayload.toolName,
      100,
    )

  const agentId =
    normalizeString(
      approvalPayload.agentId,
      100,
    )

  if (
    !toolCallId ||
    !toolName ||
    !agentId
  ) {
    return {
      valid: false as const,
      status: 409,
      error:
        "Approval payload is invalid.",
    }
  }

  if (
    toolName !== actionType
  ) {
    return {
      valid: false as const,
      status: 409,
      error:
        "Approval action does not match the requested tool.",
    }
  }

  const toolCall =
    await prisma.aiToolCall.findFirst(
      {
        where: {
          id: toolCallId,
          orgId,
          userId,
          agentId,
          toolName,
        },

        select: {
          id: true,
          orgId: true,
          userId: true,
          agentId: true,
          toolName: true,
          toolType: true,
          status: true,
          input: true,
          output: true,
          error: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
        },
      },
    )

  if (!toolCall) {
    return {
      valid: false as const,
      status: 404,
      error:
        "Associated AI tool call was not found.",
    }
  }

  return {
    valid: true as const,
    toolCall,
    toolCallId,
  }
}

/*
 * --------------------------------------------------------------------------
 * GET /api/ai/approvals
 * --------------------------------------------------------------------------
 *
 * Examples:
 *
 * GET /api/ai/approvals
 *
 * GET /api/ai/approvals?status=pending
 *
 * GET /api/ai/approvals?conversationId=...
 *
 * GET /api/ai/approvals?status=pending&limit=20
 *
 * IMPORTANT:
 *
 * Results are ALWAYS restricted to the authenticated organization + user.
 */

export async function GET(
  request: Request,
) {
  try {
    /*
     * ---------------------------------------------------------------
     * AUTHENTICATION
     * ---------------------------------------------------------------
     */

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
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
        { status: 401 },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        { status: 403 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * QUERY PARAMETERS
     * ---------------------------------------------------------------
     */

    const url =
      new URL(request.url)

    const requestedStatus =
      normalizeString(
        url.searchParams.get(
          "status",
        ),
        30,
      )

    const conversationId =
      normalizeString(
        url.searchParams.get(
          "conversationId",
        ),
        100,
      )

    const limit =
      normalizeLimit(
        url.searchParams.get(
          "limit",
        ),
      )

    const allowedStatuses:
      ApprovalStatus[] = [
        "pending",
        "approved",
        "rejected",
        "expired",
      ]

    let status:
      | ApprovalStatus
      | undefined

    if (requestedStatus) {
      if (
        !allowedStatuses.includes(
          requestedStatus as ApprovalStatus,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid approval status.",
            allowedStatuses,
          },
          { status: 400 },
        )
      }

      status =
        requestedStatus as ApprovalStatus
    }

    /*
     * ---------------------------------------------------------------
     * EXPIRE OLD PENDING APPROVALS
     * ---------------------------------------------------------------
     */

    await expireOldApprovals(
      orgId,
      userId,
    )

    /*
     * ---------------------------------------------------------------
     * BUILD QUERY
     * ---------------------------------------------------------------
     */

    const where: Prisma.AiApprovalWhereInput =
      {
        orgId,
        userId,
      }

    if (status) {
      where.status = status
    }

    if (conversationId) {
      where.conversationId =
        conversationId
    }

    /*
     * ---------------------------------------------------------------
     * FETCH APPROVALS
     * ---------------------------------------------------------------
     */

    const approvals =
      await prisma.aiApproval.findMany(
        {
          where,

          orderBy: [
            {
              createdAt:
                "desc",
            },
          ],

          take: limit,

          select: {
            id: true,
            orgId: true,
            conversationId: true,
            userId: true,
            actionType: true,
            description: true,
            payload: true,
            status: true,
            approvedAt: true,
            rejectedAt: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      )

    /*
     * ---------------------------------------------------------------
     * RETURN SAFE RESULT
     * ---------------------------------------------------------------
     */

    const sanitized =
      approvals.map(
        (approval) => ({
          id: approval.id,
          conversationId:
            approval.conversationId,
          actionType:
            approval.actionType,
          description:
            approval.description,
          payload:
            sanitizeJson(
              approval.payload,
            ),
          status:
            approval.status,
          approvedAt:
            approval.approvedAt,
          rejectedAt:
            approval.rejectedAt,
          expiresAt:
            approval.expiresAt,
          createdAt:
            approval.createdAt,
        }),
      )

    const pendingCount =
      sanitized.filter(
        (approval) =>
          approval.status ===
          "pending",
      ).length

    return NextResponse.json({
      success: true,
      approvals: sanitized,
      count: sanitized.length,
      pendingCount,
    })
  } catch (error) {
    console.error(
      "[AI_APPROVALS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI approvals.",
      },
      { status: 500 },
    )
  }
}

/*
 * --------------------------------------------------------------------------
 * PATCH /api/ai/approvals
 * --------------------------------------------------------------------------
 *
 * Approve:
 *
 * {
 *   "approvalId": "...",
 *   "action": "approve"
 * }
 *
 * Reject:
 *
 * {
 *   "approvalId": "...",
 *   "action": "reject",
 *   "reason": "I do not want this email sent."
 * }
 *
 * IMPORTANT:
 *
 * PATCH ONLY changes approval state.
 *
 * It does NOT execute the action.
 *
 * After approval:
 *
 *     PATCH /api/ai/approvals
 *             ↓
 *       status = approved
 *             ↓
 *     POST /api/ai/execute
 *       { approvalId: "..." }
 *
 * This separation makes the approval boundary explicit.
 */

export async function PATCH(
  request: Request,
) {
  try {
    /*
     * ---------------------------------------------------------------
     * AUTHENTICATION
     * ---------------------------------------------------------------
     */

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
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
        { status: 401 },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        { status: 403 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * REQUEST BODY
     * ---------------------------------------------------------------
     */

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        { status: 400 },
      )
    }

    if (
      !isPlainObject(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Request body must be an object.",
        },
        { status: 400 },
      )
    }

    const approvalId =
      normalizeString(
        body.approvalId,
        100,
      )

    if (!approvalId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "approvalId is required.",
        },
        { status: 400 },
      )
    }

    const action =
      normalizeString(
        body.action,
        30,
      ) as ApprovalAction | null

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'action must be either "approve" or "reject".',
        },
        { status: 400 },
      )
    }

    const reason =
      normalizeString(
        body.reason,
        MAX_REJECTION_REASON_LENGTH,
      )

    /*
     * ---------------------------------------------------------------
     * LOAD APPROVAL
     * ---------------------------------------------------------------
     *
     * Strict tenant + user ownership.
     */

    const approval =
      await prisma.aiApproval.findFirst(
        {
          where: {
            id: approvalId,
            orgId,
            userId,
          },

          select: {
            id: true,
            orgId: true,
            conversationId: true,
            userId: true,
            actionType: true,
            description: true,
            payload: true,
            status: true,
            approvedAt: true,
            rejectedAt: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      )

    if (!approval) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Approval not found.",
        },
        { status: 404 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * ONLY PENDING APPROVALS CAN CHANGE
     * ---------------------------------------------------------------
     */

    if (
      approval.status !==
      "pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This approval has already been processed.",
          approvalStatus:
            approval.status,
        },
        { status: 409 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * EXPIRATION CHECK
     * ---------------------------------------------------------------
     */

    if (
      approval.expiresAt &&
      approval.expiresAt <=
        new Date()
    ) {
      await prisma.aiApproval.updateMany(
        {
          where: {
            id: approval.id,
            orgId,
            userId,
            status: "pending",
          },

          data: {
            status: "expired",
          },
        },
      )

      return NextResponse.json(
        {
          success: false,
          error:
            "This approval has expired.",
          approvalId:
            approval.id,
        },
        { status: 409 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * VERIFY PAYLOAD
     * ---------------------------------------------------------------
     */

    const approvalPayload =
      parseApprovalPayload(
        approval.payload,
      )

    if (!approvalPayload) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Approval payload is invalid.",
        },
        { status: 409 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * VERIFY ASSOCIATED TOOL CALL
     * ---------------------------------------------------------------
     */

    const toolCallVerification =
      await verifyToolCallForApproval(
        {
          orgId,
          userId,
          approvalPayload,
          actionType:
            approval.actionType,
        },
      )

    if (
      !toolCallVerification.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            toolCallVerification.error,
        },
        {
          status:
            toolCallVerification.status,
        },
      )
    }

    const {
      toolCall,
      toolCallId,
    } =
      toolCallVerification

    /*
     * ---------------------------------------------------------------
     * TOOL CALL MUST STILL BE PENDING
     * ---------------------------------------------------------------
     *
     * If another process has already completed/rejected/failed the call,
     * approval must not be allowed to authorize it.
     */

    if (
      toolCall.status !==
      "pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The associated AI tool call is no longer pending.",
          toolCallStatus:
            toolCall.status,
        },
        { status: 409 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * APPROVE
     * ---------------------------------------------------------------
     */

    if (
      action === "approve"
    ) {
      /*
       * Conditional update prevents two concurrent requests
       * from approving the same pending approval.
       */

      const updated =
        await prisma.aiApproval.updateMany(
          {
            where: {
              id: approval.id,
              orgId,
              userId,
              status: "pending",
            },

            data: {
              status:
                "approved",
              approvedAt:
                new Date(),
              rejectedAt:
                null,
            },
          },
        )

      if (
        updated.count !== 1
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval was already processed.",
          },
          { status: 409 },
        )
      }

      const approved =
        await prisma.aiApproval.findFirst(
          {
            where: {
              id: approval.id,
              orgId,
              userId,
            },

            select: {
              id: true,
              conversationId: true,
              actionType: true,
              description: true,
              payload: true,
              status: true,
              approvedAt: true,
              rejectedAt: true,
              expiresAt: true,
              createdAt: true,
            },
          },
        )

      return NextResponse.json({
        success: true,
        action: "approved",

        approval:
          approved
            ? {
                ...approved,
                payload:
                  sanitizeJson(
                    approved.payload,
                  ),
              }
            : null,

        toolCall: {
          id:
            toolCallId,
          status:
            toolCall.status,
          toolName:
            toolCall.toolName,
          toolType:
            toolCall.toolType,
        },

        /*
         * The client can now call:
         *
         * POST /api/ai/execute
         * {
         *   "toolName": "...",
         *   "agentId": "...",
         *   "approvalId": "..."
         * }
         */
        nextAction:
          "execute_approved_tool",
      })
    }

    /*
     * ---------------------------------------------------------------
     * REJECT
     * ---------------------------------------------------------------
     */

    const rejectionReason =
      reason ??
      "AI action rejected by the user."

    const rejected =
      await prisma.$transaction(
        async (tx) => {
          /*
           * First transition the approval.
           */
          const approvalUpdate =
            await tx.aiApproval.updateMany(
              {
                where: {
                  id: approval.id,
                  orgId,
                  userId,
                  status:
                    "pending",
                },

                data: {
                  status:
                    "rejected",
                  rejectedAt:
                    new Date(),
                },
              },
            )

          if (
            approvalUpdate.count !==
            1
          ) {
            throw new Error(
              "APPROVAL_ALREADY_PROCESSED",
            )
          }

          /*
           * Then reject the associated tool call.
           *
           * This prevents it from being executed later using
           * the rejected approval.
           */
          const toolCallUpdate =
            await tx.aiToolCall.updateMany(
              {
                where: {
                  id:
                    toolCallId,
                  orgId,
                  userId,
                  status:
                    "pending",
                },

                data: {
                  status:
                    "rejected",
                  error:
                    rejectionReason,
                  completedAt:
                    new Date(),
                },
              },
            )

          if (
            toolCallUpdate.count !==
            1
          ) {
            throw new Error(
              "TOOL_CALL_ALREADY_PROCESSED",
            )
          }

          return true
        },
      )

    if (!rejected) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to reject approval.",
        },
        { status: 409 },
      )
    }

    const rejectedApproval =
      await prisma.aiApproval.findFirst(
        {
          where: {
            id: approval.id,
            orgId,
            userId,
          },

          select: {
            id: true,
            conversationId: true,
            actionType: true,
            description: true,
            payload: true,
            status: true,
            approvedAt: true,
            rejectedAt: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      )

    return NextResponse.json({
      success: true,
      action: "rejected",

      approval:
        rejectedApproval
          ? {
              ...rejectedApproval,
              payload:
                sanitizeJson(
                  rejectedApproval.payload,
                ),
            }
          : null,

      toolCall: {
        id:
          toolCallId,
        status:
          "rejected",
        toolName:
          toolCall.toolName,
        toolType:
          toolCall.toolType,
      },

      reason:
        rejectionReason,
    })
  } catch (error) {
    /*
     * Expected race-condition errors.
     */
    if (
      error instanceof Error &&
      (
        error.message ===
          "APPROVAL_ALREADY_PROCESSED" ||
        error.message ===
          "TOOL_CALL_ALREADY_PROCESSED"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This approval was processed by another request.",
        },
        { status: 409 },
      )
    }

    console.error(
      "[AI_APPROVALS_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI approval.",
      },
      { status: 500 },
    )
  }
}