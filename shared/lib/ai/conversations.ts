import {
  AiConversationStatus,
  AiMessageRole,
  Prisma,
} from "@prisma/client"

import { prisma } from "@/shared/lib/prisma"

const DEFAULT_CONVERSATION_TITLE =
  "New AI Conversation"

const MAX_CONVERSATIONS = 50
const MAX_MESSAGES = 100

export type CreateConversationInput = {
  orgId: string
  userId: string
  title?: string | null
  model?: string | null
  context?: Prisma.InputJsonValue
}

export type AddMessageInput = {
  orgId: string
  userId: string
  conversationId: string
  role: AiMessageRole
  content: string
  model?: string | null
  inputTokens?: number | null
  outputTokens?: number | null
  totalTokens?: number | null
  metadata?: Prisma.InputJsonValue
}

export type ListConversationsOptions = {
  orgId: string
  userId: string
  status?: AiConversationStatus
  limit?: number
}

function cleanText(
  value: string | null | undefined,
): string {
  return value?.trim() || ""
}

function normalizeLimit(
  value: number | undefined,
  maximum: number,
): number {
  if (!value || !Number.isFinite(value)) {
    return maximum
  }

  return Math.min(
    Math.max(Math.floor(value), 1),
    maximum,
  )
}

/**
 * Create a new AI conversation.
 *
 * Organization and user ownership are always stored together.
 */
export async function createConversation({
  orgId,
  userId,
  title,
  model,
  context,
}: CreateConversationInput) {
  if (!orgId) {
    throw new Error(
      "Organization ID is required.",
    )
  }

  if (!userId) {
    throw new Error(
      "User ID is required.",
    )
  }

  const cleanTitle =
    cleanText(title)

  return prisma.aiConversation.create({
    data: {
      orgId,
      userId,
      title:
        cleanTitle ||
        DEFAULT_CONVERSATION_TITLE,
      model:
        cleanText(model) || null,
      ...(context !== undefined
        ? { context }
        : {}),
    },
  })
}

/**
 * Get one conversation belonging to the
 * authenticated user and organization.
 *
 * This deliberately checks BOTH orgId and userId
 * to prevent cross-tenant or cross-user access.
 */
export async function getConversation({
  orgId,
  userId,
  conversationId,
  includeMessages = true,
  messageLimit = MAX_MESSAGES,
}: {
  orgId: string
  userId: string
  conversationId: string
  includeMessages?: boolean
  messageLimit?: number
}) {
  if (!orgId) {
    throw new Error(
      "Organization ID is required.",
    )
  }

  if (!userId) {
    throw new Error(
      "User ID is required.",
    )
  }

  if (!conversationId) {
    throw new Error(
      "Conversation ID is required.",
    )
  }

  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
    })

  if (!conversation) {
    return null
  }

  if (!includeMessages) {
    return {
      ...conversation,
      messages: [],
    }
  }

  const limit =
    normalizeLimit(
      messageLimit,
      MAX_MESSAGES,
    )

  const messages =
    await prisma.aiMessage.findMany({
      where: {
        conversationId:
          conversation.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

  return {
    ...conversation,
    messages:
      messages.reverse(),
  }
}

/**
 * List conversations belonging to one user
 * inside one organization.
 *
 * Newest conversations are returned first.
 */
export async function listConversations({
  orgId,
  userId,
  status,
  limit,
}: ListConversationsOptions) {
  if (!orgId) {
    throw new Error(
      "Organization ID is required.",
    )
  }

  if (!userId) {
    throw new Error(
      "User ID is required.",
    )
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      MAX_CONVERSATIONS,
    )

  return prisma.aiConversation.findMany({
    where: {
      orgId,
      userId,
      ...(status
        ? { status }
        : {}),
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: normalizedLimit,
  })
}

/**
 * Get messages for a conversation.
 *
 * The conversation is first verified against
 * both organization and user ownership.
 */
export async function getConversationMessages({
  orgId,
  userId,
  conversationId,
  limit = MAX_MESSAGES,
}: {
  orgId: string
  userId: string
  conversationId: string
  limit?: number
}) {
  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
      },
    })

  if (!conversation) {
    return null
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      MAX_MESSAGES,
    )

  const messages =
    await prisma.aiMessage.findMany({
      where: {
        conversationId:
          conversation.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: normalizedLimit,
    })

  return messages.reverse()
}

/**
 * Add a message to an existing conversation.
 *
 * The conversation must belong to the current
 * organization AND current user.
 */
export async function addMessage({
  orgId,
  userId,
  conversationId,
  role,
  content,
  model,
  inputTokens,
  outputTokens,
  totalTokens,
  metadata,
}: AddMessageInput) {
  if (!orgId) {
    throw new Error(
      "Organization ID is required.",
    )
  }

  if (!userId) {
    throw new Error(
      "User ID is required.",
    )
  }

  if (!conversationId) {
    throw new Error(
      "Conversation ID is required.",
    )
  }

  const cleanContent =
    cleanText(content)

  if (!cleanContent) {
    throw new Error(
      "Message content cannot be empty.",
    )
  }

  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
        status: true,
      },
    })

  if (!conversation) {
    throw new Error(
      "AI conversation not found.",
    )
  }

  if (
    conversation.status ===
    AiConversationStatus.archived
  ) {
    throw new Error(
      "Cannot add messages to an archived conversation.",
    )
  }

  const message =
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role,
        content: cleanContent,
        model:
          cleanText(model) || null,
        inputTokens:
          inputTokens ?? null,
        outputTokens:
          outputTokens ?? null,
        totalTokens:
          totalTokens ?? null,
        ...(metadata !== undefined
          ? { metadata }
          : {}),
      },
    })

  /**
   * AiConversation.updatedAt is maintained by
   * Prisma's @updatedAt behavior.
   *
   * Updating the conversation here ensures that
   * recently active conversations appear first
   * in conversation history.
   */
 await prisma.aiConversation.update({
  where: {
    id: conversationId,
  },
  data: {
    updatedAt: new Date(),
  },
})

  return message
}

/**
 * Rename a conversation.
 */
export async function renameConversation({
  orgId,
  userId,
  conversationId,
  title,
}: {
  orgId: string
  userId: string
  conversationId: string
  title: string
}) {
  const cleanTitle =
    cleanText(title)

  if (!cleanTitle) {
    throw new Error(
      "Conversation title cannot be empty.",
    )
  }

  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
      },
    })

  if (!conversation) {
    throw new Error(
      "AI conversation not found.",
    )
  }

  return prisma.aiConversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      title: cleanTitle.slice(0, 120),
    },
  })
}

/**
 * Archive a conversation.
 *
 * We archive instead of deleting so that
 * conversation history can remain available
 * for future administrative/reporting needs.
 */
export async function archiveConversation({
  orgId,
  userId,
  conversationId,
}: {
  orgId: string
  userId: string
  conversationId: string
}) {
  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
      },
    })

  if (!conversation) {
    throw new Error(
      "AI conversation not found.",
    )
  }

  return prisma.aiConversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      status:
        AiConversationStatus.archived,
    },
  })
}

/**
 * Restore an archived conversation.
 */
export async function restoreConversation({
  orgId,
  userId,
  conversationId,
}: {
  orgId: string
  userId: string
  conversationId: string
}) {
  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
      },
    })

  if (!conversation) {
    throw new Error(
      "AI conversation not found.",
    )
  }

  return prisma.aiConversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      status:
        AiConversationStatus.active,
    },
  })
}

/**
 * Permanently delete a conversation.
 *
 * AiMessage uses ON DELETE CASCADE in the
 * database, so its messages are deleted with it.
 *
 * This function is intentionally separate from
 * archiveConversation so application code must
 * explicitly choose permanent deletion.
 */
export async function deleteConversation({
  orgId,
  userId,
  conversationId,
}: {
  orgId: string
  userId: string
  conversationId: string
}) {
  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
      },
    })

  if (!conversation) {
    throw new Error(
      "AI conversation not found.",
    )
  }

  return prisma.aiConversation.delete({
    where: {
      id: conversation.id,
    },
  })
}

/**
 * Update conversation model.
 *
 * This is useful when the user changes the
 * selected AI model for a conversation.
 */
export async function updateConversationModel({
  orgId,
  userId,
  conversationId,
  model,
}: {
  orgId: string
  userId: string
  conversationId: string
  model: string
}) {
  const cleanModel =
    cleanText(model)

  if (!cleanModel) {
    throw new Error(
      "AI model cannot be empty.",
    )
  }

  const conversation =
    await prisma.aiConversation.findFirst({
      where: {
        id: conversationId,
        orgId,
        userId,
      },
      select: {
        id: true,
      },
    })

  if (!conversation) {
    throw new Error(
      "AI conversation not found.",
    )
  }

  return prisma.aiConversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      model: cleanModel,
    },
  })
}