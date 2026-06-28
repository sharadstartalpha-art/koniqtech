"use client"

import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"

import clsx from "clsx"

import {
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

export interface DataColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  className?: string
  headerClassName?: string

  render?: (
    value: T[keyof T],
    row: T
  ) => ReactNode
}

export interface RowAction<T> {
  label: string
  icon?: ReactNode
  variant?: "default" | "danger"

  onClick: (
    row: T
  ) => void
}

export interface BulkAction<T> {
  label: string
  icon?: ReactNode

  onClick: (
    rows: T[]
  ) => void
}

interface Props<T extends { id: string }> {
  title?: string

  columns: DataColumn<T>[]

  data: T[]

  loading?: boolean

  selectable?: boolean

  pageSize?: number

  searchPlaceholder?: string

  rowActions?: RowAction<T>[]

  bulkActions?: BulkAction<T>[]
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminDataTable<
  T extends { id: string }
>({
  title,
  columns,
  data,

  loading = false,

  selectable = true,

  pageSize = 10,

  searchPlaceholder = "Search...",

  rowActions = [],

  bulkActions = [],
}: Props<T>) {

  /* =======================================================
     STATE
  ======================================================= */

  const [search, setSearch] =
    useState("")

  const [page, setPage] =
    useState(1)

  const [selected, setSelected] =
    useState<string[]>([])

  const [sortKey, setSortKey] =
    useState<keyof T | null>(null)

  const [ascending, setAscending] =
    useState(true)

  /* =======================================================
     RESET PAGE WHEN SEARCH CHANGES
  ======================================================= */

  useEffect(() => {
    setPage(1)
  }, [search])

  /* =======================================================
     TOGGLE ROW
  ======================================================= */

  function toggleRow(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  /* =======================================================
     SORT
  ======================================================= */

  function handleSort(
    key: keyof T
  ) {
    if (sortKey === key) {
      setAscending((v) => !v)
      return
    }

    setSortKey(key)
    setAscending(true)
  }

  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return data
    }

    const q =
      search.toLowerCase()

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(q)
      )
    )
  }, [data, search])

  /* =======================================================
     PART 2 CONTINUES HERE
  ======================================================= */
    /* =======================================================
     SORTED DATA
  ======================================================= */

  const sorted = useMemo(() => {
    if (!sortKey) {
      return filtered
    }

    const rows = [...filtered]

    rows.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]

      if (av === bv) return 0

      if (av == null) return 1
      if (bv == null) return -1

      if (typeof av === "number" && typeof bv === "number") {
        return ascending ? av - bv : bv - av
      }

      if (av instanceof Date && bv instanceof Date) {
        return ascending
          ? av.getTime() - bv.getTime()
          : bv.getTime() - av.getTime()
      }

      const result = String(av).localeCompare(String(bv))

      return ascending ? result : -result
    })

    return rows
  }, [filtered, sortKey, ascending])

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / pageSize)
  )

  const currentPage = Math.min(
    page,
    totalPages
  )

  const paginated = useMemo(() => {
    const start =
      (currentPage - 1) * pageSize

    return sorted.slice(
      start,
      start + pageSize
    )
  }, [
    sorted,
    currentPage,
    pageSize,
  ])

  /* =======================================================
     RESET PAGE IF OUT OF RANGE
  ======================================================= */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  /* =======================================================
     SELECTED ROWS
  ======================================================= */

  const selectedRows = useMemo(() => {
    return data.filter((row) =>
      selected.includes(row.id)
    )
  }, [data, selected])

  /* =======================================================
     TOGGLE ALL
  ======================================================= */

  function toggleAll() {
    if (
      paginated.length > 0 &&
      paginated.every((row) =>
        selected.includes(row.id)
      )
    ) {
      setSelected((prev) =>
        prev.filter(
          (id) =>
            !paginated.some(
              (row) => row.id === id
            )
        )
      )

      return
    }

    const ids = paginated.map(
      (row) => row.id
    )

    setSelected((prev) => [
      ...new Set([
        ...prev,
        ...ids,
      ]),
    ])
  }

  /* =======================================================
     SELECTED ON CURRENT PAGE
  ======================================================= */

  const allSelected =
    paginated.length > 0 &&
    paginated.every((row) =>
      selected.includes(row.id)
    )

  /* =======================================================
     START RENDER
  ======================================================= */

  return (
        <div
      className="
        overflow-hidden
        rounded-3xl
        border
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          border-b
          p-6
          dark:border-slate-800
        "
      >
        <div>
          {title && (
            <h2 className="text-xl font-semibold">
              {title}
            </h2>
          )}

          <p className="mt-1 text-sm text-slate-500">
            {sorted.length} record
            {sorted.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search
            size={18}
            className="
              absolute
              left-4
              top-3.5
              text-slate-400
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder={searchPlaceholder}
            className="
              h-11
              w-full
              rounded-xl
              border
              bg-slate-50
              pl-11
              pr-4
              outline-none
              transition
              focus:ring-2
              focus:ring-orange-500
              dark:border-slate-700
              dark:bg-slate-800
            "
          />
        </div>
      </div>

      {/* ==========================================
          BULK ACTION BAR
      ========================================== */}

      {selected.length > 0 &&
        bulkActions.length > 0 && (
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
              border-b
              bg-orange-50
              px-6
              py-4
              dark:border-slate-800
              dark:bg-orange-950/20
            "
          >
            <div className="font-medium text-orange-700 dark:text-orange-300">
              {selected.length} selected
            </div>

            <div className="flex flex-wrap gap-2">
              {bulkActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() =>
                    action.onClick(selectedRows)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-orange-600
                    px-4
                    py-2
                    text-sm
                    text-white
                    transition
                    hover:bg-orange-700
                  "
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* ==========================================
          TABLE
      ========================================== */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead
            className="
              sticky
              top-0
              z-10
              border-b
              bg-slate-50
              dark:border-slate-800
              dark:bg-slate-800
            "
          >
            <tr>

              {selectable && (
                <th className="w-14 px-4 py-4">

                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4"
                  />

                </th>
              )}

              {columns.map((column) => (

                <th
                  key={String(column.key)}
                  style={{
                    width: column.width,
                  }}
                  className={clsx(
                    "px-6 py-4 text-left text-sm font-semibold",
                    "text-slate-700 dark:text-slate-200",
                    column.headerClassName
                  )}
                >
                  {column.sortable ? (
                    <button
                      onClick={() =>
                        handleSort(column.key)
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        hover:text-orange-600
                      "
                    >
                      {column.label}

                      {sortKey === column.key ? (
                        ascending ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : (
                        <ChevronDown
                          size={16}
                          className="opacity-30"
                        />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>

              ))}

              {rowActions.length > 0 && (
                <th className="w-44 px-6 py-4 text-right">
                  Actions
                </th>
              )}

            </tr>

          </thead>

          <tbody>
                      {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (selectable ? 1 : 0) +
                  (rowActions.length > 0 ? 1 : 0)
                }
                className="py-20"
              >
                <div className="flex justify-center">
                  <Loader2
                    size={30}
                    className="animate-spin text-orange-600"
                  />
                </div>
              </td>
            </tr>
          )}

          {/* ==========================================
              EMPTY STATE
          ========================================== */}

          {!loading && paginated.length === 0 && (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (selectable ? 1 : 0) +
                  (rowActions.length > 0 ? 1 : 0)
                }
                className="
                  py-20
                  text-center
                  text-slate-500
                "
              >
                No records found.
              </td>
            </tr>
          )}

          {/* ==========================================
              ROWS
          ========================================== */}

          {!loading &&
            paginated.map((row) => (
              <tr
                key={row.id}
                className="
                  border-b
                  transition
                  hover:bg-slate-50
                  dark:border-slate-800
                  dark:hover:bg-slate-800/40
                "
              >
                {/* Checkbox */}

                {selectable && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        row.id
                      )}
                      onChange={() =>
                        toggleRow(row.id)
                      }
                      className="h-4 w-4"
                    />
                  </td>
                )}

                {/* Data */}

                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={clsx(
                      "px-6 py-4 text-sm",
                      "text-slate-700 dark:text-slate-300",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(
                          row[column.key],
                          row
                        )
                      : String(
                          row[column.key] ?? ""
                        )}
                  </td>
                ))}

                {/* Actions */}

                {rowActions.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {rowActions.map(
                        (action) => (
                          <button
                            key={action.label}
                            onClick={() =>
                              action.onClick(row)
                            }
                            className={clsx(
                              "rounded-lg px-3 py-1.5 text-sm transition",
                              action.variant ===
                                "danger"
                                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                : "hover:bg-slate-100 dark:hover:bg-slate-700"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {action.icon}
                              {action.label}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}

          </tbody>

        </table>

      </div>

            {/* ==========================================
          FOOTER
      ========================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          border-t
          bg-slate-50
          px-6
          py-4
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* Record Counter */}

        <div className="text-sm text-slate-500">
          Showing{" "}
          <strong>
            {sorted.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
          </strong>{" "}
          -{" "}
          <strong>
            {Math.min(
              currentPage * pageSize,
              sorted.length
            )}
          </strong>{" "}
          of{" "}
          <strong>{sorted.length}</strong>{" "}
          records
        </div>

        {/* Pagination */}

        <div className="flex items-center gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            className={clsx(
              "rounded-lg border px-4 py-2 transition",
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-white dark:hover:bg-slate-800"
            )}
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() =>
                setPage(pageNumber)
              }
              className={clsx(
                "h-10 w-10 rounded-lg border transition",
                currentPage === pageNumber
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              {pageNumber}
            </button>
          ))}

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            className={clsx(
              "rounded-lg border px-4 py-2 transition",
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-white dark:hover:bg-slate-800"
            )}
          >
            Next
          </button>

        </div>

      </div>

    </div>
  )
}