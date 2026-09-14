"use client"

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type KnowledgeStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed"
  | "archived"

type KnowledgeSource = {
  id: string
  orgId: string
  articleId: string | null
  name: string
  sourceType: string
  fileName: string | null
  fileUrl: string | null
  mimeType: string | null
  fileSize: number | null
  vectorStoreId: string | null
  vectorFileId: string | null
  status: KnowledgeStatus
  error: string | null
  metadata: unknown
  createdAt: string
  updatedAt: string
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  sources?: KnowledgeSource[]
  source?: KnowledgeSource
}

const STATUS_LABELS: Record<
  KnowledgeStatus,
  string
> = {
  pending: "Pending",
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
  archived: "Archived",
}

const STATUS_CLASSES: Record<
  KnowledgeStatus,
  string
> = {
  pending:
    "bg-amber-100 text-amber-700",
  processing:
    "bg-blue-100 text-blue-700",
  ready:
    "bg-emerald-100 text-emerald-700",
  failed:
    "bg-red-100 text-red-700",
  archived:
    "bg-slate-100 text-slate-600",
}

const SOURCE_TYPES = [
  {
    value: "file",
    label: "File",
  },
  {
    value: "url",
    label: "URL",
  },
  {
    value: "article",
    label: "Knowledge Article",
  },
  {
    value: "document",
    label: "Document",
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

function formatFileSize(
  bytes: number | null,
) {
  if (
    bytes === null ||
    !Number.isFinite(bytes) ||
    bytes <= 0
  ) {
    return "—"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  if (
    bytes <
    1024 * 1024 * 1024
  ) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`
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

export default function AiKnowledgePage() {
  const [sources, setSources] =
    useState<KnowledgeSource[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [selectedSource, setSelectedSource] =
    useState<KnowledgeSource | null>(
      null,
    )

  const [showForm, setShowForm] =
    useState(false)

  const [editingSource, setEditingSource] =
    useState<KnowledgeSource | null>(
      null,
    )

  const [name, setName] =
    useState("")

  const [sourceType, setSourceType] =
    useState("url")

  const [fileName, setFileName] =
    useState("")

  const [fileUrl, setFileUrl] =
    useState("")

  const [mimeType, setMimeType] =
    useState("")

  const [fileSize, setFileSize] =
    useState("")

  const [articleId, setArticleId] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | KnowledgeStatus
    >("all")

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const loadSources =
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
              `/api/ai/knowledge${query}`,
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
                "Unable to load AI knowledge sources.",
              ),
            )
          }

          setSources(
            Array.isArray(
              data.sources,
            )
              ? data.sources
              : [],
          )
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI knowledge sources.",
          )
        } finally {
          setLoading(false)
        }
      },
      [statusFilter],
    )

  useEffect(() => {
    void loadSources()
  }, [loadSources])

  const counts =
    useMemo(
      () => ({
        total:
          sources.length,

        ready:
          sources.filter(
            (source) =>
              source.status ===
              "ready",
          ).length,

        processing:
          sources.filter(
            (source) =>
              source.status ===
              "processing",
          ).length,

        pending:
          sources.filter(
            (source) =>
              source.status ===
              "pending",
          ).length,

        failed:
          sources.filter(
            (source) =>
              source.status ===
              "failed",
          ).length,
      }),
      [sources],
    )

  function resetForm() {
    setName("")
    setSourceType("url")
    setFileName("")
    setFileUrl("")
    setMimeType("")
    setFileSize("")
    setArticleId("")
    setEditingSource(null)
  }

  function openCreateForm() {
    resetForm()
    setError("")
    setSuccess("")
    setShowForm(true)
  }

  function openEditForm(
    source: KnowledgeSource,
  ) {
    setEditingSource(
      source,
    )

    setName(source.name)
    setSourceType(
      source.sourceType,
    )
    setFileName(
      source.fileName || "",
    )
    setFileUrl(
      source.fileUrl || "",
    )
    setMimeType(
      source.mimeType || "",
    )
    setFileSize(
      source.fileSize
        ? String(
            source.fileSize,
          )
        : "",
    )
    setArticleId(
      source.articleId || "",
    )

    setSelectedSource(
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

    setShowForm(false)
    resetForm()
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanName =
      name.trim()

    if (!cleanName) {
      setError(
        "Knowledge source name is required.",
      )
      return
    }

    if (
      sourceType === "url" &&
      !fileUrl.trim()
    ) {
      setError(
        "A source URL is required.",
      )
      return
    }

    if (
      sourceType === "article" &&
      !articleId.trim()
    ) {
      setError(
        "An article ID is required.",
      )
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const endpoint =
        editingSource
          ? `/api/ai/knowledge/${encodeURIComponent(
              editingSource.id,
            )}`
          : "/api/ai/knowledge"

      const method =
        editingSource
          ? "PATCH"
          : "POST"

      const parsedFileSize =
        fileSize.trim()
          ? Number(fileSize)
          : null

      if (
        parsedFileSize !== null &&
        (!Number.isFinite(
          parsedFileSize,
        ) ||
          parsedFileSize < 0)
      ) {
        throw new Error(
          "File size must be a valid non-negative number.",
        )
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
            body: JSON.stringify({
              name: cleanName,
              sourceType:
                sourceType.trim(),
              ...(articleId.trim()
                ? {
                    articleId:
                      articleId.trim(),
                  }
                : {}),
              ...(fileName.trim()
                ? {
                    fileName:
                      fileName.trim(),
                  }
                : {}),
              ...(fileUrl.trim()
                ? {
                    fileUrl:
                      fileUrl.trim(),
                  }
                : {}),
              ...(mimeType.trim()
                ? {
                    mimeType:
                      mimeType.trim(),
                  }
                : {}),
              ...(parsedFileSize !==
              null
                ? {
                    fileSize:
                      parsedFileSize,
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
          getErrorMessage(
            data,
            editingSource
              ? "Unable to update knowledge source."
              : "Unable to create knowledge source.",
          ),
        )
      }

      setSuccess(
        editingSource
          ? "Knowledge source updated successfully."
          : "Knowledge source created successfully. It is ready to be processed.",
      )

      setShowForm(false)
      resetForm()

      await loadSources()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to save knowledge source.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function processSource(
    source: KnowledgeSource,
  ) {
    if (
      source.status ===
      "processing"
    ) {
      return
    }

    if (!source.fileUrl) {
      setError(
        "This knowledge source does not have a file URL to process.",
      )
      return
    }

    setProcessingId(
      source.id,
    )

    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/knowledge/${encodeURIComponent(
            source.id,
          )}/process`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
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
            "Unable to process knowledge source.",
          ),
        )
      }

      setSuccess(
        "Knowledge source processing has started or completed successfully.",
      )

      await loadSources()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to process knowledge source.",
      )
    } finally {
      setProcessingId(null)
    }
  }

  async function updateSourceStatus(
    source: KnowledgeSource,
    nextStatus: "pending" | "archived",
  ) {
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/knowledge/${encodeURIComponent(
            source.id,
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
            "Unable to update knowledge source.",
          ),
        )
      }

      setSuccess(
        nextStatus ===
          "archived"
          ? "Knowledge source archived."
          : "Knowledge source restored to pending.",
      )

      setSelectedSource(
        null,
      )

      await loadSources()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to update knowledge source.",
      )
    }
  }

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
                Knowledge
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Knowledge
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Manage the documents and knowledge sources
              available to your organization's AI features.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Knowledge
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

      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {counts.total}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Ready
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {counts.ready}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Processing
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {counts.processing}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {counts.pending}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Failed
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {counts.failed}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Knowledge Sources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Only sources marked ready are available for
              AI knowledge retrieval.
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
                    | KnowledgeStatus,
                )
              }
              className="rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="ready">
                Ready
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="archived">
                Archived
              </option>
            </select>

            <button
              type="button"
              onClick={() =>
                void loadSources()
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
          ) : sources.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ◈
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No knowledge sources
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add documents, URLs, or knowledge articles
                that your AI assistant should be able to use.
              </p>

              <button
                type="button"
                onClick={
                  openCreateForm
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add First Source
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sources.map(
                (source) => {
                  const canProcess =
                    Boolean(
                      source.fileUrl,
                    ) &&
                    source.status !==
                      "processing" &&
                    source.status !==
                      "archived"

                  return (
                    <article
                      key={
                        source.id
                      }
                      className="rounded-2xl border p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {source.name}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[source.status]}`}
                            >
                              {
                                STATUS_LABELS[
                                  source.status
                                ]
                              }
                            </span>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              {source.sourceType}
                            </span>
                          </div>

                          {source.fileName && (
                            <p className="mt-2 text-sm text-slate-600">
                              File:{" "}
                              <span className="font-medium">
                                {
                                  source.fileName
                                }
                              </span>
                            </p>
                          )}

                          {source.fileUrl && (
                            <p className="mt-2 max-w-3xl truncate text-sm text-slate-500">
                              Source:{" "}
                              <span className="font-mono text-xs">
                                {
                                  source.fileUrl
                                }
                              </span>
                            </p>
                          )}

                          {source.articleId && (
                            <p className="mt-2 break-all font-mono text-xs text-slate-400">
                              Article ID:{" "}
                              {
                                source.articleId
                              }
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                            <span>
                              Size:{" "}
                              {formatFileSize(
                                source.fileSize,
                              )}
                            </span>

                            <span>
                              Created{" "}
                              {formatDate(
                                source.createdAt,
                              )}
                            </span>

                            <span>
                              Updated{" "}
                              {formatDate(
                                source.updatedAt,
                              )}
                            </span>
                          </div>

                          {source.error && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                              <strong>
                                Processing error:
                              </strong>{" "}
                              {
                                source.error
                              }
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSource(
                                source,
                              )
                            }
                            className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Details
                          </button>

                          {canProcess && (
                            <button
                              type="button"
                              onClick={() =>
                                void processSource(
                                  source,
                                )
                              }
                              disabled={
                                processingId ===
                                source.id
                              }
                              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              {processingId ===
                              source.id
                                ? "Processing..."
                                : source.status ===
                                    "failed"
                                  ? "Retry"
                                  : "Process"}
                            </button>
                          )}

                          {source.status ===
                            "ready" ||
                          source.status ===
                            "pending" ||
                          source.status ===
                            "failed" ? (
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  source,
                                )
                              }
                              className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                            >
                              Edit
                            </button>
                          ) : null}

                          {source.status !==
                            "archived" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateSourceStatus(
                                  source,
                                  "archived",
                                )
                              }
                              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                              Archive
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
          aria-labelledby="knowledge-form-title"
        >
          <div className="mx-auto my-8 max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <h2
                  id="knowledge-form-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {editingSource
                    ? "Edit Knowledge Source"
                    : "Add Knowledge Source"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a source that can be processed into the
                  organization's AI knowledge base.
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
                  htmlFor="knowledge-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Name
                </label>

                <input
                  id="knowledge-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  maxLength={200}
                  placeholder="Roofing Installation Guide"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="knowledge-type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Source Type
                </label>

                <select
                  id="knowledge-type"
                  value={sourceType}
                  onChange={(event) =>
                    setSourceType(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {SOURCE_TYPES.map(
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
                  htmlFor="knowledge-url"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Source URL
                </label>

                <input
                  id="knowledge-url"
                  type="url"
                  value={fileUrl}
                  onChange={(event) =>
                    setFileUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://example.com/document.pdf"
                  className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required={
                    sourceType ===
                    "url"
                  }
                />

                <p className="mt-2 text-xs text-slate-400">
                  The server validates the URL and downloads
                  the source securely during processing.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="knowledge-file-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    File Name
                  </label>

                  <input
                    id="knowledge-file-name"
                    type="text"
                    value={fileName}
                    onChange={(event) =>
                      setFileName(
                        event.target.value,
                      )
                    }
                    maxLength={255}
                    placeholder="guide.pdf"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="knowledge-mime"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    MIME Type
                  </label>

                  <input
                    id="knowledge-mime"
                    type="text"
                    value={mimeType}
                    onChange={(event) =>
                      setMimeType(
                        event.target.value,
                      )
                    }
                    maxLength={120}
                    placeholder="application/pdf"
                    className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="knowledge-size"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  File Size (bytes)
                </label>

                <input
                  id="knowledge-size"
                  type="number"
                  min="0"
                  value={fileSize}
                  onChange={(event) =>
                    setFileSize(
                      event.target.value,
                    )
                  }
                  placeholder="1048576"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="knowledge-article"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Knowledge Article ID
                </label>

                <input
                  id="knowledge-article"
                  type="text"
                  value={articleId}
                  onChange={(event) =>
                    setArticleId(
                      event.target.value,
                    )
                  }
                  placeholder="Optional article ID"
                  className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required={
                    sourceType ===
                    "article"
                  }
                />
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="font-semibold text-blue-800">
                  Processing lifecycle
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  New sources begin as <strong>pending</strong>.
                  Processing creates the AI vector-store
                  representation. The source is only marked
                  <strong> ready</strong> after processing
                  succeeds.
                </p>
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
                    : editingSource
                      ? "Save Changes"
                      : "Add Source"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="knowledge-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div className="min-w-0">
                <h2
                  id="knowledge-details-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  {selectedSource.name}
                </h2>

                <p className="mt-1 break-all font-mono text-xs text-slate-400">
                  {selectedSource.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedSource(
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
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_CLASSES[selectedSource.status]}`}
                >
                  {
                    STATUS_LABELS[
                      selectedSource.status
                    ]
                  }
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {
                    selectedSource.sourceType
                  }
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    File
                  </p>

                  <p className="mt-2 break-all font-medium text-slate-800">
                    {selectedSource.fileName ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    File Size
                  </p>

                  <p className="mt-2 font-medium text-slate-800">
                    {formatFileSize(
                      selectedSource.fileSize,
                    )}
                  </p>
                </div>
              </div>

              {selectedSource.fileUrl && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Source URL
                  </p>

                  <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-700">
                    {
                      selectedSource.fileUrl
                    }
                  </p>
                </div>
              )}

              {selectedSource.vectorStoreId && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Vector Store
                  </p>

                  <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs text-slate-700">
                    {
                      selectedSource.vectorStoreId
                    }
                  </p>
                </div>
              )}

              {selectedSource.vectorFileId && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Vector File
                  </p>

                  <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs text-slate-700">
                    {
                      selectedSource.vectorFileId
                    }
                  </p>
                </div>
              )}

              {selectedSource.error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="font-semibold text-red-800">
                    Processing Error
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {
                      selectedSource.error
                    }
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      selectedSource.createdAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Updated
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      selectedSource.updatedAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                {selectedSource.status ===
                  "archived" ? (
                  <button
                    type="button"
                    onClick={() =>
                      void updateSourceStatus(
                        selectedSource,
                        "pending",
                      )
                    }
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    Restore
                  </button>
                ) : (
                  <>
                    {selectedSource.fileUrl &&
                      selectedSource.status !==
                        "processing" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSource(
                              null,
                            )
                            void processSource(
                              selectedSource,
                            )
                          }}
                          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                          {selectedSource.status ===
                          "failed"
                            ? "Retry Processing"
                            : "Process Source"}
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(
                          selectedSource,
                        )
                      }
                      className="rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void updateSourceStatus(
                          selectedSource,
                          "archived",
                        )
                      }
                      className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
                    >
                      Archive
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSource(
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