
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DataTable({
  title,
  buttonLabel,
  buttonHref,
  columns,
  rows,
  onDeletePath,
  editPath,
  rowHref,
  canCreate = true,
  canEdit = true,
  canDelete = true,
}: any) {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = (rows || []).filter((r: any) =>
    JSON.stringify(r)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalItems = filtered.length

  const totalPages =
    pageSize === -1
      ? 1
      : Math.max(1, Math.ceil(totalItems / pageSize))

  // Keep the selected page valid after searching or deleting rows.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const startIndex =
    pageSize === -1 ? 0 : (currentPage - 1) * pageSize

  const visibleRows =
    pageSize === -1
      ? filtered
      : filtered.slice(startIndex, startIndex + pageSize)

  const firstItem =
    totalItems === 0 ? 0 : startIndex + 1

  const lastItem =
    pageSize === -1
      ? totalItems
      : Math.min(startIndex + pageSize, totalItems)

  async function remove(id: string) {
    if (!confirm("Delete item?")) {
      return
    }

    const response = await fetch(
      `${onDeletePath}/${id}`,
      {
        method: "DELETE",
      }
    )

    if (!response.ok) {
      alert("Unable to delete this item. Please try again.")
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-[44px] font-semibold tracking-[-1px] text-black">
          {title}
        </h1>

        {buttonHref && canCreate && (
          <Link
            href={buttonHref}
            className="h-11 px-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-sm font-medium flex items-center shrink-0"
          >
            {buttonLabel}
          </Link>
        )}
      </div>

      {/* Table container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        {/* Search and page-size controls */}
        <div className="min-h-16 px-4 sm:px-6 py-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search..."
            className="h-10 w-full sm:w-[320px] bg-[#f5f5f5] border border-slate-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          />

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <label htmlFor="customer-page-size">
              Rows per page
            </label>

            <select
              id="customer-page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={-1}>All</option>
            </select>

            <span className="sm:ml-2">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Responsive table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="bg-[#fafafa] border-b text-sm">
                <th className="px-6 h-11 text-left font-semibold">
                  SL
                </th>

                {(columns || []).map((c: any) => (
                  <th
                    key={c.key}
                    className="px-6 h-11 text-left font-medium"
                  >
                    {c.label}
                  </th>
                ))}

                <th className="px-6 text-left font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row: any, index: number) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    if (rowHref) {
                      router.push(`${rowHref}/${row.id}`)
                    }
                  }}
                  className={`border-b last:border-b-0 hover:bg-[#fafafa] text-sm ${
                    rowHref ? "cursor-pointer" : ""
                  }`}
                >
                  <td className="px-6 h-14">
                    {startIndex + index + 1}
                  </td>

                  {(columns || []).map((c: any) => (
                    <td key={c.key} className="px-6 py-3">
                      {row[c.key]}
                    </td>
                  ))}

                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {editPath && canEdit && (
                        <Link
                          href={`${editPath}/${row.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs flex items-center"
                        >
                          Edit
                        </Link>
                      )}

                      {onDeletePath && canDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            remove(row.id)
                          }}
                          className="px-3 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={(columns || []).length + 2}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    {search
                      ? "No matching records found."
                      : "No records available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="min-h-16 px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div>
            Showing {firstItem}–{lastItem} of {totalItems} items
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              className="px-3 h-9 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-2 whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="px-3 h-9 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
