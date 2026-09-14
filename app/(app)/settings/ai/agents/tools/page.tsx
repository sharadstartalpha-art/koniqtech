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

type Agent = {
  id: string
  name: string
  slug: string
  status: AgentStatus
  canAct: boolean
  requiresApproval: boolean
}

type AgentTool = {
  id: string
  agentId: string
  name: string
  description: string | null
  type: ToolType
  enabled: boolean
  requiresApproval: boolean
  config: unknown
  createdAt: string
  updatedAt: string
  agent?: Agent
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  tools?: AgentTool[]
  tool?: AgentTool
}

const TOOL_TYPES: {
  value: ToolType
  label: string
  description: string
}[] = [
  {
    value: "crm_read",
    label: "CRM Read",
    description:
      "Read CRM records such as customers, leads, jobs, and invoices.",
  },
  {
    value: "crm_write",
    label: "CRM Write",
    description:
      "Create or modify CRM records.",
  },
  {
    value: "communication",
    label: "Communication",
    description:
      "Send or prepare external communications.",
  },
  {
    value: "search",
    label: "Web Search",
    description:
      "Search permitted external information sources.",
  },
  {
    value: "knowledge",
    label: "Knowledge",
    description:
      "Search the organization's AI knowledge base.",
  },
  {
    value: "analytics",
    label: "Analytics",
    description:
      "Run CRM and business analytics.",
  },
  {
    value: "scheduling",
    label: "Scheduling",
    description:
      "Create or manage scheduling actions.",
  },
  {
    value: "finance",
    label: "Finance",
    description:
      "Perform permitted financial lookups or operations.",
  },
  {
    value: "system",
    label: "System",
    description:
      "Perform controlled system-level operations.",
  },
]

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

function formatDate(value: string) {
  const date = new Date(value)

  if (
    Number.isNaN(date.getTime())
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

export default function AIAgentToolsPage() {
  const [agents, setAgents] =
    useState<Agent[]>([])

  const [tools, setTools] =
    useState<AgentTool[]>([])

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

  const [selectedAgentId, setSelectedAgentId] =
    useState("all")

  const [selectedTool, setSelectedTool] =
    useState<AgentTool | null>(null)

  const [showForm, setShowForm] =
    useState(false)

  const [editingTool, setEditingTool] =
    useState<AgentTool | null>(null)

  const [agentId, setAgentId] =
    useState("")

  const [toolName, setToolName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [type, setType] =
    useState<ToolType>("crm_read")

  const [enabled, setEnabled] =
    useState(true)

  const [requiresApproval, setRequiresApproval] =
    useState(true)

  const loadAgents =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/ai/agents",
            {
              method: "GET",
              cache: "no-store",
            },
          )

        const data =
          (await response.json()) as ApiResponse & {
            agents?: Agent[]
          }

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
      }
    }, [])

  const loadTools =
    useCallback(async () => {
      setLoading(true)
      setError("")

      try {
        const query =
          selectedAgentId ===
          "all"
            ? ""
            : `?agentId=${encodeURIComponent(
                selectedAgentId,
              )}`

        const response =
          await fetch(
            `/api/ai/tools${query}`,
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
              "Unable to load AI tools.",
            ),
          )
        }

        setTools(
          Array.isArray(
            data.tools,
          )
            ? data.tools
            : [],
        )
      } catch (
        caughtError
      ) {
        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : "Unable to load AI tools.",
        )
      } finally {
        setLoading(false)
      }
    }, [selectedAgentId])

  useEffect(() => {
    void loadAgents()
  }, [loadAgents])

  useEffect(() => {
    void loadTools()
  }, [loadTools])

  const counts =
    useMemo(() => {
      return {
        total: tools.length,
        enabled: tools.filter(
          (tool) =>
            tool.enabled,
        ).length,
        approval: tools.filter(
          (tool) =>
            tool.requiresApproval,
        ).length,
        action: tools.filter(
          (tool) =>
            tool.type ===
              "crm_write" ||
            tool.type ===
              "communication" ||
            tool.type ===
              "scheduling" ||
            tool.type ===
              "finance" ||
            tool.type ===
              "system",
        ).length,
      }
    }, [tools])

  function resetForm() {
    setAgentId(
      agents[0]?.id || "",
    )
    setToolName("")
    setDescription("")
    setType("crm_read")
    setEnabled(true)
    setRequiresApproval(true)
    setEditingTool(null)
  }

  function openCreateForm() {
    resetForm()
    setError("")
    setSuccess("")
    setShowForm(true)
  }

  function openEditForm(
    tool: AgentTool,
  ) {
    setEditingTool(tool)
    setAgentId(tool.agentId)
    setToolName(tool.name)
    setDescription(
      tool.description || "",
    )
    setType(tool.type)
    setEnabled(tool.enabled)
    setRequiresApproval(
      tool.requiresApproval,
    )
    setSelectedTool(null)
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanName =
      toolName.trim()

    if (!agentId) {
      setError(
        "Please select an AI agent.",
      )
      return
    }

    if (!cleanName) {
      setError(
        "Tool name is required.",
      )
      return
    }

    /*
     * Action-capable tools must retain approval.
     * This mirrors the server-side safety rule.
     */
    const actionTool =
      type === "crm_write" ||
      type === "communication" ||
      type === "scheduling" ||
      type === "finance" ||
      type === "system"

    const finalRequiresApproval =
      actionTool
        ? true
        : requiresApproval

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const endpoint =
        editingTool
          ? `/api/ai/tools/${encodeURIComponent(
              editingTool.name,
            )}`
          : "/api/ai/tools"

      const method =
        editingTool
          ? "PATCH"
          : "POST"

      const body = {
        ...(editingTool
          ? {}
          : {
              agentId,
            }),
        name: cleanName,
        description:
          description.trim(),
        type,
        enabled,
        requiresApproval:
          finalRequiresApproval,
      }

      const response =
        await fetch(
          endpoint,
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              body,
            ),
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
            editingTool
              ? "Unable to update tool."
              : "Unable to create tool.",
          ),
        )
      }

      setSuccess(
        editingTool
          ? "AI tool updated successfully."
          : "AI tool assigned successfully.",
      )

      setShowForm(false)
      resetForm()

      await loadTools()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to save AI tool.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function toggleTool(
    tool: AgentTool,
  ) {
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
            "Unable to update tool.",
          ),
        )
      }

      setSuccess(
        tool.enabled
          ? "Tool disabled."
          : "Tool enabled.",
      )

      await loadTools()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to update tool.",
      )
    }
  }

  async function deleteTool(
    tool: AgentTool,
  ) {
    const confirmed =
      window.confirm(
        `Remove "${tool.name}" from this agent?`,
      )

    if (!confirmed) {
      return
    }

    setDeletingId(tool.id)
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

      setSelectedTool(null)

      await loadTools()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to remove AI tool.",
      )
    } finally {
      setDeletingId(null)
    }
  }

  const selectedAgent =
    agents.find(
      (agent) =>
        agent.id === agentId,
    )

  const selectedType =
    TOOL_TYPES.find(
      (item) =>
        item.value === type,
    )

  return (
    <main className="mx-auto max-w-7xl space-y-8">
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

              <a
                href="/settings/ai/agents"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Agents
              </a>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Tools
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Agent Tools
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Control which capabilities each AI agent can
              use. Action-capable tools remain protected by
              approval requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            disabled={
              agents.length === 0
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            + Assign Tool
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

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Tools
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {counts.total}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Enabled
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {counts.enabled}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Approval Protected
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            {counts.approval}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Action Tools
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {counts.action}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Assigned Tools
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an agent to view its configured
              capabilities.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={
                selectedAgentId
              }
              onChange={(event) =>
                setSelectedAgentId(
                  event.target.value,
                )
              }
              className="rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Agents
              </option>

              {agents.map(
                (agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                  >
                    {agent.name}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={() =>
                void loadTools()
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
                    className="h-36 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : tools.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ⚙
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No tools assigned
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Assign a tool to an AI agent to give it
                controlled access to CRM capabilities.
              </p>

              {agents.length >
                0 && (
                <button
                  type="button"
                  onClick={
                    openCreateForm
                  }
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Assign First Tool
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {tools.map(
                (tool) => {
                  const agent =
                    agents.find(
                      (item) =>
                        item.id ===
                        tool.agentId,
                    )

                  const typeInfo =
                    TOOL_TYPES.find(
                      (item) =>
                        item.value ===
                        tool.type,
                    )

                  return (
                    <article
                      key={tool.id}
                      className="rounded-2xl border p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {tool.name}
                            </h3>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              {typeInfo?.label ||
                                tool.type}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                tool.enabled
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {tool.enabled
                                ? "Enabled"
                                : "Disabled"}
                            </span>

                            {tool.requiresApproval && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                Approval Required
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            Agent:{" "}
                            <span className="font-semibold text-slate-700">
                              {agent?.name ||
                                "Unknown agent"}
                            </span>
                          </p>

                          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                            {tool.description ||
                              typeInfo?.description ||
                              "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                            <span>
                              Created{" "}
                              {formatDate(
                                tool.createdAt,
                              )}
                            </span>

                            <span>
                              Updated{" "}
                              {formatDate(
                                tool.updatedAt,
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTool(
                                tool,
                              )
                            }
                            className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void toggleTool(
                                tool,
                              )
                            }
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                              tool.enabled
                                ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {tool.enabled
                              ? "Disable"
                              : "Enable"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                tool,
                              )
                            }
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                },
              )}
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tool-form-title"
        >
          <div className="mx-auto my-8 max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="tool-form-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {editingTool
                    ? "Edit AI Tool"
                    : "Assign AI Tool"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure a controlled capability for an
                  AI agent.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {!editingTool && (
                <div>
                  <label
                    htmlFor="tool-agent"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    AI Agent
                  </label>

                  <select
                    id="tool-agent"
                    value={agentId}
                    onChange={(event) =>
                      setAgentId(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">
                      Select an agent
                    </option>

                    {agents.map(
                      (agent) => (
                        <option
                          key={
                            agent.id
                          }
                          value={
                            agent.id
                          }
                        >
                          {agent.name}{" "}
                          —{" "}
                          {agent.status}
                        </option>
                      ),
                    )}
                  </select>

                  {selectedAgent && (
                    <p className="mt-2 text-xs text-slate-500">
                      {selectedAgent.canAct
                        ? "This agent can perform actions."
                        : "This agent is currently read-only."}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="tool-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tool Name
                </label>

                <input
                  id="tool-name"
                  type="text"
                  value={toolName}
                  onChange={(event) =>
                    setToolName(
                      event.target.value,
                    )
                  }
                  maxLength={120}
                  placeholder="customer_lookup"
                  disabled={
                    Boolean(
                      editingTool,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                  required
                />

                <p className="mt-2 text-xs text-slate-400">
                  Use the exact tool name registered by the
                  AI execution layer.
                </p>
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
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target
                        .value as ToolType,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {TOOL_TYPES.map(
                    (toolType) => (
                      <option
                        key={
                          toolType.value
                        }
                        value={
                          toolType.value
                        }
                      >
                        {
                          toolType.label
                        }
                      </option>
                    ),
                  )}
                </select>

                {selectedType && (
                  <p className="mt-2 text-xs text-slate-500">
                    {
                      selectedType.description
                    }
                  </p>
                )}
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
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={4}
                  maxLength={1000}
                  placeholder="Look up customers by name, email, or phone number."
                  className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-4 rounded-2xl border bg-slate-50 p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) =>
                      setEnabled(
                        event.target.checked,
                      )
                    }
                    className="mt-1 h-5 w-5 rounded"
                  />

                  <span>
                    <span className="block font-semibold text-slate-800">
                      Enable this tool
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      The agent can only use tools that are
                      enabled.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={
                      requiresApproval
                    }
                    onChange={(event) =>
                      setRequiresApproval(
                        event.target.checked,
                      )
                    }
                    disabled={
                      type ===
                        "crm_write" ||
                      type ===
                        "communication" ||
                      type ===
                        "scheduling" ||
                      type ===
                        "finance" ||
                      type ===
                        "system"
                    }
                    className="mt-1 h-5 w-5 rounded disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <span>
                    <span className="block font-semibold text-slate-800">
                      Require approval
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      Require explicit user approval before
                      an action-capable tool can execute.
                    </span>
                  </span>
                </label>

                {(type ===
                  "crm_write" ||
                  type ===
                    "communication" ||
                  type ===
                    "scheduling" ||
                  type ===
                    "finance" ||
                  type ===
                    "system") && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    <strong>Safety protection:</strong>{" "}
                    this tool type requires approval before
                    execution.
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
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
                    : editingTool
                      ? "Save Changes"
                      : "Assign Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tool-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="tool-details-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {selectedTool.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI Tool Configuration
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTool(
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
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {
                    TOOL_TYPES.find(
                      (item) =>
                        item.value ===
                        selectedTool.type,
                    )?.label ||
                      selectedTool.type
                  }
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    selectedTool.enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {selectedTool.enabled
                    ? "Enabled"
                    : "Disabled"}
                </span>

                {selectedTool.requiresApproval && (
                  <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                    Approval Required
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 leading-6 text-slate-700">
                  {selectedTool.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Assigned Agent
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {agents.find(
                    (agent) =>
                      agent.id ===
                      selectedTool.agentId,
                  )?.name ||
                    "Unknown agent"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      selectedTool.createdAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Updated
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      selectedTool.updatedAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    void deleteTool(
                      selectedTool,
                    )
                  }
                  disabled={
                    deletingId ===
                    selectedTool.id
                  }
                  className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId ===
                  selectedTool.id
                    ? "Removing..."
                    : "Remove Tool"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openEditForm(
                      selectedTool,
                    )
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Edit Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}