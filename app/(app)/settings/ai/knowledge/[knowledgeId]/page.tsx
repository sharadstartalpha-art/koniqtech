"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

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
  knowledge?: KnowledgeSource
  source?: KnowledgeSource
  knowledgeSource?: KnowledgeSource
  data?: KnowledgeSource
}

function formatDate(
  value: string | null | undefined,
) {
  if (!value) {
    return "—"
  }

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
    bytes === undefined ||
    !Number.isFinite(bytes)
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
    (1024 *
      1024 *
      1024)
  ).toFixed(1)} GB`
}

function formatJson(
  value: unknown,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "No metadata"
  }

  try {
    return JSON.stringify(
      value,
      null,
      2,
    )
  } catch {
    return String(value)
  }
}

function getStatusClasses(
  status: KnowledgeStatus,
) {
  switch (status) {
    case "ready":
      return "border-emerald-200 bg-emerald-100 text-emerald-700"

    case "processing":
      return "border-blue-200 bg-blue-100 text-blue-700"

    case "pending":
      return "border-amber-200 bg-amber-100 text-amber-700"

    case "failed":
      return "border-red-200 bg-red-100 text-red-700"

    case "archived":
      return "border-slate-200 bg-slate-100 text-slate-600"

    default:
      return "border-slate-200 bg-slate-100 text-slate-600"
  }
}

function getStatusLabel(
  status: KnowledgeStatus,
) {
  switch (status) {
    case "ready":
      return "Ready"

    case "processing":
      return "Processing"

    case "pending":
      return "Pending"

    case "failed":
      return "Failed"

    case "archived":
      return "Archived"

    default:
      return status
  }
}

function getResponseSource(
  data: ApiResponse,
) {
  return (
    data.knowledge ||
    data.source ||
    data.knowledgeSource ||
    data.data ||
    null
  )
}

export default function AiKnowledgeDetailPage() {
  const params =
    useParams()

  const router =
    useRouter()

  const knowledgeIdParam =
    params?.knowledgeId

  const knowledgeId =
    Array.isArray(
      knowledgeIdParam,
    )
      ? knowledgeIdParam[0]
      : knowledgeIdParam

  const [source, setSource] =
    useState<KnowledgeSource | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [processing, setProcessing] =
    useState(false)

  const [archiving, setArchiving] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [polling, setPolling] =
    useState(false)

  const [showMetadata, setShowMetadata] =
    useState(false)

  const loadSource =
    useCallback(
      async (
        options?: {
          silent?: boolean
        },
      ) => {
        if (!knowledgeId) {
          setError(
            "Knowledge source ID is missing.",
          )
          setLoading(false)
          return
        }

        const silent =
          options?.silent === true

        if (!silent) {
          setRefreshing(true)
        }

        try {
          const response =
            await fetch(
              `/api/ai/knowledge/${encodeURIComponent(
                knowledgeId,
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
            data.success ===
              false
          ) {
            throw new Error(
              data.error ||
                data.message ||
                "Unable to load knowledge source.",
            )
          }

          const nextSource =
            getResponseSource(
              data,
            )

          if (!nextSource) {
            throw new Error(
              "Knowledge source was not returned by the server.",
            )
          }

          setSource(
            nextSource,
          )

          if (
            nextSource.status ===
            "processing"
          ) {
            setPolling(
              true,
            )
          } else {
            setPolling(
              false,
            )
          }

          setError("")
        } catch (
          caughtError
        ) {
          if (!silent) {
            setError(
              caughtError instanceof
                Error
                ? caughtError.message
                : "Unable to load knowledge source.",
            )
          }
        } finally {
          setLoading(false)
          setRefreshing(false)
        }
      },
      [knowledgeId],
    )

  useEffect(() => {
    void loadSource()
  }, [loadSource])

  /*
   * --------------------------------------------------------------------------
   * PROCESSING POLLING
   * --------------------------------------------------------------------------
   *
   * Processing is asynchronous on the backend.
   *
   * We poll only while the source is actually processing.
   * Polling stops automatically when the source becomes:
   *
   * ready / failed / archived / pending
   */

  useEffect(() => {
    if (
      !source ||
      source.status !==
        "processing"
    ) {
      return
    }

    setPolling(true)

    const interval =
      window.setInterval(
        () => {
          void loadSource({
            silent: true,
          })
        },
        3000,
      )

    return () =>
      window.clearInterval(
        interval,
      )
  }, [
    source?.status,
    loadSource,
  ])

  async function processSource() {
    if (!source) {
      return
    }

    if (
      source.status ===
        "processing" ||
      processing
    ) {
      return
    }

    if (
      source.status ===
      "archived"
    ) {
      setError(
        "Archived knowledge sources must be restored before processing.",
      )
      return
    }

    if (!source.fileUrl) {
      setError(
        "This knowledge source does not have a file URL to process.",
      )
      return
    }

    setProcessing(
      true,
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
        data.success ===
          false
      ) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to start knowledge processing.",
        )
      }

      const returnedSource =
        getResponseSource(
          data,
        )

      if (
        returnedSource
      ) {
        setSource(
          returnedSource,
        )
      } else {
        setSource(
          (
            current,
          ) =>
            current
              ? {
                  ...current,
                  status:
                    "processing",
                  error:
                    null,
                  updatedAt:
                    new Date().toISOString(),
                }
              : current,
        )
      }

      setPolling(
        true,
      )

      setSuccess(
        "Knowledge processing has started. This page will update automatically.",
      )
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to start processing.",
      )
    } finally {
      setProcessing(
        false,
      )
    }
  }

  async function archiveSource() {
    if (!source) {
      return
    }

    if (
      source.status ===
      "processing"
    ) {
      setError(
        "A knowledge source cannot be archived while it is processing.",
      )
      return
    }

    setArchiving(
      true,
    )

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
        data.success ===
          false
      ) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to archive knowledge source.",
        )
      }

      const returnedSource =
        getResponseSource(
          data,
        )

      if (
        returnedSource
      ) {
        setSource(
          returnedSource,
        )
      } else {
        setSource(
          (
            current,
          ) =>
            current
              ? {
                  ...current,
                  status:
                    "archived",
                  updatedAt:
                    new Date().toISOString(),
                }
              : current,
        )
      }

      setSuccess(
        "Knowledge source archived.",
      )
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to archive knowledge source.",
      )
    } finally {
      setArchiving(
        false,
      )
    }
  }

  const isProcessing =
    source?.status ===
    "processing"

  const canProcess =
    Boolean(
      source &&
        source.fileUrl &&
        source.status !==
          "processing" &&
        source.status !==
          "archived",
    )

  const statusDescription =
    useMemo(() => {
      if (!source) {
        return ""
      }

      switch (
        source.status
      ) {
        case "pending":
          return "This source is waiting to be processed."

        case "processing":
          return "The source is currently being processed and indexed. This page checks for updates automatically."

        case "ready":
          return "This source has finished processing and is available to the AI knowledge system."

        case "failed":
          return "Processing failed. Review the error below and retry when appropriate."

        case "archived":
          return "This source is archived and is not available to the AI knowledge system."

        default:
          return ""
      }
    }, [source])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 pb-10">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />

        <div className="h-52 animate-pulse rounded-3xl bg-slate-100" />

        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </main>
    )
  }

  if (!source) {
    return (
      <main className="mx-auto max-w-6xl pb-10">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Knowledge Source Not Found
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            {error ||
              "The requested knowledge source could not be found or is no longer accessible."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/settings/ai/knowledge",
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Knowledge
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-10">
      {/* Header */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/settings/ai"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                AI Settings
              </Link>

              <span className="text-slate-300">
                /
              </span>

              <Link
                href="/settings/ai/knowledge"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Knowledge
              </Link>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Details
              </span>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                ◈
              </div>

              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900">
                  {source.name}
                </h1>

                <p className="mt-2 break-all font-mono text-xs text-slate-400">
                  {source.id}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClasses(
                source.status,
              )}`}
            >
              {source.status ===
                "processing" && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
              )}

              {getStatusLabel(
                source.status,
              )}
            </span>

            <button
              type="button"
              onClick={() =>
                void loadSource()
              }
              disabled={
                refreshing
              }
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </section>
      )}

      {success && (
        <section
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {success}
        </section>
      )}

      {/* Processing status */}
      <section
        className={`rounded-3xl border p-6 shadow-sm ${
          source.status ===
          "processing"
            ? "border-blue-200 bg-blue-50"
            : source.status ===
                "failed"
              ? "border-red-200 bg-red-50"
              : source.status ===
                  "ready"
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                source.status ===
                "processing"
                  ? "bg-blue-100 text-blue-700"
                  : source.status ===
                      "failed"
                    ? "bg-red-100 text-red-700"
                    : source.status ===
                        "ready"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
              }`}
            >
              {source.status ===
              "processing"
                ? "↻"
                : source.status ===
                    "ready"
                  ? "✓"
                  : source.status ===
                      "failed"
                    ? "!"
                    : "◷"}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {source.status ===
                "processing"
                  ? "Processing Knowledge Source"
                  : source.status ===
                      "ready"
                    ? "Knowledge Source Ready"
                    : source.status ===
                        "failed"
                      ? "Processing Failed"
                      : "Knowledge Source Status"}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                {
                  statusDescription
                }
              </p>

              {isProcessing &&
                polling && (
                  <p className="mt-2 text-xs font-semibold text-blue-700">
                    ● Live status monitoring
                    is active
                  </p>
                )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {canProcess && (
              <button
                type="button"
                onClick={() =>
                  void processSource()
                }
                disabled={
                  processing
                }
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {processing
                  ? "Starting..."
                  : source.status ===
                      "failed"
                    ? "Retry Processing"
                    : "Process Source"}
              </button>
            )}

            {source.status ===
              "archived" && (
              <button
                type="button"
                onClick={async () => {
                  setError("")
                  setSuccess("")

                  try {
                    const response =
                      await fetch(
                        `/api/ai/knowledge/${encodeURIComponent(
                          source.id,
                        )}`,
                        {
                          method:
                            "PATCH",
                          headers: {
                            "Content-Type":
                              "application/json",
                          },
                          body: JSON.stringify(
                            {
                              status:
                                "pending",
                            },
                          ),
                        },
                      )

                    const data =
                      (await response.json()) as ApiResponse

                    if (
                      !response.ok ||
                      data.success ===
                        false
                    ) {
                      throw new Error(
                        data.error ||
                          data.message ||
                          "Unable to restore knowledge source.",
                      )
                    }

                    const restored =
                      getResponseSource(
                        data,
                      )

                    if (
                      restored
                    ) {
                      setSource(
                        restored,
                      )
                    } else {
                      setSource(
                        (
                          current,
                        ) =>
                          current
                            ? {
                                ...current,
                                status:
                                  "pending",
                                error:
                                  null,
                                updatedAt:
                                  new Date().toISOString(),
                              }
                            : current,
                      )
                    }

                    setSuccess(
                      "Knowledge source restored.",
                    )
                  } catch (
                    caughtError
                  ) {
                    setError(
                      caughtError instanceof
                        Error
                        ? caughtError.message
                        : "Unable to restore knowledge source.",
                    )
                  }
                }}
                className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Restore
              </button>
            )}
          </div>
        </div>

        {source.status ===
          "processing" && (
          <div className="mt-6 overflow-hidden rounded-full bg-blue-100">
            <div className="h-2 w-2/3 animate-pulse rounded-full bg-blue-500" />
          </div>
        )}

        {source.status ===
          "failed" &&
          source.error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                Processing Error
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-700">
                {source.error}
              </p>
            </div>
          )}
      </section>

      {/* Source information */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Source Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Details about this knowledge source and its
            processing state.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            label="Source Type"
            value={
              source.sourceType
            }
          />

          <InfoCard
            label="File Name"
            value={
              source.fileName
            }
          />

          <InfoCard
            label="MIME Type"
            value={
              source.mimeType
            }
          />

          <InfoCard
            label="File Size"
            value={formatFileSize(
              source.fileSize,
            )}
          />

          <InfoCard
            label="Created"
            value={formatDate(
              source.createdAt,
            )}
          />

          <InfoCard
            label="Last Updated"
            value={formatDate(
              source.updatedAt,
            )}
          />

          <InfoCard
            label="Article ID"
            value={
              source.articleId
            }
            mono
          />

          <InfoCard
            label="Vector Store ID"
            value={
              source.vectorStoreId
            }
            mono
          />

          <InfoCard
            label="Vector File ID"
            value={
              source.vectorFileId
            }
            mono
          />
        </div>
      </section>

      {/* File URL */}
      {source.fileUrl && (
        <section className="rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Source File
            </h2>
          </div>

          <div className="p-6">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                File URL
              </p>

              <p className="mt-2 break-all font-mono text-xs leading-6 text-slate-600">
                {source.fileUrl}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <button
          type="button"
          onClick={() =>
            setShowMetadata(
              (current) =>
                !current,
            )
          }
          className="flex w-full items-center justify-between gap-4 p-6 text-left"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Metadata
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Additional metadata associated with this source.
            </p>
          </div>

          <span className="text-xl text-slate-400">
            {showMetadata
              ? "⌃"
              : "⌄"}
          </span>
        </button>

        {showMetadata && (
          <div className="border-t p-6">
            <pre className="max-h-[400px] overflow-auto rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
              {formatJson(
                source.metadata,
              )}
            </pre>
          </div>
        )}
      </section>

      {/* Danger zone */}
      {source.status !==
        "archived" && (
        <section className="rounded-3xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 p-6">
            <h2 className="text-xl font-bold text-red-700">
              Archive Knowledge Source
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Archiving removes this source from normal AI
              knowledge use without permanently deleting the
              record.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              You can restore an archived source later from
              the knowledge management area.
            </p>

            <button
              type="button"
              onClick={() => {
                const confirmed =
                  window.confirm(
                    "Archive this knowledge source?",
                  )

                if (
                  confirmed
                ) {
                  void archiveSource()
                }
              }}
              disabled={
                archiving ||
                source.status ===
                  "processing"
              }
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {archiving
                ? "Archiving..."
                : "Archive Source"}
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/settings/ai/knowledge"
          className="w-fit rounded-xl border px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to Knowledge
        </Link>

        <p className="text-xs text-slate-400">
          Knowledge Source ID:{" "}
          <span className="font-mono">
            {source.id}
          </span>
        </p>
      </div>
    </main>
  )
}

function InfoCard({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string | null
  mono?: boolean
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 break-all text-sm font-semibold text-slate-700 ${
          mono
            ? "font-mono text-xs"
            : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  )
}