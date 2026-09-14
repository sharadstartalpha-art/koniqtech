"use client"

import {
  ArrowUp,
  Bot,
  Brain,
  Check,
  Clipboard,
  Clock3,
  Copy,
  Loader2,
  MessageSquare,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react"
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type MessageRole = "user" | "assistant"

type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  createdAt?: string
}

type Conversation = {
  id: string
  title: string | null
  model: string | null
  status?: string
  createdAt?: string
  updatedAt?: string
}

type ApiResponse = {
  success?: boolean
  answer?: string
  text?: string
  conversation?: Conversation
  conversations?: Conversation[]
  messages?: ChatMessage[]
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
  usage?: {
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
    estimatedCost?: number | string | null
  }
  requestId?: string
  error?: string
}

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
    icon: Clock3,
  },
  {
    title: "Lead follow-up",
    prompt:
      "Which leads should my sales team follow up with first?",
    icon: MessageSquare,
  },
  {
    title: "Sales insight",
    prompt:
      "What are the most important sales opportunities I should focus on?",
    icon: Sparkles,
  },
]

const MAX_MESSAGE_LENGTH = 4000

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

function formatConversationTitle(
  title: string | null,
) {
  if (!title?.trim()) {
    return "New conversation"
  }

  return title.length > 34
    ? `${title.slice(0, 34)}…`
    : title
}

function getErrorMessage(
  data: ApiResponse,
) {
  return (
    data.error ||
    "Unable to process your request. Please try again."
  )
}

function normalizeConversation(
  value: unknown,
): Conversation | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null
  }

  const item =
    value as Record<string, unknown>

  if (
    typeof item.id !== "string"
  ) {
    return null
  }

  return {
    id: item.id,
    title:
      typeof item.title === "string"
        ? item.title
        : null,
    model:
      typeof item.model === "string"
        ? item.model
        : null,
    status:
      typeof item.status === "string"
        ? item.status
        : undefined,
    createdAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : undefined,
    updatedAt:
      typeof item.updatedAt === "string"
        ? item.updatedAt
        : undefined,
  }
}

function normalizeMessage(
  value: unknown,
): ChatMessage | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null
  }

  const item =
    value as Record<string, unknown>

  if (
    typeof item.id !== "string" ||
    typeof item.content !== "string"
  ) {
    return null
  }

  const role =
    item.role === "user" ||
    item.role === "assistant"
      ? item.role
      : null

  if (!role) {
    return null
  }

  return {
    id: item.id,
    role,
    content: item.content,
    createdAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : undefined,
  }
}

export default function AIPage() {
  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([])

  const [
    conversations,
    setConversations,
  ] = useState<Conversation[]>([])

  const [
    conversationId,
    setConversationId,
  ] = useState<string | null>(null)

  const [
    input,
    setInput,
  ] = useState("")

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    loadingConversations,
    setLoadingConversations,
  ] = useState(true)

  const [
    loadingConversation,
    setLoadingConversation,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")

  const [
    copiedMessageId,
    setCopiedMessageId,
  ] = useState<string | null>(null)

  const inputRef =
    useRef<HTMLTextAreaElement | null>(
      null,
    )

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const currentConversation =
    useMemo(
      () =>
        conversations.find(
          (conversation) =>
            conversation.id ===
            conversationId,
        ) ?? null,
      [
        conversations,
        conversationId,
      ],
    )

  useEffect(() => {
    void loadConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
        block: "end",
      },
    )
  }, [
    messages,
    loading,
  ])

  async function loadConversations() {
  setLoadingConversations(true)
  setError("")

  try {
    const response = await fetch(
      "/api/ai/conversations",
      {
        method: "GET",
        cache: "no-store",
      },
    )

    const data =
      (await response.json()) as ApiResponse

    if (!response.ok || !data.success) {
      throw new Error(
        getErrorMessage(data),
      )
    }

    const normalized =
      Array.isArray(data.conversations)
        ? data.conversations
            .map(normalizeConversation)
            .filter(
              (
                item,
              ): item is Conversation =>
                item !== null,
            )
        : []

    setConversations(normalized)
  } catch (requestError) {
    setConversations([])

    setError(
      requestError instanceof Error
        ? requestError.message
        : "Unable to load conversations.",
    )
  } finally {
    setLoadingConversations(false)
  }
}

  async function loadConversation(
    id: string,
  ) {
    setLoadingConversation(true)
    setError("")

    try {
      const response =
        await fetch(
          `/api/ai/conversations/${encodeURIComponent(
            id,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        )

      const data =
        (await response.json()) as ApiResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(data),
        )
      }

      const loadedMessages =
        Array.isArray(
          data.messages,
        )
          ? data.messages
              .map(
                normalizeMessage,
              )
              .filter(
                (
                  item,
                ): item is ChatMessage =>
                  item !== null,
              )
          : []

      const loadedConversation =
        normalizeConversation(
          data.conversation,
        )

      if (
        loadedConversation
      ) {
        setConversations(
          (current) => {
            const exists =
              current.some(
                (
                  conversation,
                ) =>
                  conversation.id ===
                  loadedConversation.id,
              )

            if (exists) {
              return current.map(
                (
                  conversation,
                ) =>
                  conversation.id ===
                  loadedConversation.id
                    ? loadedConversation
                    : conversation,
              )
            }

            return [
              loadedConversation,
              ...current,
            ]
          },
        )
      }

      setConversationId(id)
      setMessages(
        loadedMessages,
      )
    } catch (requestError) {
  setError(
    requestError instanceof Error
      ? requestError.message
      : "Unable to load this conversation.",
  )
    } finally {
      setLoadingConversation(false)

      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }

  function startNewConversation() {
    setConversationId(null)
    setMessages([])
    setInput("")
    setError("")

    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  function selectConversation(
    id: string,
  ) {
    if (
      loadingConversation ||
      loading
    ) {
      return
    }

    if (id === conversationId) {
      return
    }

    setMessages([])
    void loadConversation(id)
  }

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>,
    presetMessage?: string,
  ) {
    event?.preventDefault()

    const message =
      (
        presetMessage ??
        input
      ).trim()

    if (
      !message ||
      loading ||
      loadingConversation
    ) {
      return
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
      setError(
        `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      )
      return
    }

    setError("")

    const optimisticUserMessage:
      ChatMessage = {
      id: createLocalId(
        "user",
      ),
      role: "user",
      content: message,
      createdAt:
        new Date().toISOString(),
    }

    const optimisticAssistantMessage:
      ChatMessage = {
      id: createLocalId(
        "assistant",
      ),
      role: "assistant",
      content: "",
      createdAt:
        new Date().toISOString(),
    }

    setMessages(
      (current) => [
        ...current,
        optimisticUserMessage,
        optimisticAssistantMessage,
      ],
    )

    setInput("")
    setLoading(true)

    try {
      const response =
        await fetch(
          "/api/ai",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message,
              ...(conversationId
                ? {
                    conversationId,
                  }
                : {}),
            }),
          },
        )

      const data =
        (await response.json()) as ApiResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(data),
        )
      }

      if (
        data.conversation?.id
      ) {
        const normalizedConversation =
          normalizeConversation(
            data.conversation,
          )

        if (
          normalizedConversation
        ) {
          setConversationId(
            normalizedConversation.id,
          )

          setConversations(
            (current) => {
              const existingIndex =
                current.findIndex(
                  (
                    conversation,
                  ) =>
                    conversation.id ===
                    normalizedConversation.id,
                )

              if (
                existingIndex ===
                -1
              ) {
                return [
                  normalizedConversation,
                  ...current,
                ]
              }

              const updated = [
                ...current,
              ]

              updated[
                existingIndex
              ] =
                normalizedConversation

              return updated.sort(
                (
                  a,
                  b,
                ) => {
                  const aTime =
                    a.updatedAt ??
                    a.createdAt ??
                    ""

                  const bTime =
                    b.updatedAt ??
                    b.createdAt ??
                    ""

                  return (
                    bTime.localeCompare(
                      aTime,
                    )
                  )
                },
              )
            },
          )
        }
      }

      const answer =
        data.answer ||
        data.text ||
        data.assistantMessage
          ?.content ||
        ""

      if (!answer) {
        throw new Error(
          "The AI returned an empty response.",
        )
      }

      const assistantId =
        data.assistantMessage
          ?.id ||
        optimisticAssistantMessage.id

      setMessages(
        (current) => {
          const updated = [
            ...current,
          ]

          const assistantIndex =
            updated.findIndex(
              (item) =>
                item.id ===
                optimisticAssistantMessage.id,
            )

          if (
            assistantIndex !==
            -1
          ) {
            updated[
              assistantIndex
            ] = {
              id: assistantId,
              role: "assistant",
              content: answer,
              createdAt:
                data
                  .assistantMessage
                  ?.createdAt ||
                new Date().toISOString(),
            }
          }

          return updated
        },
      )

      /*
       * Refresh the conversation list after
       * every successful message so a newly
       * created conversation and updated title
       * appear immediately in the sidebar.
       */
      void loadConversations()
   } catch (requestError) {
  setMessages(
    (current) =>
      current.filter(
        (item) =>
          item.id !==
            optimisticUserMessage.id &&
          item.id !==
            optimisticAssistantMessage.id,
      ),
  )

  setError(
    requestError instanceof Error
      ? requestError.message
      : "Unable to process your request.",
  )
} finally {
  setLoading(false)

  requestAnimationFrame(() => {
    inputRef.current?.focus()
  })
}
  }

  async function copyMessage(
    message: ChatMessage,
  ) {
    try {
      await navigator.clipboard.writeText(
        message.content,
      )

      setCopiedMessageId(
        message.id,
      )

      window.setTimeout(
        () => {
          setCopiedMessageId(
            (current) =>
              current ===
              message.id
                ? null
                : current,
          )
        },
        1800,
      )
    } catch {
      setError(
        "Unable to copy the message.",
      )
    }
  }

  return (
    <main className="flex h-[calc(100vh-0px)] min-h-[680px] overflow-hidden bg-slate-50 text-slate-900">
      {/* =========================================================
          LEFT SIDEBAR
      ========================================================= */}

      <aside className="hidden w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 p-5">
          <button
            type="button"
            onClick={
              startNewConversation
            }
            disabled={
              loadingConversation
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={18} />
            New conversation
          </button>
        </div>

        <div className="px-5 pb-3 pt-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Clock3 size={14} />
            Recent conversations
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2
                size={20}
                className="animate-spin"
              />
            </div>
          ) : conversations.length ===
            0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare
                size={24}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="text-sm font-medium text-slate-500">
                No conversations yet
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Your AI conversations
                will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map(
                (
                  conversation,
                ) => {
                  const active =
                    conversation.id ===
                    conversationId

                  return (
                    <button
                      key={
                        conversation.id
                      }
                      type="button"
                      onClick={() =>
                        selectConversation(
                          conversation.id,
                        )
                      }
                      disabled={
                        loadingConversation
                      }
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      } ${
                        loadingConversation
                          ? "cursor-wait"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare
                          size={17}
                          className={`mt-0.5 shrink-0 ${
                            active
                              ? "text-slate-700"
                              : "text-slate-400"
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {formatConversationTitle(
                              conversation.title,
                            )}
                          </p>

                          {conversation.updatedAt && (
                            <p className="mt-1 text-xs text-slate-400">
                              {formatTime(
                                conversation.updatedAt,
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Sparkles
                  size={16}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  KoniqTech AI
                </p>

                <p className="text-xs text-slate-400">
                  CRM intelligence
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN CHAT
      ========================================================= */}

      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}

        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Bot size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold text-slate-900">
                  AI Assistant
                </h1>

                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 sm:inline-flex">
                  Online
                </span>
              </div>

              <p className="truncate text-xs text-slate-400">
                Ask questions about
                your CRM
                {currentConversation?.model
                  ? ` • ${currentConversation.model}`
                  : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              startNewConversation
            }
            disabled={
              loadingConversation
            }
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
          >
            <Plus size={16} />

            <span className="hidden sm:inline">
              New
            </span>
          </button>
        </header>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
            {loadingConversation ? (
              <div className="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center">
                <Loader2
                  size={28}
                  className="animate-spin text-slate-400"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Loading conversation…
                </p>
              </div>
            ) : messages.length ===
              0 ? (
              <div className="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                  <Brain size={30} />
                </div>

                <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  How can I help?
                </h2>

                <p className="mt-3 max-w-xl text-center text-sm leading-6 text-slate-500 sm:text-base">
                  Ask KoniqTech AI about
                  your leads, customers,
                  jobs, invoices, sales
                  pipeline, or overall
                  business performance.
                </p>

                <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {STARTER_PROMPTS.map(
                    ({
                      title,
                      prompt,
                      icon: Icon,
                    }) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() =>
                          void sendMessage(
                            undefined,
                            prompt,
                          )
                        }
                        disabled={
                          loading
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
                            <Bot
                              size={17}
                            />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] sm:max-w-[78%] ${
                            isUser
                              ? "items-end"
                              : "items-start"
                          } flex flex-col`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                              isUser
                                ? "rounded-br-md bg-slate-900 text-white"
                                : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {message.content ||
                                "Thinking…"}
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

                            {!isUser &&
                              message.content && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void copyMessage(
                                      message,
                                    )
                                  }
                                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                  title="Copy response"
                                >
                                  {copiedMessageId ===
                                  message.id ? (
                                    <Check
                                      size={
                                        14
                                      }
                                    />
                                  ) : (
                                    <Copy
                                      size={
                                        14
                                      }
                                    />
                                  )}
                                </button>
                              )}
                          </div>
                        </div>

                        {isUser && (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
                            <User
                              size={17}
                            />
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

                <div
                  ref={messagesEndRef}
                />
              </div>
            )}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
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
                onClick={() =>
                  setError("")
                }
                className="shrink-0 rounded p-0.5 hover:bg-red-100"
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Composer */}

        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-4 sm:px-6 lg:px-8">
          <form
            onSubmit={sendMessage}
            className="mx-auto w-full max-w-4xl"
          >
            <div className="relative rounded-2xl border border-slate-300 bg-white shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(
                  event,
                ) =>
                  setInput(
                    event.target.value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault()

                    if (
                      input.trim() &&
                      !loading &&
                      !loadingConversation
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
                disabled={
                  loading ||
                  loadingConversation
                }
                className="min-h-[56px] w-full resize-none bg-transparent px-4 pb-12 pt-4 pr-14 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Enter to send • Shift +
                  Enter for new line
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingConversation ||
                    !input.trim()
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowUp
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
              <p className="text-[11px] text-slate-400">
                KoniqTech AI uses your
                CRM data to provide
                business insights.
              </p>

              <p className="hidden text-[11px] text-slate-400 sm:block">
                {input.length}/
                {MAX_MESSAGE_LENGTH}
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}