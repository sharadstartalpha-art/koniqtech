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

type AiAgent = {
  id: string
  orgId: string
  name: string
  slug: string
  description: string | null
  instructions: string
  model: string
  status: AgentStatus
  temperature: number | null
  maxTokens: number | null
  requiresApproval: boolean
  canAct: boolean
  config: unknown
  createdById: string | null
  createdAt: string
  updatedAt: string
  tools?: AgentTool[]
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  agents?: AiAgent[]
  agent?: AiAgent
}

const STATUS_LABELS: Record<
  AgentStatus,
  string
> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
}

const STATUS_CLASSES: Record<
  AgentStatus,
  string
> = {
  draft:
    "bg-amber-100 text-amber-700",
  active:
    "bg-emerald-100 text-emerald-700",
  inactive:
    "bg-slate-100 text-slate-600",
}

const MODELS = [
  {
    value: "gpt-5.6-luna",
    label: "GPT-5.6 Luna",
  },
  {
    value: "gpt-5.6-terra",
    label: "GPT-5.6 Terra",
  },
  {
    value: "gpt-5.6-sol",
    label: "GPT-5.6 Sol",
  },
]

function formatDate(
  value: string,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—"
  }

  return date.toLocaleString()
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

function slugify(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .slice(0, 100)
}

export default function AiAgentsPage() {
  const [agents, setAgents] =
    useState<AiAgent[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const [statusUpdatingId, setStatusUpdatingId] =
    useState<string | null>(null)

  const [selectedAgent, setSelectedAgent] =
    useState<AiAgent | null>(null)

  const [showForm, setShowForm] =
    useState(false)

  const [editingAgent, setEditingAgent] =
    useState<AiAgent | null>(null)

  const [name, setName] =
    useState("")

  const [slug, setSlug] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [instructions, setInstructions] =
    useState("")

  const [model, setModel] =
    useState("gpt-5.6-luna")

  const [status, setStatus] =
    useState<AgentStatus>("draft")

  const [temperature, setTemperature] =
    useState("0.2")

  const [maxTokens, setMaxTokens] =
    useState("2000")

  const [requiresApproval, setRequiresApproval] =
    useState(true)

  const [canAct, setCanAct] =
    useState(false)

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | AgentStatus
    >("all")

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const loadAgents =
    useCallback(
      async () => {
        setLoading(true)
        setError("")

        try {
          const query =
            statusFilter ===
            "all"
              ? ""
              : `?status=${encodeURIComponent(
                  statusFilter,
                )}`

          const response =
            await fetch(
              `/api/ai/agents${query}`,
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
            Array.isArray(
              data.agents,
            )
              ? data.agents
              : [],
          )
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI agents.",
          )
        } finally {
          setLoading(false)
        }
      },
      [statusFilter],
    )

  useEffect(() => {
    void loadAgents()
  }, [loadAgents])

  const counts =
    useMemo(
      () => ({
        total:
          agents.length,

        active:
          agents.filter(
            (agent) =>
              agent.status ===
              "active",
          ).length,

        draft:
          agents.filter(
            (agent) =>
              agent.status ===
              "draft",
          ).length,

        inactive:
          agents.filter(
            (agent) =>
              agent.status ===
              "inactive",
          ).length,

        acting:
          agents.filter(
            (agent) =>
              agent.canAct,
          ).length,
      }),
      [agents],
    )

  function resetForm() {
    setName("")
    setSlug("")
    setDescription("")
    setInstructions("")
    setModel("gpt-5.6-luna")
    setStatus("draft")
    setTemperature("0.2")
    setMaxTokens("2000")
    setRequiresApproval(true)
    setCanAct(false)
    setEditingAgent(null)
  }

  function openCreateForm() {
    resetForm()
    setError("")
    setSuccess("")
    setShowForm(true)
  }

  function openEditForm(
    agent: AiAgent,
  ) {
    setEditingAgent(agent)

    setName(agent.name)
    setSlug(agent.slug)
    setDescription(
      agent.description ||
        "",
    )
    setInstructions(
      agent.instructions,
    )
    setModel(
      agent.model ||
        "gpt-5.6-luna",
    )
    setStatus(
      agent.status,
    )
    setTemperature(
      agent.temperature !==
        null
        ? String(
            agent.temperature,
          )
        : "0.2",
    )
    setMaxTokens(
      agent.maxTokens !==
        null
        ? String(
            agent.maxTokens,
          )
        : "2000",
    )
    setRequiresApproval(
      agent.requiresApproval,
    )
    setCanAct(
      agent.canAct,
    )

    setSelectedAgent(null)
    setError("")
    setSuccess("")
    setShowForm(true)
  }

  function closeForm() {
    if (saving) {
      return
    }

    setShowForm(false)
    resetForm()
  }

  function handleNameChange(
    value: string,
  ) {
    setName(value)

    if (
      !editingAgent
    ) {
      setSlug(
        slugify(value),
      )
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanName =
      name.trim()

    const cleanSlug =
      slugify(
        slug.trim() ||
          cleanName,
      )

    const cleanInstructions =
      instructions.trim()

    if (!cleanName) {
      setError(
        "Agent name is required.",
      )
      return
    }

    if (!cleanSlug) {
      setError(
        "Agent slug is required.",
      )
      return
    }

    if (
      !cleanInstructions
    ) {
      setError(
        "Agent instructions are required.",
      )
      return
    }

    const parsedTemperature =
      Number(
        temperature,
      )

    const parsedMaxTokens =
      Number(
        maxTokens,
      )

    if (
      !Number.isFinite(
        parsedTemperature,
      ) ||
      parsedTemperature < 0 ||
      parsedTemperature > 2
    ) {
      setError(
        "Temperature must be between 0 and 2.",
      )
      return
    }

    if (
      !Number.isInteger(
        parsedMaxTokens,
      ) ||
      parsedMaxTokens < 1
    ) {
      setError(
        "Max tokens must be a positive whole number.",
      )
      return
    }

    // Action-capable agents must retain approval.
    const finalRequiresApproval =
      canAct
        ? true
        : requiresApproval

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const endpoint =
        editingAgent
          ? `/api/ai/agents/${encodeURIComponent(
              editingAgent.id,
            )}`
          : "/api/ai/agents"

      const method =
        editingAgent
          ? "PATCH"
          : "POST"

      const response =
        await fetch(
          endpoint,
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: cleanName,
              slug: cleanSlug,
              description:
                description.trim() ||
                null,
              instructions:
                cleanInstructions,
              model:
                model.trim(),
              status,
              temperature:
                parsedTemperature,
              maxTokens:
                parsedMaxTokens,
              requiresApproval:
                finalRequiresApproval,
              canAct,
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
            editingAgent
              ? "Unable to update AI agent."
              : "Unable to create AI agent.",
          ),
        )
      }

      setSuccess(
        editingAgent
          ? "AI agent updated successfully."
          : "AI agent created successfully.",
      )

      setShowForm(false)
      resetForm()

      await loadAgents()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to save AI agent.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function updateAgentStatus(
    agent: AiAgent,
    nextStatus: AgentStatus,
  ) {
    setStatusUpdatingId(
      agent.id,
    )
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/agents/${encodeURIComponent(
            agent.id,
          )}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status:
                nextStatus,
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
            "Unable to update agent status.",
          ),
        )
      }

      setSuccess(
        nextStatus ===
          "active"
          ? "AI agent activated."
          : nextStatus ===
              "inactive"
            ? "AI agent deactivated."
            : "AI agent moved to draft.",
      )

      setSelectedAgent(
        null,
      )

      await loadAgents()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to update agent status.",
      )
    } finally {
      setStatusUpdatingId(
        null,
      )
    }
  }

  async function deleteAgent(
    agent: AiAgent,
  ) {
    const confirmed =
      window.confirm(
        `Delete the AI agent "${agent.name}"? This cannot be undone.`,
      )

    if (!confirmed) {
      return
    }

    setDeletingId(
      agent.id,
    )

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

      setSelectedAgent(
        null,
      )

      await loadAgents()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to delete AI agent.",
      )
    } finally {
      setDeletingId(
        null,
      )
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <a
                href="/settings/ai"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                AI Settings
              </a>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Agents
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Agents
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Create specialized AI agents with their own
              instructions, models, permissions, and tools.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Create Agent
          </button>
        </div>
      </section>

      {/* Alerts */}
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

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Agents
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {counts.total}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {counts.active}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Draft
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {counts.draft}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Inactive
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-600">
            {counts.inactive}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Can Act
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {counts.acting}
          </p>
        </div>
      </section>

      {/* Agent list */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Agent Library
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure your organization's specialized AI
              assistants.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as
                    | "all"
                    | AgentStatus,
                )
              }
              className="rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
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

            <button
              type="button"
              onClick={() =>
                void loadAgents()
              }
              disabled={loading}
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : agents.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ✦
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No AI agents yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first specialized AI agent for
                customer support, sales, operations, or CRM
                automation.
              </p>

              <button
                type="button"
                onClick={
                  openCreateForm
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create First Agent
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map(
                (agent) => (
                  <article
                    key={agent.id}
                    className="rounded-2xl border p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {agent.name}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[agent.status]}`}
                          >
                            {
                              STATUS_LABELS[
                                agent.status
                              ]
                            }
                          </span>

                          {agent.canAct && (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              Can Act
                            </span>
                          )}

                          {agent.requiresApproval && (
                            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                              Approval Required
                            </span>
                          )}
                        </div>

                        <p className="mt-1 font-mono text-xs text-slate-400">
                          {agent.slug}
                        </p>

                        {agent.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                            {
                              agent.description
                            }
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {agent.model}
                          </span>

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            Temp:{" "}
                            {agent.temperature ??
                              "—"}
                          </span>

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            Max tokens:{" "}
                            {agent.maxTokens ??
                              "—"}
                          </span>

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            Tools:{" "}
                            {agent.tools?.length ??
                              0}
                          </span>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                          Updated{" "}
                          {formatDate(
                            agent.updatedAt,
                          )}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2 xl:max-w-[330px] xl:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAgent(
                              agent,
                            )
                          }
                          className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              agent,
                            )
                          }
                          className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        {agent.status !==
                          "active" && (
                          <button
                            type="button"
                            onClick={() =>
                              void updateAgentStatus(
                                agent,
                                "active",
                              )
                            }
                            disabled={
                              statusUpdatingId ===
                              agent.id
                            }
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {statusUpdatingId ===
                            agent.id
                              ? "Updating..."
                              : "Activate"}
                          </button>
                        )}

                        {agent.status ===
                          "active" && (
                          <button
                            type="button"
                            onClick={() =>
                              void updateAgentStatus(
                                agent,
                                "inactive",
                              )
                            }
                            disabled={
                              statusUpdatingId ===
                              agent.id
                            }
                            className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                          >
                            {statusUpdatingId ===
                            agent.id
                              ? "Updating..."
                              : "Deactivate"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            void deleteAgent(
                              agent,
                            )
                          }
                          disabled={
                            deletingId ===
                            agent.id
                          }
                          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
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

      {/* Create / Edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agent-form-title"
        >
          <div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="agent-form-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {editingAgent
                    ? "Edit AI Agent"
                    : "Create AI Agent"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define how this agent behaves and what it is
                  allowed to do.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={saving}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="agent-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Agent Name
                  </label>

                  <input
                    id="agent-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      handleNameChange(
                        event.target
                          .value,
                      )
                    }
                    maxLength={120}
                    placeholder="Sales Assistant"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
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
                    type="text"
                    value={slug}
                    onChange={(event) =>
                      setSlug(
                        event.target
                          .value,
                      )
                    }
                    maxLength={100}
                    placeholder="sales-assistant"
                    className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
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
                      event.target
                        .value,
                    )
                  }
                  maxLength={500}
                  rows={3}
                  placeholder="Helps the sales team qualify leads and answer CRM questions."
                  className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="agent-instructions"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  System Instructions
                </label>

                <textarea
                  id="agent-instructions"
                  value={instructions}
                  onChange={(event) =>
                    setInstructions(
                      event.target
                        .value,
                    )
                  }
                  rows={8}
                  maxLength={12000}
                  placeholder="You are a professional sales assistant. Use the CRM as the source of truth..."
                  className="w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <p className="mt-2 text-xs text-slate-400">
                  These instructions define the agent's
                  behavior. Never put API keys, passwords, or
                  other secrets here.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
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
                        event.target
                          .value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {MODELS.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {
                            item.label
                          }
                        </option>
                      ),
                    )}
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
                    value={
                      temperature
                    }
                    onChange={(event) =>
                      setTemperature(
                        event.target
                          .value,
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
                    Max Tokens
                  </label>

                  <input
                    id="agent-max-tokens"
                    type="number"
                    min="1"
                    step="1"
                    value={
                      maxTokens
                    }
                    onChange={(event) =>
                      setMaxTokens(
                        event.target
                          .value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="agent-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="agent-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as AgentStatus,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="space-y-4 rounded-2xl border bg-slate-50 p-5">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Agent Permissions
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    These settings control whether the agent
                    may eventually perform actions through
                    approved tools.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={canAct}
                    onChange={(event) =>
                      setCanAct(
                        event.target
                          .checked,
                      )
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Allow this agent to act
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Enables the agent to use action-capable
                      tools when they are assigned and approved.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={
                      canAct
                        ? true
                        : requiresApproval
                    }
                    disabled={
                      canAct
                    }
                    onChange={(event) =>
                      setRequiresApproval(
                        event.target
                          .checked,
                      )
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 disabled:opacity-50"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Require approval
                      {canAct &&
                        " (required)"}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Action-capable agents always require
                      approval before an action is executed.
                    </span>
                  </span>
                </label>

                {canAct && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    <strong>
                      Safety protection:
                    </strong>{" "}
                    approval is mandatory for agents that can
                    perform actions.
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={saving}
                  className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {saving
                    ? "Saving..."
                    : editingAgent
                      ? "Save Changes"
                      : "Create Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selectedAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agent-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="agent-details-title"
                    className="text-2xl font-bold text-slate-900"
                  >
                    {
                      selectedAgent.name
                    }
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[selectedAgent.status]}`}
                  >
                    {
                      STATUS_LABELS[
                        selectedAgent.status
                      ]
                    }
                  </span>
                </div>

                <p className="mt-2 break-all font-mono text-xs text-slate-400">
                  {
                    selectedAgent.id
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAgent(
                    null,
                  )
                }
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Slug
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-slate-800">
                    {
                      selectedAgent.slug
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Model
                  </p>

                  <p className="mt-2 font-medium text-slate-800">
                    {
                      selectedAgent.model
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Temperature
                  </p>

                  <p className="mt-2 font-medium text-slate-800">
                    {
                      selectedAgent.temperature ??
                      "—"
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Max Tokens
                  </p>

                  <p className="mt-2 font-medium text-slate-800">
                    {
                      selectedAgent.maxTokens ??
                      "—"
                    }
                  </p>
                </div>
              </div>

              {selectedAgent.description && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {
                      selectedAgent.description
                    }
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Instructions
                </p>

                <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
                  {
                    selectedAgent.instructions
                  }
                </pre>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Permissions
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={
                      selectedAgent.canAct
                        ? "rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                        : "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                    }
                  >
                    {selectedAgent.canAct
                      ? "Can Act"
                      : "Read / Respond"}
                  </span>

                  <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                    {selectedAgent.requiresApproval
                      ? "Approval Required"
                      : "Approval Not Required"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Assigned Tools
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Tools assigned to this agent.
                    </p>
                  </div>

                  <a
                    href={`/settings/ai/agents/tools?agentId=${encodeURIComponent(
                      selectedAgent.id,
                    )}`}
                    className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Manage Tools
                  </a>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedAgent.tools &&
                  selectedAgent.tools.length >
                    0 ? (
                    selectedAgent.tools.map(
                      (tool) => (
                        <div
                          key={
                            tool.id
                          }
                          className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">
                              {
                                tool.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                tool.type
                              }
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span
                              className={
                                tool.enabled
                                  ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                                  : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"
                              }
                            >
                              {tool.enabled
                                ? "Enabled"
                                : "Disabled"}
                            </span>

                            {tool.requiresApproval && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                Approval
                              </span>
                            )}
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-slate-500">
                      No tools assigned.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-slate-700">
                    {formatDate(
                      selectedAgent.createdAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Updated
                  </p>

                  <p className="mt-1 text-slate-700">
                    {formatDate(
                      selectedAgent.updatedAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                {selectedAgent.status !==
                  "active" && (
                  <button
                    type="button"
                    onClick={() =>
                      void updateAgentStatus(
                        selectedAgent,
                        "active",
                      )
                    }
                    disabled={
                      statusUpdatingId ===
                      selectedAgent.id
                    }
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Activate
                  </button>
                )}

                {selectedAgent.status ===
                  "active" && (
                  <button
                    type="button"
                    onClick={() =>
                      void updateAgentStatus(
                        selectedAgent,
                        "inactive",
                      )
                    }
                    disabled={
                      statusUpdatingId ===
                      selectedAgent.id
                    }
                    className="rounded-xl border border-amber-200 px-5 py-3 font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    openEditForm(
                      selectedAgent,
                    )
                  }
                  className="rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void deleteAgent(
                      selectedAgent,
                    )
                  }
                  disabled={
                    deletingId ===
                    selectedAgent.id
                  }
                  className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAgent(
                      null,
                    )
                  }
                  className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}