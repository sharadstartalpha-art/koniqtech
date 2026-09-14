"use client"

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type AgentStatus =
  | "draft"
  | "active"
  | "inactive"

type AgentTool = {
  id: string
  name: string
  description: string
  type: string
  enabled: boolean
  requiresApproval: boolean
}

type Agent = {
  id: string
  name: string
  slug: string
  description: string | null
  instructions: string | null
  model: string
  status: AgentStatus
  temperature: number | null
  maxTokens: number | null
  requiresApproval: boolean
  canAct: boolean
  config: unknown
  createdAt: string
  updatedAt: string
  tools: AgentTool[]
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  agents?: Agent[]
  agent?: Agent
}

const DEFAULT_MODEL = "gpt-5.6-luna"

const STATUS_LABELS: Record<
  AgentStatus,
  string
> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
}

function getErrorMessage(
  data: ApiResponse | null,
  fallback: string,
) {
  return (
    data?.error ||
    data?.message ||
    fallback
  )
}

function formatDate(
  value: string,
) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleString()
}

function normalizeAgent(
  agent: Agent,
): Agent {
  return {
    ...agent,
    description:
      agent.description ?? null,
    instructions:
      agent.instructions ?? null,
    model:
      agent.model || DEFAULT_MODEL,
    temperature:
      typeof agent.temperature === "number"
        ? agent.temperature
        : null,
    maxTokens:
      typeof agent.maxTokens === "number"
        ? agent.maxTokens
        : null,
    requiresApproval:
      Boolean(agent.requiresApproval),
    canAct:
      Boolean(agent.canAct),
    tools:
      Array.isArray(agent.tools)
        ? agent.tools
        : [],
  }
}

export default function AiAgentsPage() {
  const [agents, setAgents] =
    useState<Agent[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [showCreate, setShowCreate] =
    useState(false)

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<"all" | AgentStatus>("all")

  const [name, setName] =
    useState("")

  const [slug, setSlug] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [instructions, setInstructions] =
    useState("")

  const [model, setModel] =
    useState(DEFAULT_MODEL)

  const [temperature, setTemperature] =
    useState("0.2")

  const [maxTokens, setMaxTokens] =
    useState("2000")

  const [requiresApproval, setRequiresApproval] =
    useState(true)

  const [canAct, setCanAct] =
    useState(false)

  const loadAgents = useCallback(
    async () => {
      setLoading(true)
      setError("")

      try {
        const response =
          await fetch(
            "/api/ai/agents?limit=100",
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
            getErrorMessage(
              data,
              "Unable to load AI agents.",
            ),
          )
        }

        setAgents(
          Array.isArray(data.agents)
            ? data.agents.map(
                normalizeAgent,
              )
            : [],
        )
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load AI agents.",
        )
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void loadAgents()
  }, [loadAgents])

  const filteredAgents =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase()

      return agents.filter(
        (agent) => {
          const matchesSearch =
            !normalizedSearch ||
            agent.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            agent.slug
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            (
              agent.description || ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch,
              )

          const matchesStatus =
            statusFilter === "all" ||
            agent.status === statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        },
      )
    }, [
      agents,
      search,
      statusFilter,
    ])

  const statistics =
    useMemo(() => {
      return {
        total: agents.length,
        active: agents.filter(
          (agent) =>
            agent.status === "active",
        ).length,
        drafts: agents.filter(
          (agent) =>
            agent.status === "draft",
        ).length,
        acting: agents.filter(
          (agent) => agent.canAct,
        ).length,
      }
    }, [agents])

  function resetForm() {
    setName("")
    setSlug("")
    setDescription("")
    setInstructions("")
    setModel(DEFAULT_MODEL)
    setTemperature("0.2")
    setMaxTokens("2000")
    setRequiresApproval(true)
    setCanAct(false)
  }

  function closeCreate() {
    if (saving) {
      return
    }

    setShowCreate(false)
    resetForm()
  }

  function createSlug(
    value: string,
  ) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(
        /^-+|-+$/g,
        "",
      )
  }

  function handleNameChange(
    value: string,
  ) {
    setName(value)

    if (!slug) {
      setSlug(createSlug(value))
    }
  }

  async function createAgent(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (saving) {
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const normalizedName =
        name.trim()

      const normalizedSlug =
        createSlug(slug)

      if (!normalizedName) {
        throw new Error(
          "Agent name is required.",
        )
      }

      if (!normalizedSlug) {
        throw new Error(
          "A valid agent slug is required.",
        )
      }

      const parsedTemperature =
        Number(temperature)

      const parsedMaxTokens =
        Number(maxTokens)

      if (
        !Number.isFinite(
          parsedTemperature,
        ) ||
        parsedTemperature < 0 ||
        parsedTemperature > 2
      ) {
        throw new Error(
          "Temperature must be between 0 and 2.",
        )
      }

      if (
        !Number.isFinite(
          parsedMaxTokens,
        ) ||
        parsedMaxTokens < 1
      ) {
        throw new Error(
          "Max tokens must be a positive number.",
        )
      }

      /*
       * Safety:
       * Agents that can act must retain
       * approval by default.
       */
      const finalRequiresApproval =
        canAct
          ? true
          : requiresApproval

      const response =
        await fetch(
          "/api/ai/agents",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name:
                normalizedName,
              slug:
                normalizedSlug,
              description:
                description.trim() ||
                null,
              instructions:
                instructions.trim() ||
                null,
              model:
                model.trim() ||
                DEFAULT_MODEL,
              status:
                "draft",
              temperature:
                parsedTemperature,
              maxTokens:
                Math.floor(
                  parsedMaxTokens,
                ),
              requiresApproval:
                finalRequiresApproval,
              canAct,
              config: {},
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
          getErrorMessage(
            data,
            "Unable to create AI agent.",
          ),
        )
      }

      setSuccess(
        "AI agent created successfully.",
      )

      setShowCreate(false)
      resetForm()

      await loadAgents()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create AI agent.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteAgent(
    agent: Agent,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${agent.name}"? This will also remove its configured tools.`,
      )

    if (!confirmed) {
      return
    }

    setDeletingId(agent.id)
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/agents/${encodeURIComponent(
            agent.id,
          )}`,
          {
            method: "DELETE",
          },
        )

      const data =
        (await response.json()) as ApiResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to delete AI agent.",
          ),
        )
      }

      setSuccess(
        "AI agent deleted successfully.",
      )

      await loadAgents()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to delete AI agent.",
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white">
                ✦
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                AI Platform
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              AI Agents
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Create specialized AI assistants
              for your organization. Configure
              their instructions, model, tools,
              permissions, and approval behavior.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("")
              setSuccess("")
              setShowCreate(true)
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Create AI Agent
          </button>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Agents
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {statistics.total}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {statistics.active}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Drafts
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {statistics.drafts}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Acting Agents
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {statistics.acting}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your AI Agents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Organization-scoped agents and their
              configured tools.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search agents..."
              className="rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | AgentStatus,
                )
              }
              className="rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ✦
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No AI agents found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {agents.length === 0
                  ? "Create your first AI agent to start building specialized assistants."
                  : "Try changing your search or status filter."}
              </p>

              {agents.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setError("")
                    setSuccess("")
                    setShowCreate(true)
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                >
                  Create Your First Agent
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAgents.map(
                (agent) => (
                  <article
                    key={agent.id}
                    className="rounded-2xl border p-5 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {agent.name}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              agent.status ===
                              "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : agent.status ===
                                    "draft"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {
                              STATUS_LABELS[
                                agent.status
                              ]
                            }
                          </span>

                          {agent.canAct && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              Can Act
                            </span>
                          )}

                          {agent.requiresApproval && (
                            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                              Approval Required
                            </span>
                          )}
                        </div>

                        <p className="mt-1 font-mono text-xs text-slate-400">
                          {agent.slug}
                        </p>

                        {agent.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                            {agent.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-600">
                            Model:{" "}
                            <strong>
                              {agent.model}
                            </strong>
                          </span>

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-600">
                            Tools:{" "}
                            <strong>
                              {agent.tools.length}
                            </strong>
                          </span>

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-600">
                            Updated:{" "}
                            <strong>
                              {formatDate(
                                agent.updatedAt,
                              )}
                            </strong>
                          </span>
                        </div>

                        {agent.tools.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Configured tools
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {agent.tools
                                .slice(0, 8)
                                .map(
                                  (
                                    tool,
                                  ) => (
                                    <span
                                      key={
                                        tool.id
                                      }
                                      className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                                        tool.enabled
                                          ? "bg-white text-slate-700"
                                          : "bg-slate-50 text-slate-400"
                                      }`}
                                    >
                                      {
                                        tool.name
                                      }
                                    </span>
                                  ),
                                )}

                              {agent.tools.length >
                                8 && (
                                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-500">
                                  +
                                  {agent
                                    .tools
                                    .length -
                                    8}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <a
                          href={`/ai/agents/${encodeURIComponent(
                            agent.id,
                          )}`}
                          className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Manage
                        </a>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            agent.id
                          }
                          onClick={() =>
                            void deleteAgent(
                              agent,
                            )
                          }
                          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          agent.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-agent-title"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="create-agent-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  Create AI Agent
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Start with a draft. Tools and
                  advanced permissions can be
                  configured after creation.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreate}
                disabled={saving}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={createAgent}
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="agent-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Agent Name
                  </label>

                  <input
                    id="agent-name"
                    value={name}
                    onChange={(event) =>
                      handleNameChange(
                        event.target.value,
                      )
                    }
                    required
                    maxLength={100}
                    placeholder="Sales Assistant"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="agent-slug"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Slug
                  </label>

                  <input
                    id="agent-slug"
                    value={slug}
                    onChange={(event) =>
                      setSlug(
                        createSlug(
                          event.target.value,
                        ),
                      )
                    }
                    required
                    maxLength={100}
                    placeholder="sales-assistant"
                    className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="agent-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="agent-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={3}
                  maxLength={1000}
                  placeholder="Helps the sales team review leads, customers, and opportunities."
                  className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="agent-instructions"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Agent Instructions
                </label>

                <textarea
                  id="agent-instructions"
                  value={instructions}
                  onChange={(event) =>
                    setInstructions(
                      event.target.value,
                    )
                  }
                  rows={6}
                  maxLength={12000}
                  placeholder="Define how this agent should behave, what it should prioritize, and what it should never do."
                  className="w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Keep instructions focused on the
                  agent's business responsibility.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="agent-model"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Model
                  </label>

                  <select
                    id="agent-model"
                    value={model}
                    onChange={(event) =>
                      setModel(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="gpt-5.6-luna">
                      GPT-5.6 Luna
                    </option>

                    <option value="gpt-5.6-terra">
                      GPT-5.6 Terra
                    </option>

                    <option value="gpt-5.6-sol">
                      GPT-5.6 Sol
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="agent-temperature"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Temperature
                  </label>

                  <input
                    id="agent-temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(event) =>
                      setTemperature(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="agent-max-tokens"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Max Output Tokens
                  </label>

                  <input
                    id="agent-max-tokens"
                    type="number"
                    min="1"
                    max="200000"
                    step="1"
                    value={maxTokens}
                    onChange={(event) =>
                      setMaxTokens(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">
                  Safety & Permissions
                </h3>

                <div className="mt-4 space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={
                        requiresApproval
                      }
                      disabled={canAct}
                      onChange={(event) =>
                        setRequiresApproval(
                          event.target
                            .checked,
                        )
                      }
                      className="mt-1 h-4 w-4 rounded"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Require approval for
                        actions
                      </span>

                      <span className="block text-xs leading-5 text-slate-500">
                        Acting tools should normally
                        require explicit approval.
                      </span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={canAct}
                      onChange={(event) =>
                        setCanAct(
                          event.target
                            .checked,
                        )
                      }
                      className="mt-1 h-4 w-4 rounded"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Allow this agent to act
                      </span>

                      <span className="block text-xs leading-5 text-slate-500">
                        Enable this only when the agent
                        needs tools capable of changing
                        CRM data or performing external
                        actions.
                      </span>
                    </span>
                  </label>
                </div>

                {canAct && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    Approval is automatically required
                    for acting agents during creation.
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreate}
                  disabled={saving}
                  className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {saving
                    ? "Creating..."
                    : "Create Draft Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}