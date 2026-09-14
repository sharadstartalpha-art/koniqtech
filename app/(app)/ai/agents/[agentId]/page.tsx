"use client"

import Link from "next/link"
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

type ToolType =
  | "crm_read"
  | "crm_write"
  | "communication"
  | "search"
  | "knowledge"
  | "analytics"
  | "scheduling"
  | "finance"
  | "system"

type AgentTool = {
  id: string
  name: string
  description: string
  type: ToolType
  enabled: boolean
  requiresApproval: boolean
  config: unknown
  createdAt: string
  updatedAt: string
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
  createdById: string
  createdAt: string
  updatedAt: string
  tools: AgentTool[]
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  agent?: Agent
  tool?: AgentTool
  tools?: AgentTool[]
}

type PageProps = {
  params: Promise<{
    agentId: string
  }>
}

const MODELS = [
  "gpt-5.6-luna",
  "gpt-5.6-terra",
  "gpt-5.6-sol",
]

const TOOL_TYPES: ToolType[] = [
  "crm_read",
  "crm_write",
  "communication",
  "search",
  "knowledge",
  "analytics",
  "scheduling",
  "finance",
  "system",
]

const STATUS_LABELS: Record<
  AgentStatus,
  string
> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
}

const TOOL_TYPE_LABELS: Record<
  ToolType,
  string
> = {
  crm_read: "CRM Read",
  crm_write: "CRM Write",
  communication: "Communication",
  search: "Search",
  knowledge: "Knowledge",
  analytics: "Analytics",
  scheduling: "Scheduling",
  finance: "Finance",
  system: "System",
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
      agent.model || MODELS[0],
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

function formatDate(
  value: string,
) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleString()
}

export default function AiAgentPage({
  params,
}: PageProps) {
  const [agentId, setAgentId] =
    useState("")

  const [agent, setAgent] =
    useState<Agent | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [toolSaving, setToolSaving] =
    useState(false)

  const [deletingToolId, setDeletingToolId] =
    useState<string | null>(null)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [showAddTool, setShowAddTool] =
    useState(false)

  const [name, setName] =
    useState("")

  const [slug, setSlug] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [instructions, setInstructions] =
    useState("")

  const [model, setModel] =
    useState(MODELS[0])

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

  const [toolName, setToolName] =
    useState("")

  const [toolDescription, setToolDescription] =
    useState("")

  const [toolType, setToolType] =
    useState<ToolType>("crm_read")

  const [toolRequiresApproval, setToolRequiresApproval] =
    useState(true)

  const loadAgent =
    useCallback(async () => {
      if (!agentId) {
        return
      }

      setLoading(true)
      setError("")

      try {
        const response =
          await fetch(
            `/api/ai/agents/${encodeURIComponent(
              agentId,
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
          !data.success ||
          !data.agent
        ) {
          throw new Error(
            getErrorMessage(
              data,
              "Unable to load AI agent.",
            ),
          )
        }

        const normalized =
          normalizeAgent(
            data.agent,
          )

        setAgent(normalized)

        setName(normalized.name)
        setSlug(normalized.slug)
        setDescription(
          normalized.description || "",
        )
        setInstructions(
          normalized.instructions || "",
        )
        setModel(
          normalized.model ||
            MODELS[0],
        )
        setStatus(
          normalized.status,
        )
        setTemperature(
          normalized.temperature !==
            null
            ? String(
                normalized.temperature,
              )
            : "0.2",
        )
        setMaxTokens(
          normalized.maxTokens !==
            null
            ? String(
                normalized.maxTokens,
              )
            : "2000",
        )
        setRequiresApproval(
          normalized.requiresApproval,
        )
        setCanAct(
          normalized.canAct,
        )
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load AI agent.",
        )
      } finally {
        setLoading(false)
      }
    }, [agentId])

  useEffect(() => {
    void params.then(
      ({ agentId: resolvedId }) => {
        setAgentId(
          typeof resolvedId === "string"
            ? resolvedId.trim()
            : "",
        )
      },
    )
  }, [params])

  useEffect(() => {
    if (agentId) {
      void loadAgent()
    }
  }, [agentId, loadAgent])

  const enabledTools =
    useMemo(
      () =>
        agent?.tools.filter(
          (tool) => tool.enabled,
        ) || [],
      [agent],
    )

  const writeTools =
    useMemo(
      () =>
        agent?.tools.filter(
          (tool) =>
            tool.type ===
            "crm_write",
        ) || [],
      [agent],
    )

  async function saveAgent(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!agent || saving) {
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const normalizedName =
        name.trim()

      const normalizedSlug =
        slug
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-",
          )
          .replace(
            /^-+|-+$/g,
            "",
          )

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
       * Acting agents must retain approval.
       * This mirrors the server-side safety rule.
       */
      const finalRequiresApproval =
        canAct
          ? true
          : requiresApproval

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
                MODELS[0],
              status,
              temperature:
                parsedTemperature,
              maxTokens:
                Math.floor(
                  parsedMaxTokens,
                ),
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
            "Unable to save AI agent.",
          ),
        )
      }

      setSuccess(
        "AI agent updated successfully.",
      )

      await loadAgent()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save AI agent.",
      )
    } finally {
      setSaving(false)
    }
  }

  function resetToolForm() {
    setToolName("")
    setToolDescription("")
    setToolType("crm_read")
    setToolRequiresApproval(true)
  }

  async function addTool(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !agent ||
      toolSaving
    ) {
      return
    }

    setToolSaving(true)
    setError("")
    setSuccess("")

    try {
      const normalizedName =
        toolName.trim()

      if (!normalizedName) {
        throw new Error(
          "Tool name is required.",
        )
      }

      /*
       * Write tools must require approval
       * when the agent can act.
       */
      const finalRequiresApproval =
        agent.canAct &&
        toolType ===
          "crm_write"
          ? true
          : toolRequiresApproval

      const response =
        await fetch(
          "/api/ai/tools",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              agentId:
                agent.id,
              name:
                normalizedName,
              description:
                toolDescription.trim() ||
                undefined,
              type:
                toolType,
              enabled: true,
              requiresApproval:
                finalRequiresApproval,
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
            "Unable to add AI tool.",
          ),
        )
      }

      setSuccess(
        "AI tool added successfully.",
      )

      setShowAddTool(false)
      resetToolForm()

      await loadAgent()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add AI tool.",
      )
    } finally {
      setToolSaving(false)
    }
  }

  async function toggleTool(
    tool: AgentTool,
  ) {
    if (!agent || toolSaving) {
      return
    }

    setToolSaving(true)
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/tools/${encodeURIComponent(
            tool.name,
          )}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: tool.id,
              enabled:
                !tool.enabled,
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
            "Unable to update AI tool.",
          ),
        )
      }

      setSuccess(
        tool.enabled
          ? `"${tool.name}" disabled.`
          : `"${tool.name}" enabled.`,
      )

      await loadAgent()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update AI tool.",
      )
    } finally {
      setToolSaving(false)
    }
  }

  async function deleteTool(
    tool: AgentTool,
  ) {
    if (!agent) {
      return
    }

    const confirmed =
      window.confirm(
        `Remove "${tool.name}" from this agent?`,
      )

    if (!confirmed) {
      return
    }

    setDeletingToolId(tool.id)
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/tools/${encodeURIComponent(
            tool.name,
          )}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: tool.id,
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
            "Unable to remove AI tool.",
          ),
        )
      }

      setSuccess(
        "AI tool removed successfully.",
      )

      await loadAgent()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to remove AI tool.",
      )
    } finally {
      setDeletingToolId(null)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-6">
        <div className="h-36 animate-pulse rounded-3xl bg-slate-100" />

        <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />
      </main>
    )
  }

  if (!agent) {
    return (
      <main className="mx-auto max-w-4xl">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            AI Agent unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "The requested AI agent could not be loaded."}
          </p>

          <Link
            href="/ai/agents"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to AI Agents
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/ai/agents"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← AI Agents
              </Link>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-sm text-slate-500">
                {agent.name}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {agent.name}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
            </div>

            <p className="mt-2 font-mono text-xs text-slate-400">
              {agent.slug}
            </p>

            <p className="mt-4 max-w-3xl text-slate-600">
              {agent.description ||
                "No description has been configured for this agent."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/ai"
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              AI Assistant
            </Link>

            <button
              type="submit"
              form="agent-settings-form"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
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

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Agent Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the agent's identity,
              instructions, model, and execution
              permissions.
            </p>
          </div>

          <form
            id="agent-settings-form"
            onSubmit={saveAgent}
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
                    setName(
                      event.target.value,
                    )
                  }
                  maxLength={100}
                  required
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
                      event.target.value,
                    )
                  }
                  maxLength={100}
                  required
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
                className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="agent-instructions"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Instructions
              </label>

              <textarea
                id="agent-instructions"
                value={instructions}
                onChange={(event) =>
                  setInstructions(
                    event.target.value,
                  )
                }
                rows={10}
                maxLength={12000}
                placeholder="Define what this agent should do, what information it should prioritize, and what it must not do."
                className="w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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
                  {MODELS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>
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
                      event.target.value as AgentStatus,
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
            </div>

            <div>
              <label
                htmlFor="agent-max-tokens"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Maximum Output Tokens
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

            <div className="rounded-2xl border bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Execution Permissions
              </h3>

              <div className="mt-4 space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={canAct}
                    onChange={(event) =>
                      setCanAct(
                        event.target.checked,
                      )
                    }
                    className="mt-1 h-4 w-4 rounded"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Allow this agent to act
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Allows the agent to use tools
                      that may perform actions.
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={requiresApproval}
                    disabled={canAct}
                    onChange={(event) =>
                      setRequiresApproval(
                        event.target.checked,
                      )
                    }
                    className="mt-1 h-4 w-4 rounded disabled:cursor-not-allowed"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Require approval
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Acting agents are always kept
                      behind approval safeguards.
                    </span>
                  </span>
                </label>
              </div>

              {canAct && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  This agent can perform actions.
                  Approval remains required for
                  protected actions.
                </div>
              )}
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Agent Overview
            </h2>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </dt>

                <dd className="mt-1 font-medium text-slate-800">
                  {
                    STATUS_LABELS[
                      agent.status
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Model
                </dt>

                <dd className="mt-1 font-mono text-sm text-slate-800">
                  {agent.model}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Enabled Tools
                </dt>

                <dd className="mt-1 text-2xl font-bold text-blue-600">
                  {enabledTools.length}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Write Tools
                </dt>

                <dd className="mt-1 text-2xl font-bold text-amber-600">
                  {writeTools.length}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created
                </dt>

                <dd className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    agent.createdAt,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Last Updated
                </dt>

                <dd className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    agent.updatedAt,
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="font-bold text-blue-900">
              Safety Model
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              Read-only tools can run directly.
              Actions that can modify CRM data or
              communicate externally should remain
              behind approval.
            </p>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Agent Tools
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control which capabilities are
              available to this agent.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("")
              setSuccess("")
              resetToolForm()
              setShowAddTool(true)
            }}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add Tool
          </button>
        </div>

        <div className="p-6">
          {agent.tools.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ⚙
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No tools configured
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add a tool when this agent needs
                access to CRM data, knowledge,
                analytics, communication, or other
                capabilities.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {agent.tools.map(
                (tool) => (
                  <article
                    key={tool.id}
                    className="rounded-2xl border p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {tool.name}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {
                              TOOL_TYPE_LABELS[
                                tool.type
                              ]
                            }
                          </span>
                        </div>

                        {tool.description && (
                          <p className="mt-2 text-sm leading-5 text-slate-500">
                            {
                              tool.description
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tool.enabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tool.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tool.requiresApproval && (
                        <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700">
                          Approval Required
                        </span>
                      )}

                      {tool.type ===
                        "crm_write" && (
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                          Writes CRM
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex gap-2 border-t pt-4">
                      <button
                        type="button"
                        disabled={
                          toolSaving
                        }
                        onClick={() =>
                          void toggleTool(
                            tool,
                          )
                        }
                        className="rounded-xl border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {tool.enabled
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingToolId ===
                          tool.id
                        }
                        onClick={() =>
                          void deleteTool(
                            tool,
                          )
                        }
                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingToolId ===
                        tool.id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {showAddTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-tool-title"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="add-tool-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  Add Agent Tool
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Assign a capability to this AI
                  agent.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!toolSaving) {
                    setShowAddTool(
                      false,
                    )
                  }
                }}
                disabled={toolSaving}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={addTool}
              className="space-y-5 p-6"
            >
              <div>
                <label
                  htmlFor="tool-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tool Name
                </label>

                <input
                  id="tool-name"
                  value={toolName}
                  onChange={(event) =>
                    setToolName(
                      event.target.value,
                    )
                  }
                  required
                  maxLength={100}
                  placeholder="customer_lookup"
                  className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Use a stable tool identifier.
                </p>
              </div>

              <div>
                <label
                  htmlFor="tool-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="tool-description"
                  value={toolDescription}
                  onChange={(event) =>
                    setToolDescription(
                      event.target.value,
                    )
                  }
                  rows={3}
                  maxLength={1000}
                  placeholder="Look up customer information within the organization."
                  className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="tool-type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tool Type
                </label>

                <select
                  id="tool-type"
                  value={toolType}
                  onChange={(event) =>
                    setToolType(
                      event.target.value as ToolType,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {TOOL_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {
                          TOOL_TYPE_LABELS[
                            type
                          ]
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={
                    toolRequiresApproval
                  }
                  disabled={
                    agent.canAct &&
                    toolType ===
                      "crm_write"
                  }
                  onChange={(event) =>
                    setToolRequiresApproval(
                      event.target.checked,
                    )
                  }
                  className="mt-1 h-4 w-4 rounded"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Require approval
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Protected actions should require
                    explicit user approval.
                  </span>
                </span>
              </label>

              {agent.canAct &&
                toolType ===
                  "crm_write" && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    CRM write tools require approval
                    for acting agents.
                  </div>
                )}

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!toolSaving) {
                      setShowAddTool(
                        false,
                      )
                    }
                  }}
                  disabled={toolSaving}
                  className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={toolSaving}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {toolSaving
                    ? "Adding..."
                    : "Add Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}