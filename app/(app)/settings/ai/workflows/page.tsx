"use client"

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type WorkflowStatus =
  | "draft"
  | "active"
  | "inactive"

type AgentStatus =
  | "draft"
  | "active"
  | "inactive"

type Agent = {
  id: string
  name: string
  slug: string
  status: AgentStatus
  canAct: boolean
  requiresApproval: boolean
}

type AiWorkflow = {
  id: string
  orgId: string
  agentId: string | null
  name: string
  description: string | null
  triggerEvent: string
  status: WorkflowStatus
  requiresApproval: boolean
  config: unknown
  createdById: string | null
  createdAt: string
  updatedAt: string
  agent?: Agent | null
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  workflows?: AiWorkflow[]
  workflow?: AiWorkflow
}

const STATUS_LABELS: Record<
  WorkflowStatus,
  string
> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
}

const STATUS_CLASSES: Record<
  WorkflowStatus,
  string
> = {
  draft:
    "bg-amber-100 text-amber-700",
  active:
    "bg-emerald-100 text-emerald-700",
  inactive:
    "bg-slate-100 text-slate-600",
}

const TRIGGER_OPTIONS = [
  {
    value: "lead.created",
    label: "Lead Created",
    description:
      "Runs when a new lead is created.",
  },
  {
    value: "lead.updated",
    label: "Lead Updated",
    description:
      "Runs when an existing lead is updated.",
  },
  {
    value: "customer.created",
    label: "Customer Created",
    description:
      "Runs when a new customer is created.",
  },
  {
    value: "customer.updated",
    label: "Customer Updated",
    description:
      "Runs when an existing customer is updated.",
  },
  {
    value: "job.created",
    label: "Job Created",
    description:
      "Runs when a new job is created.",
  },
  {
    value: "job.updated",
    label: "Job Updated",
    description:
      "Runs when an existing job is updated.",
  },
  {
    value: "invoice.created",
    label: "Invoice Created",
    description:
      "Runs when an invoice is created.",
  },
  {
    value: "invoice.overdue",
    label: "Invoice Becomes Overdue",
    description:
      "Runs when an invoice becomes overdue.",
  },
  {
    value: "schedule.created",
    label: "Schedule Created",
    description:
      "Runs when a schedule is created.",
  },
  {
    value: "manual",
    label: "Manual",
    description:
      "Workflow is started manually.",
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

export default function AIWorkflowsPage() {
  const [workflows, setWorkflows] =
    useState<AiWorkflow[]>([])

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

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | WorkflowStatus
    >("all")

  const [selectedWorkflow, setSelectedWorkflow] =
    useState<AiWorkflow | null>(
      null,
    )

  const [showForm, setShowForm] =
    useState(false)

  const [editingWorkflow, setEditingWorkflow] =
    useState<AiWorkflow | null>(
      null,
    )

  const [name, setName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [triggerEvent, setTriggerEvent] =
    useState("lead.created")

  const [agentId, setAgentId] =
    useState("")

  const [status, setStatus] =
    useState<WorkflowStatus>(
      "draft",
    )

  const [requiresApproval, setRequiresApproval] =
    useState(true)

  const loadAgents =
    useCallback(
      async () => {
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
      },
      [],
    )

  const loadWorkflows =
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
              `/api/ai/workflows${query}`,
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
                "Unable to load AI workflows.",
              ),
            )
          }

          setWorkflows(
            Array.isArray(
              data.workflows,
            )
              ? data.workflows
              : [],
          )
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI workflows.",
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

  useEffect(() => {
    void loadWorkflows()
  }, [loadWorkflows])

  const counts =
    useMemo(
      () => ({
        total:
          workflows.length,

        active:
          workflows.filter(
            (workflow) =>
              workflow.status ===
              "active",
          ).length,

        draft:
          workflows.filter(
            (workflow) =>
              workflow.status ===
              "draft",
          ).length,

        inactive:
          workflows.filter(
            (workflow) =>
              workflow.status ===
              "inactive",
          ).length,
      }),
      [workflows],
    )

  function resetForm() {
    setName("")
    setDescription("")
    setTriggerEvent(
      "lead.created",
    )
    setAgentId(
      agents[0]?.id || "",
    )
    setStatus("draft")
    setRequiresApproval(true)
    setEditingWorkflow(null)
  }

  function openCreateForm() {
    resetForm()
    setError("")
    setSuccess("")
    setShowForm(true)
  }

  function openEditForm(
    workflow: AiWorkflow,
  ) {
    setEditingWorkflow(
      workflow,
    )

    setName(workflow.name)

    setDescription(
      workflow.description ||
        "",
    )

    setTriggerEvent(
      workflow.triggerEvent,
    )

    setAgentId(
      workflow.agentId || "",
    )

    setStatus(
      workflow.status,
    )

    setRequiresApproval(
      workflow.requiresApproval,
    )

    setSelectedWorkflow(
      null,
    )

    setError("")
    setSuccess("")
    setShowForm(true)
  }

  function closeForm() {
    if (saving) {
      return
    }

    resetForm()
    setShowForm(false)
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanName =
      name.trim()

    const cleanDescription =
      description.trim()

    if (!cleanName) {
      setError(
        "Workflow name is required.",
      )
      return
    }

    if (!triggerEvent.trim()) {
      setError(
        "Trigger event is required.",
      )
      return
    }

    /*
     * An active workflow with an action-capable
     * agent must retain approval protection.
     */
    const selectedAgent =
      agents.find(
        (agent) =>
          agent.id ===
          agentId,
      )

    const finalRequiresApproval =
      selectedAgent?.canAct
        ? true
        : requiresApproval

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const endpoint =
        editingWorkflow
          ? `/api/ai/workflows/${encodeURIComponent(
              editingWorkflow.id,
            )}`
          : "/api/ai/workflows"

      const method =
        editingWorkflow
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
              description:
                cleanDescription,
              triggerEvent:
                triggerEvent.trim(),
              agentId:
                agentId || null,
              status,
              requiresApproval:
                finalRequiresApproval,
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
            editingWorkflow
              ? "Unable to update workflow."
              : "Unable to create workflow.",
          ),
        )
      }

      setSuccess(
        editingWorkflow
          ? "AI workflow updated successfully."
          : "AI workflow created successfully.",
      )

      setShowForm(false)
      resetForm()

      await loadWorkflows()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to save AI workflow.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function updateWorkflowStatus(
    workflow: AiWorkflow,
    nextStatus: WorkflowStatus,
  ) {
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/workflows/${encodeURIComponent(
            workflow.id,
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
            "Unable to update workflow status.",
          ),
        )
      }

      setSuccess(
        `Workflow "${workflow.name}" is now ${STATUS_LABELS[nextStatus].toLowerCase()}.`,
      )

      await loadWorkflows()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to update workflow status.",
      )
    }
  }

  async function deleteWorkflow(
    workflow: AiWorkflow,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${workflow.name}"?\n\nThis cannot be undone.`,
      )

    if (!confirmed) {
      return
    }

    setDeletingId(
      workflow.id,
    )

    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/workflows/${encodeURIComponent(
            workflow.id,
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
            "Unable to delete workflow.",
          ),
        )
      }

      setSuccess(
        "AI workflow deleted successfully.",
      )

      setSelectedWorkflow(
        null,
      )

      await loadWorkflows()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to delete workflow.",
      )
    } finally {
      setDeletingId(null)
    }
  }

  const selectedAgent =
    agents.find(
      (agent) =>
        agent.id ===
        agentId,
    )

  const selectedTrigger =
    TRIGGER_OPTIONS.find(
      (option) =>
        option.value ===
        triggerEvent,
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

              <span className="text-slate-500">
                Workflows
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Workflows
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Automate CRM processes with controlled AI
              agents, triggers, and approval protection.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Create Workflow
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
            Total Workflows
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

          <p className="mt-2 text-3xl font-bold text-slate-500">
            {counts.inactive}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Workflow Automation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure when AI workflows should run.
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
                    | WorkflowStatus,
                )
              }
              className="rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

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

            <button
              type="button"
              onClick={() =>
                void loadWorkflows()
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
                    className="h-40 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : workflows.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ⚡
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No workflows yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first AI workflow to automate a
                controlled CRM process.
              </p>

              <button
                type="button"
                onClick={
                  openCreateForm
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create Your First Workflow
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map(
                (workflow) => {
                  const agent =
                    agents.find(
                      (item) =>
                        item.id ===
                        workflow.agentId,
                    )

                  return (
                    <article
                      key={
                        workflow.id
                      }
                      className="rounded-2xl border p-5 transition hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {
                                workflow.name
                              }
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[workflow.status]}`}
                            >
                              {
                                STATUS_LABELS[
                                  workflow.status
                                ]
                              }
                            </span>

                            {workflow.requiresApproval && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                Approval Required
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            {workflow.description ||
                              "No description provided."}
                          </p>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Trigger
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                {TRIGGER_OPTIONS.find(
                                  (
                                    option,
                                  ) =>
                                    option.value ===
                                    workflow.triggerEvent,
                                )?.label ||
                                  workflow.triggerEvent}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Agent
                              </p>

                              <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                                {agent?.name ||
                                  "No agent"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Created
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  workflow.createdAt,
                                )}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Updated
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  workflow.updatedAt,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedWorkflow(
                                workflow,
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
                                workflow,
                              )
                            }
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          {workflow.status ===
                          "active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                void updateWorkflowStatus(
                                  workflow,
                                  "inactive",
                                )
                              }
                              className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                void updateWorkflowStatus(
                                  workflow,
                                  "active",
                                )
                              }
                              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Activate
                            </button>
                          )}
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
          aria-labelledby="workflow-form-title"
        >
          <div className="mx-auto my-8 max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="workflow-form-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {editingWorkflow
                    ? "Edit AI Workflow"
                    : "Create AI Workflow"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the trigger, agent, and approval
                  behavior.
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
              <div>
                <label
                  htmlFor="workflow-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Workflow Name
                </label>

                <input
                  id="workflow-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  maxLength={200}
                  placeholder="New Lead AI Follow-up"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="workflow-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="workflow-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={3}
                  maxLength={1000}
                  placeholder="Explain what this workflow is intended to accomplish."
                  className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="workflow-trigger"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Trigger Event
                </label>

                <select
                  id="workflow-trigger"
                  value={triggerEvent}
                  onChange={(event) =>
                    setTriggerEvent(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {TRIGGER_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    ),
                  )}
                </select>

                {selectedTrigger && (
                  <p className="mt-2 text-xs text-slate-500">
                    {
                      selectedTrigger.description
                    }
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="workflow-agent"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  AI Agent
                </label>

                <select
                  id="workflow-agent"
                  value={agentId}
                  onChange={(event) =>
                    setAgentId(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    No Agent
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
                  <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    <span className="font-semibold">
                      {selectedAgent.name}
                    </span>{" "}
                    is{" "}
                    {selectedAgent.status}.

                    {selectedAgent.canAct
                      ? " This agent can perform actions, so approval protection is required."
                      : " This agent is currently read-only."}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="workflow-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="workflow-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as WorkflowStatus,
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

              <div className="rounded-2xl border bg-slate-50 p-5">
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
                      selectedAgent?.canAct ===
                      true
                    }
                    className="mt-1 h-5 w-5 rounded border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <span>
                    <span className="block font-semibold text-slate-800">
                      Require approval before actions
                    </span>

                    <span className="mt-1 block text-sm leading-6 text-slate-500">
                      Recommended for workflows that can
                      modify CRM data, send communications, or
                      perform other external actions.
                    </span>
                  </span>
                </label>

                {selectedAgent?.canAct && (
                  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    <strong>Approval protection enabled.</strong>{" "}
                    This workflow's selected agent can act,
                    therefore approval cannot be disabled.
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
                    : editingWorkflow
                      ? "Save Changes"
                      : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedWorkflow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workflow-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="workflow-details-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {selectedWorkflow.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI Workflow
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedWorkflow(
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
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_CLASSES[selectedWorkflow.status]}`}
                >
                  {
                    STATUS_LABELS[
                      selectedWorkflow.status
                    ]
                  }
                </span>

                {selectedWorkflow.requiresApproval && (
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
                  {selectedWorkflow.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Trigger
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {TRIGGER_OPTIONS.find(
                      (option) =>
                        option.value ===
                        selectedWorkflow.triggerEvent,
                    )?.label ||
                      selectedWorkflow.triggerEvent}
                  </p>

                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {
                      selectedWorkflow.triggerEvent
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Agent
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {agents.find(
                      (agent) =>
                        agent.id ===
                        selectedWorkflow.agentId,
                    )?.name ||
                      "No agent assigned"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      selectedWorkflow.createdAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      selectedWorkflow.updatedAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="font-semibold text-blue-800">
                  Workflow safety
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Activation is validated server-side. An
                  active workflow requires an active agent,
                  and an action-capable agent must retain
                  approval protection.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    void deleteWorkflow(
                      selectedWorkflow,
                    )
                  }
                  disabled={
                    deletingId ===
                    selectedWorkflow.id
                  }
                  className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId ===
                  selectedWorkflow.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openEditForm(
                      selectedWorkflow,
                    )
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Edit Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}