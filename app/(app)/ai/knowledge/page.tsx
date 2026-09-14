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
    "bg-slate-100 text-slate-500",
}

function formatDate(
  value: string,
) {
  const date = new Date(value)

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
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`
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

function sourceTypeLabel(
  sourceType: string,
) {
  const normalized =
    sourceType
      .trim()
      .toLowerCase()

  if (
    normalized ===
    "url"
  ) {
    return "URL"
  }

  if (
    normalized ===
    "file"
  ) {
    return "File"
  }

  if (
    normalized ===
    "article"
  ) {
    return "CRM Article"
  }

  return sourceType || "Source"
}

export default function AIKnowledgePage() {
  const [sources, setSources] =
    useState<KnowledgeSource[]>(
      [],
    )

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | KnowledgeStatus
    >("all")

  const [showAddForm, setShowAddForm] =
    useState(false)

  const [selectedSource, setSelectedSource] =
    useState<KnowledgeSource | null>(
      null,
    )

  const [name, setName] =
    useState("")

  const [sourceType, setSourceType] =
    useState("url")

  const [fileUrl, setFileUrl] =
    useState("")

  const [fileName, setFileName] =
    useState("")

  const [mimeType, setMimeType] =
    useState("")

  const [articleId, setArticleId] =
    useState("")

  const loadSources =
    useCallback(async () => {
      setLoading(true)
      setError("")

      try {
        const query =
          statusFilter === "all"
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
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load AI knowledge sources.",
        )
      } finally {
        setLoading(false)
      }
    }, [statusFilter])

  useEffect(() => {
    void loadSources()
  }, [loadSources])

  const counts =
    useMemo(() => {
      return {
        total: sources.length,
        ready: sources.filter(
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
        failed:
          sources.filter(
            (source) =>
              source.status ===
              "failed",
          ).length,
      }
    }, [sources])

  function resetForm() {
    setName("")
    setSourceType("url")
    setFileUrl("")
    setFileName("")
    setMimeType("")
    setArticleId("")
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanName =
      name.trim()

    if (!cleanName) {
      setError(
        "A knowledge source name is required.",
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
        "A CRM article ID is required.",
      )
      return
    }

    if (
      sourceType === "file" &&
      !fileUrl.trim()
    ) {
      setError(
        "A file URL is required for this source.",
      )
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          "/api/ai/knowledge",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: cleanName,
              sourceType:
                sourceType.trim(),
              ...(fileUrl.trim()
                ? {
                    fileUrl:
                      fileUrl.trim(),
                  }
                : {}),
              ...(fileName.trim()
                ? {
                    fileName:
                      fileName.trim(),
                  }
                : {}),
              ...(mimeType.trim()
                ? {
                    mimeType:
                      mimeType.trim(),
                  }
                : {}),
              ...(articleId.trim()
                ? {
                    articleId:
                      articleId.trim(),
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
            "Unable to create knowledge source.",
          ),
        )
      }

      setSuccess(
        "Knowledge source added successfully.",
      )

      resetForm()
      setShowAddForm(false)

      await loadSources()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create knowledge source.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function processSource(
    source: KnowledgeSource,
  ) {
    if (
      processingId ||
      source.status ===
        "processing" ||
      source.status ===
        "archived"
    ) {
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
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to process knowledge source.",
      )

      await loadSources()
    } finally {
      setProcessingId(null)
    }
  }

  async function archiveSource(
    source: KnowledgeSource,
  ) {
    const confirmed =
      window.confirm(
        `Archive "${source.name}"?`,
      )

    if (!confirmed) {
      return
    }

    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/knowledge/${encodeURIComponent(
            source.id,
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
            "Unable to archive knowledge source.",
          ),
        )
      }

      setSuccess(
        "Knowledge source archived successfully.",
      )

      setSelectedSource(
        null,
      )

      await loadSources()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to archive knowledge source.",
      )
    }
  }

  async function restoreSource(
    source: KnowledgeSource,
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
              status: "pending",
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
            "Unable to restore knowledge source.",
          ),
        )
      }

      setSuccess(
        "Knowledge source restored and queued for processing.",
      )

      setSelectedSource(
        null,
      )

      await loadSources()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to restore knowledge source.",
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
                href="/ai"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                AI
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
              Manage the documents, URLs, and CRM
              knowledge sources available to your AI
              assistants.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowAddForm(
                (current) =>
                  !current,
              )
              setError("")
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {showAddForm
              ? "Close"
              : "Add Knowledge Source"}
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

      {showAddForm && (
        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Add Knowledge Source
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a source that the AI knowledge system
              can process and index.
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="knowledge-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Source Name
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
                  <option value="url">
                    URL
                  </option>

                  <option value="file">
                    File URL
                  </option>

                  <option value="article">
                    CRM Article
                  </option>
                </select>
              </div>
            </div>

            {(sourceType ===
              "url" ||
              sourceType ===
                "file") && (
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
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <p className="mt-2 text-xs text-slate-400">
                  The server validates the URL before
                  attempting knowledge processing.
                </p>
              </div>
            )}

            {sourceType ===
              "article" && (
              <div>
                <label
                  htmlFor="knowledge-article"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  CRM Article ID
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
                  placeholder="Knowledge article ID"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            )}

            {sourceType ===
              "file" && (
              <div className="grid gap-5 md:grid-cols-2">
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
                    placeholder="installation-guide.pdf"
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
                    placeholder="application/pdf"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowAddForm(
                    false,
                  )
                }}
                className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting
                  ? "Adding..."
                  : "Add Source"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Sources
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
              Sources are processed securely before they
              become available to AI search.
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
                    className="h-36 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : sources.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                ✦
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No knowledge sources
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add your first URL, file source, or CRM
                knowledge article to give your AI assistant
                additional knowledge.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(
                    true,
                  )
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Knowledge Source
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sources.map(
                (source) => {
                  const canProcess =
                    source.status ===
                      "pending" ||
                    source.status ===
                      "failed"

                  return (
                    <article
                      key={source.id}
                      className="rounded-2xl border p-5 transition hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-bold text-slate-900">
                              {source.name}
                            </h3>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              {sourceTypeLabel(
                                source.sourceType,
                              )}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[source.status]}`}
                            >
                              {
                                STATUS_LABELS[
                                  source.status
                                ]
                              }
                            </span>
                          </div>

                          {source.fileName && (
                            <p className="mt-2 text-sm text-slate-600">
                              {source.fileName}
                            </p>
                          )}

                          {source.fileUrl && (
                            <p className="mt-2 truncate text-sm text-blue-600">
                              {source.fileUrl}
                            </p>
                          )}

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Created
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  source.createdAt,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Updated
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  source.updatedAt,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                File Size
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatFileSize(
                                  source.fileSize,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Vector Index
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {source.vectorFileId
                                  ? "Indexed"
                                  : "Not indexed"}
                              </p>
                            </div>
                          </div>

                          {source.error && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                              <span className="font-semibold">
                                Processing error:
                              </span>{" "}
                              {source.error}
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
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
                              disabled={
                                processingId !==
                                null
                              }
                              onClick={() =>
                                void processSource(
                                  source,
                                )
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
                            "archived" ? (
                            <button
                              type="button"
                              onClick={() =>
                                void restoreSource(
                                  source,
                                )
                              }
                              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                source.status ===
                                "processing"
                              }
                              onClick={() =>
                                void archiveSource(
                                  source,
                                )
                              }
                              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  Knowledge Source
                </h2>

                <p className="mt-1 truncate font-medium text-slate-600">
                  {selectedSource.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedSource(
                    null,
                  )
                }
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {sourceTypeLabel(
                    selectedSource.sourceType,
                  )}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_CLASSES[selectedSource.status]}`}
                >
                  {
                    STATUS_LABELS[
                      selectedSource.status
                    ]
                  }
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Source ID
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-slate-700">
                    {selectedSource.id}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    File Size
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
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

                  <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 text-sm text-blue-600">
                    {selectedSource.fileUrl}
                  </p>
                </div>
              )}

              {selectedSource.fileName && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    File Name
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {selectedSource.fileName}
                  </p>
                </div>
              )}

              {selectedSource.mimeType && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    MIME Type
                  </p>

                  <p className="mt-2 font-mono text-sm text-slate-700">
                    {selectedSource.mimeType}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(
                      selectedSource.createdAt,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(
                      selectedSource.updatedAt,
                    )}
                  </p>
                </div>
              </div>

              {selectedSource.vectorStoreId && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Vector Store ID
                  </p>

                  <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs text-slate-600">
                    {
                      selectedSource.vectorStoreId
                    }
                  </p>
                </div>
              )}

              {selectedSource.vectorFileId && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Vector File ID
                  </p>

                  <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs text-slate-600">
                    {
                      selectedSource.vectorFileId
                    }
                  </p>
                </div>
              )}

              {selectedSource.error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                    Processing Error
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-700">
                    {selectedSource.error}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
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

                {selectedSource.status ===
                  "archived" ? (
                  <button
                    type="button"
                    onClick={() =>
                      void restoreSource(
                        selectedSource,
                      )
                    }
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    Restore Source
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={
                      selectedSource.status ===
                      "processing"
                    }
                    onClick={() =>
                      void archiveSource(
                        selectedSource,
                      )
                    }
                    className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Archive Source
                  </button>
                )}

                {(selectedSource.status ===
                    "pending" ||
                  selectedSource.status ===
                    "failed") && (
                  <button
                    type="button"
                    disabled={
                      processingId !==
                      null
                    }
                    onClick={() => {
                      setSelectedSource(
                        null,
                      )
                      void processSource(
                        selectedSource,
                      )
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
                  >
                    {processingId ===
                    selectedSource.id
                      ? "Processing..."
                      : "Process Source"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}