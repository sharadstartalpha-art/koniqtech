import {
  AiMessageRole,
} from "@prisma/client"

import {
  addMessage,
  createConversation,
  getConversation,
} from "@/shared/lib/ai/conversations"

import {
  getDefaultAiModel,
  runAiCore,
} from "@/shared/lib/ai/core"

const MAX_HISTORY_MESSAGES = 20
const MAX_HISTORY_CONTENT_LENGTH = 4000
const MAX_PROMPT_LENGTH = 4000

export type SendChatMessageInput = {
  orgId: string
  userId: string
  message: string
  conversationId?: string | null
  model?: string | null
}

export type ChatMessage = {
  id: string
  role: AiMessageRole
  content: string
  model: string | null
  inputTokens: number | null
  outputTokens: number | null
  totalTokens: number | null
  createdAt: Date
}

export type SendChatMessageResult = {
  conversation: {
    id: string
    title: string | null
    model: string | null
  }

  userMessage: ChatMessage

  assistantMessage: ChatMessage

  answer: string

  model: string

  inputTokens: number | null

  outputTokens: number | null

  totalTokens: number | null

  estimatedCost: number | null

  requestId: string | null
}

function cleanText(
  value: string | null | undefined,
): string {
  return value?.trim() || ""
}

function sanitizeMessage(
  value: string,
): string {
  return value
    .trim()
    .slice(0, MAX_PROMPT_LENGTH)
}

function truncateHistoryContent(
  value: string,
): string {
  return value
    .trim()
    .slice(
      0,
      MAX_HISTORY_CONTENT_LENGTH,
    )
}

function buildConversationHistory(
  messages: ChatMessage[],
): string {
  if (!messages.length) {
    return ""
  }

  const history =
    messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => {
        const role =
          message.role ===
          AiMessageRole.user
            ? "USER"
            : message.role ===
                AiMessageRole.assistant
              ? "ASSISTANT"
              : message.role.toUpperCase()

        const content =
          truncateHistoryContent(
            message.content,
          )

        return `${role}:\n${content}`
      })
      .join("\n\n")

  return history
}

/**
 * Send a message through the KoniqTech AI
 * conversation pipeline.
 *
 * Flow:
 *
 * Chat UI
 *   ↓
 * sendChatMessage()
 *   ↓
 * conversation lookup/create
 *   ↓
 * previous message history
 *   ↓
 * runAiCore()
 *   ↓
 * save user + assistant messages
 *   ↓
 * return normalized result
 *
 * This layer is intentionally read-only.
 * AI tools/actions will be introduced later.
 */
export async function sendChatMessage({
  orgId,
  userId,
  message,
  conversationId,
  model,
}: SendChatMessageInput): Promise<SendChatMessageResult> {
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

  const question =
    sanitizeMessage(message)

  if (!question) {
    throw new Error(
      "Chat message cannot be empty.",
    )
  }

  const selectedModel =
    cleanText(model) ||
    getDefaultAiModel()

  let conversation

  /**
   * If a conversation ID was supplied, verify
   * that it belongs to this exact organization
   * and user.
   */
  if (conversationId) {
    conversation =
      await getConversation({
        orgId,
        userId,
        conversationId,
        includeMessages: true,
        messageLimit:
          MAX_HISTORY_MESSAGES,
      })

    if (!conversation) {
      throw new Error(
        "AI conversation not found.",
      )
    }

    if (
      conversation.status !==
      "active"
    ) {
      throw new Error(
        "AI conversation is not active.",
      )
    }
  } else {
    /**
     * A new conversation is created only when
     * the caller does not provide one.
     */
    conversation =
      await createConversation({
        orgId,
        userId,
        title:
          createConversationTitle(
            question,
          ),
        model: selectedModel,
      })

    conversation = {
      ...conversation,
      messages: [],
    }
  }

  const existingMessages =
    conversation.messages
      .filter(
        (message) =>
          message.role ===
            AiMessageRole.user ||
          message.role ===
            AiMessageRole.assistant,
      )
      .map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        model: message.model,
        inputTokens:
          message.inputTokens,
        outputTokens:
          message.outputTokens,
        totalTokens:
          message.totalTokens,
        createdAt:
          message.createdAt,
      }))

  const history =
    buildConversationHistory(
      existingMessages,
    )

  const aiPrompt = history
    ? `
CONVERSATION HISTORY
====================

${history}

CURRENT USER QUESTION
=====================

${question}

IMPORTANT:
Answer the CURRENT USER QUESTION.
Use previous conversation messages only
as conversational context.

Do not treat previous assistant statements
as CRM source-of-truth data.

If the CRM context supplied separately
contains the authoritative business data,
prefer that CRM data over assumptions from
conversation history.
`
    : question

  /**
   * Run the actual AI request.
   *
   * core.ts remains responsible for:
   * - CRM context
   * - protected instructions
   * - OpenAI request
   * - token usage
   * - estimated cost
   */
  const aiResult =
    await runAiCore({
      prompt: aiPrompt,
      model: selectedModel,
      orgId,
    })

  /**
   * Persist the user's message first.
   */
  const savedUserMessage =
    await addMessage({
      orgId,
      userId,
      conversationId:
        conversation.id,
      role: AiMessageRole.user,
      content: question,
    })

  /**
   * Persist the AI response together with
   * usage information returned by core.ts.
   */
  const savedAssistantMessage =
    await addMessage({
      orgId,
      userId,
      conversationId:
        conversation.id,
      role:
        AiMessageRole.assistant,
      content: aiResult.answer,
      model: aiResult.model,
      inputTokens:
        aiResult.inputTokens,
      outputTokens:
        aiResult.outputTokens,
      totalTokens:
        aiResult.totalTokens,
      metadata: {
        requestId:
          aiResult.requestId,
        estimatedCost:
          aiResult.estimatedCost,
        feature: "chat",
      },
    })

  return {
    conversation: {
      id: conversation.id,
      title:
        conversation.title,
      model:
        conversation.model ||
        aiResult.model,
    },

    userMessage: {
      id:
        savedUserMessage.id,
      role:
        savedUserMessage.role,
      content:
        savedUserMessage.content,
      model:
        savedUserMessage.model,
      inputTokens:
        savedUserMessage.inputTokens,
      outputTokens:
        savedUserMessage.outputTokens,
      totalTokens:
        savedUserMessage.totalTokens,
      createdAt:
        savedUserMessage.createdAt,
    },

    assistantMessage: {
      id:
        savedAssistantMessage.id,
      role:
        savedAssistantMessage.role,
      content:
        savedAssistantMessage.content,
      model:
        savedAssistantMessage.model,
      inputTokens:
        savedAssistantMessage.inputTokens,
      outputTokens:
        savedAssistantMessage.outputTokens,
      totalTokens:
        savedAssistantMessage.totalTokens,
      createdAt:
        savedAssistantMessage.createdAt,
    },

    answer:
      aiResult.answer,

    model:
      aiResult.model,

    inputTokens:
      aiResult.inputTokens,

    outputTokens:
      aiResult.outputTokens,

    totalTokens:
      aiResult.totalTokens,

    estimatedCost:
      aiResult.estimatedCost,

    requestId:
      aiResult.requestId,
  }
}

/**
 * Generate a useful initial conversation title
 * from the user's first question.
 *
 * This avoids another AI request just to create
 * a title.
 */
function createConversationTitle(
  question: string,
): string {
  const normalized =
    question
      .replace(/\s+/g, " ")
      .trim()

  if (
    normalized.length <= 80
  ) {
    return normalized
  }

  return `${normalized.slice(0, 77)}...`
}

/**
 * Load a conversation specifically for the
 * chat layer.
 *
 * This provides a small public wrapper so API
 * routes do not need to know how conversation
 * storage works internally.
 */
export async function loadChatConversation({
  orgId,
  userId,
  conversationId,
}: {
  orgId: string
  userId: string
  conversationId: string
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
    await getConversation({
      orgId,
      userId,
      conversationId,
      includeMessages: true,
      messageLimit:
        MAX_HISTORY_MESSAGES,
    })

  if (!conversation) {
    return null
  }

  return conversation
}