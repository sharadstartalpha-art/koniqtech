"use client"

import {
  ArrowUp,
  Bot,
  Brain,
  Check,
  Copy,
  Loader2,
  MessageSquare,
  Sparkles,
  User,
  X,
} from "lucide-react"
import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"

type MessageRole = "user" | "assistant"

export type AIChatMessage = {
  id: string
  role: MessageRole
  content: string
  createdAt?: string
}

export type AIChatConversation = {
  id: string
  title: string | null
  model: string | null
  status?: string
  createdAt?: string
  updatedAt?: string
}

type AIUsage = {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  estimatedCost?: number | string | null
}

type AIResponse = {
  success?: boolean
  answer?: string
  text?: string
  conversation?: AIChatConversation
  userMessage?: {
    id: string
    content: string
    createdAt?: string
  }
  assistantMessage?: {
    id: string
    content: string
    createdAt?: string
  }
  model?: string
  usage?: AIUsage
  requestId?: string
  error?: string
}

export type AIChatProps = {
  /**
   * Optional initial conversation.
   * Useful when opening an existing conversation.
   */
  initialConversationId?: string | null

  /**
   * Optional initial messages.
   * Useful when the parent has already loaded conversation history.
   */
  initialMessages?: AIChatMessage[]

  /**
   * Optional callback when a new conversation is created
   * or an existing conversation is updated.
   */
  onConversationChange?: (
    conversation: AIChatConversation,
  ) => void

  /**
   * Optional callback after a completed AI response.
   */
  onResponse?: (data: {
    answer: string
    conversation: AIChatConversation
    usage?: AIUsage
    requestId?: string
  }) => void

  /**
   * Optional className for embedding the component.
   */
  className?: string

  /**
   * Whether to display starter prompts when there
   * are no messages.
   */
  showStarterPrompts?: boolean

  /**
   * Compact mode for embedding inside another page.
   */
  compact?: boolean
}

const MAX_MESSAGE_LENGTH = 4000

const STARTER_PROMPTS = [
  {
    title: "Business overview",
    prompt:
      "Give me a quick overview of my business performance.",
    icon: Brain,
  },
  {
    title: "Overdue invoices",
    prompt:
      "Which invoices are currently overdue?",
    icon: MessageSquare,
  },
  {
    title: "Lead follow-up",
    prompt:
      "Which leads should my sales team follow up with first?",
    icon: User,
  },
  {
    title: "Sales insight",
    prompt:
      "What are the most important sales opportunities I should focus on?",
    icon: Sparkles,
  },
]

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

function formatTime(value?: string) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

function getErrorMessage(data: AIResponse) {
  return (
    data.error ||
    "Unable to process your request. Please try again."
  )
}


function renderInlineMarkdown(text: string) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g,
  )

  return parts.map((part, index) => {
    if (!part) return null

    if (
      part.startsWith("**") &&
      part.endsWith("**") &&
      part.length > 4
    ) {
      return (
        <strong
          key={`bold-${index}`}
          className="font-semibold text-slate-900"
        >
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      !part.startsWith("**") &&
      part.length > 2
    ) {
      return (
        <em key={`italic-${index}`}>
          {part.slice(1, -1)}
        </em>
      )
    }

    if (
      part.startsWith("`") &&
      part.endsWith("`") &&
      part.length > 2
    ) {
      return (
        <code
          key={`code-${index}`}
          className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    return (
      <span key={`text-${index}`}>
        {part}
      </span>
    )
  })
}

function renderMarkdown(content: string) {
  const lines = content.replace(/\r\n/g, "\n").split("\n")

  const elements: ReactNode[] = []
  let bulletItems: string[] = []
  let numberedItems: string[] = []

  function flushLists() {
    if (bulletItems.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="my-3 list-disc space-y-1.5 pl-5"
        >
          {bulletItems.map((item, index) => (
            <li key={`bullet-${index}`} className="pl-1">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>,
      )

      bulletItems = []
    }

    if (numberedItems.length > 0) {
      elements.push(
        <ol
          key={`ol-${elements.length}`}
          className="my-3 list-decimal space-y-1.5 pl-5"
        >
          {numberedItems.map((item, index) => (
            <li key={`number-${index}`} className="pl-1">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>,
      )

      numberedItems = []
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushLists()
      return
    }

    const headingMatch = trimmed.match(
      /^(#{1,6})\s+(.+)$/,
    )

    if (headingMatch) {
      flushLists()

      const level = headingMatch[1].length
      const headingText = headingMatch[2]

      if (level === 1) {
        elements.push(
          <h1
            key={`h1-${index}`}
            className="mb-3 mt-1 text-xl font-bold tracking-tight text-slate-900"
          >
            {renderInlineMarkdown(headingText)}
          </h1>,
        )
      } else if (level === 2) {
        elements.push(
          <h2
            key={`h2-${index}`}
            className="mb-2 mt-1 text-lg font-bold text-slate-900"
          >
            {renderInlineMarkdown(headingText)}
          </h2>,
        )
      } else if (level === 3) {
        elements.push(
          <h3
            key={`h3-${index}`}
            className="mb-2 mt-1 text-base font-bold text-slate-900"
          >
            {renderInlineMarkdown(headingText)}
          </h3>,
        )
      } else {
        elements.push(
          <h4
            key={`h4-${index}`}
            className="mb-2 mt-1 text-sm font-bold text-slate-900"
          >
            {renderInlineMarkdown(headingText)}
          </h4>,
        )
      }

      return
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/)

    if (bulletMatch) {
      if (numberedItems.length > 0) {
        flushLists()
      }

      bulletItems.push(bulletMatch[1])
      return
    }

    const numberedMatch = trimmed.match(
      /^\d+\.\s+(.+)$/,
    )

    if (numberedMatch) {
      if (bulletItems.length > 0) {
        flushLists()
      }

      numberedItems.push(numberedMatch[1])
      return
    }

    flushLists()

    elements.push(
      <p
        key={`p-${index}`}
        className="my-2 leading-6 text-slate-700"
      >
        {renderInlineMarkdown(trimmed)}
      </p>,
    )
  })

  flushLists()

  return elements
}

export default function AIChat({
  initialConversationId = null,
  initialMessages = [],
  onConversationChange,
  onResponse,
  className = "",
  showStarterPrompts = true,
  compact = false,
}: AIChatProps) {
  const [conversationId, setConversationId] =
    useState<string | null>(
      initialConversationId,
    )

  const [messages, setMessages] =
    useState<AIChatMessage[]>(
      initialMessages,
    )

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedMessageId, setCopiedMessageId] =
    useState<string | null>(null)

  const inputRef =
    useRef<HTMLTextAreaElement | null>(null)

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null)

  /*
   * Keep the component synchronized if the parent opens
   * another conversation.
   */
  useEffect(() => {
    setConversationId(
      initialConversationId ?? null,
    )
  }, [initialConversationId])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  /*
   * Scroll to the latest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, loading])

  function resetConversation() {
    setConversationId(null)
    setMessages([])
    setInput("")
    setError("")

    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>,
    presetMessage?: string,
  ) {
    event?.preventDefault()

    const message = (
      presetMessage ?? input
    ).trim()

    if (!message || loading) {
      return
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(
        `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      )
      return
    }

    setError("")

    /*
     * Optimistic user message.
     */
    const optimisticUserMessage: AIChatMessage = {
      id: createLocalId("user"),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    }

    setMessages((current) => [
      ...current,
      optimisticUserMessage,
    ])

    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          ...(conversationId
            ? {
                conversationId,
              }
            : {}),
        }),
      })

      let data: AIResponse

      try {
        data =
          (await response.json()) as AIResponse
      } catch {
        throw new Error(
          "The AI service returned an invalid response.",
        )
      }

      if (!response.ok || !data.success) {
        throw new Error(
          getErrorMessage(data),
        )
      }

      /*
       * The backend creates the conversation on the first
       * message and returns it.
       */
      if (data.conversation?.id) {
        setConversationId(
          data.conversation.id,
        )

        onConversationChange?.(
          data.conversation,
        )
      }

      const answer =
        data.answer ||
        data.text ||
        ""

      if (!answer) {
        throw new Error(
          "The AI service returned an empty response.",
        )
      }

      const assistantMessage: AIChatMessage = {
        id:
          data.assistantMessage?.id ||
          createLocalId("assistant"),
        role: "assistant",
        content: answer,
        createdAt:
          data.assistantMessage?.createdAt ||
          new Date().toISOString(),
      }

      setMessages((current) => [
        ...current,
        assistantMessage,
      ])

      if (data.conversation) {
        onResponse?.({
          answer,
          conversation:
            data.conversation,
          usage: data.usage,
          requestId:
            data.requestId,
        })
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to process your request."

      setError(message)
    } finally {
      setLoading(false)

      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }

  async function copyMessage(
    message: AIChatMessage,
  ) {
    try {
      await navigator.clipboard.writeText(
        message.content,
      )

      setCopiedMessageId(message.id)

      window.setTimeout(() => {
        setCopiedMessageId((current) =>
          current === message.id
            ? null
            : current,
        )
      }, 1800)
    } catch {
      setError(
        "Unable to copy the message.",
      )
    }
  }

  const emptyStateHeight = compact
    ? "min-h-[300px]"
    : "min-h-[calc(100vh-280px)]"

  return (
    <section
      className={`flex min-h-0 flex-1 flex-col bg-slate-50 ${className}`}
    >
      {/* =========================================================
          CHAT HEADER
      ========================================================= */}

      <header
        className={`flex shrink-0 items-center justify-between border-b border-slate-200 bg-white ${
          compact
            ? "h-16 px-4"
            : "h-[72px] px-5 sm:px-8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white ${
              compact
                ? "h-9 w-9"
                : "h-10 w-10"
            }`}
          >
            <Bot
              size={compact ? 18 : 20}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2
                className={`truncate font-bold text-slate-900 ${
                  compact
                    ? "text-sm"
                    : "text-base"
                }`}
              >
                KoniqTech AI
              </h2>

              <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 sm:inline-flex">
                Online
              </span>
            </div>

            <p className="truncate text-xs text-slate-400">
              CRM intelligence assistant
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={resetConversation}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            New chat
          </button>
        )}
      </header>

      {/* =========================================================
          CHAT CONTENT
      ========================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div
          className={`mx-auto flex w-full max-w-4xl flex-col px-4 py-6 sm:px-6 ${
            compact
              ? ""
              : "lg:px-8"
          }`}
        >
          {messages.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center ${
                emptyStateHeight
              }`}
            >
              <div
                className={`mb-5 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 ${
                  compact
                    ? "h-12 w-12"
                    : "h-16 w-16"
                }`}
              >
                <Brain
                  size={compact ? 24 : 30}
                />
              </div>

              <h3
                className={`text-center font-bold tracking-tight text-slate-900 ${
                  compact
                    ? "text-xl"
                    : "text-2xl sm:text-3xl"
                }`}
              >
                How can I help?
              </h3>

              <p
                className={`mt-3 max-w-xl text-center leading-6 text-slate-500 ${
                  compact
                    ? "text-xs"
                    : "text-sm sm:text-base"
                }`}
              >
                Ask about your leads, customers,
                jobs, invoices, sales pipeline,
                or business performance.
              </p>

              {showStarterPrompts && (
                <div
                  className={`mt-7 grid w-full max-w-2xl gap-3 ${
                    compact
                      ? "grid-cols-1"
                      : "sm:grid-cols-2"
                  }`}
                >
                  {STARTER_PROMPTS.map(
                    ({
                      title,
                      prompt,
                      icon: Icon,
                    }) => (
                      <button
                        key={title}
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          void sendMessage(
                            undefined,
                            prompt,
                          )
                        }
                        className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
                            <Icon size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              {title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              {prompt}
                            </p>
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-7">
              {messages.map(
                (message) => {
                  const isUser =
                    message.role ===
                    "user"

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 sm:gap-4 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                          <Bot size={17} />
                        </div>
                      )}

                      <div
                        className={`flex max-w-[88%] flex-col sm:max-w-[78%] ${
                          isUser
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                            isUser
                              ? "rounded-br-md bg-slate-900 text-white"
                              : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                          }`}
                        >
                          <div className="break-words">
  {isUser ? (
    <div className="whitespace-pre-wrap">
      {message.content}
    </div>
  ) : (
    <div className="space-y-1">
      {renderMarkdown(message.content)}
    </div>
  )}
</div>
                        </div>

                        <div
                          className={`mt-2 flex items-center gap-2 ${
                            isUser
                              ? "flex-row-reverse"
                              : ""
                          }`}
                        >
                          {message.createdAt && (
                            <span className="text-[11px] text-slate-400">
                              {formatTime(
                                message.createdAt,
                              )}
                            </span>
                          )}

                          {!isUser && (
                            <button
                              type="button"
                              onClick={() =>
                                void copyMessage(
                                  message,
                                )
                              }
                              title="Copy response"
                              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                              {copiedMessageId ===
                              message.id ? (
                                <Check
                                  size={14}
                                />
                              ) : (
                                <Copy
                                  size={14}
                                />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
                          <User size={17} />
                        </div>
                      )}
                    </div>
                  )
                },
              )}

              {loading && (
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Bot size={17} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          ERROR
      ========================================================= */}

      {error && (
        <div
          className={`mx-auto w-full max-w-4xl px-4 sm:px-6 ${
            compact
              ? ""
              : "lg:px-8"
          }`}
        >
          <div className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X
              size={17}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              {error}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 rounded p-0.5 hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          COMPOSER
      ========================================================= */}

      <div
        className={`shrink-0 border-t border-slate-200 bg-white px-4 pb-4 pt-3 sm:px-6 ${
          compact
            ? ""
            : "lg:px-8"
        }`}
      >
        <form
          onSubmit={(event) =>
            void sendMessage(event)
          }
          className="mx-auto w-full max-w-4xl"
        >
          <div className="relative rounded-2xl border border-slate-300 bg-white shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault()

                  if (
                    input.trim() &&
                    !loading
                  ) {
                    void sendMessage()
                  }
                }
              }}
              placeholder="Ask KoniqTech AI anything about your CRM..."
              rows={1}
              maxLength={
                MAX_MESSAGE_LENGTH
              }
              disabled={loading}
              className="min-h-[56px] w-full resize-none bg-transparent px-4 pb-12 pt-4 pr-14 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Enter to send • Shift + Enter
                for new line
              </span>

              <button
                type="submit"
                disabled={
                  loading ||
                  !input.trim()
                }
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {loading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowUp size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[11px] text-slate-400">
              KoniqTech AI uses your CRM data
              to provide business insights.
            </p>

            <p className="hidden text-[11px] text-slate-400 sm:block">
              {input.length}/
              {MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}