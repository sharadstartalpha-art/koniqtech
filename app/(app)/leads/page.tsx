"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

type Column = {
  key: string
  label: string
}

type Row = {
  id: string
  [key: string]: any
}

interface Props {
  title: string
  buttonLabel?: string
  buttonHref?: string
  editPath?: string
  onDeletePath?: string
  rowHref?: string
  columns: Column[]
  rows: Row[]
}

export default function DataTable({
  title,
  buttonLabel,
  buttonHref,
  editPath,
  onDeletePath,
  rowHref,
  columns,
  rows
}: Props) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm("Delete this record?")) return

    const res = await fetch(
      `${onDeletePath}/${id}`,
      {
        method: "DELETE"
      }
    )

    if (res.ok) {
      window.location.reload()
    } else {
      alert("Delete failed")
    }
  }

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        {buttonHref && (
          <Link
            href={buttonHref}
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
            "
          >
            {buttonLabel}
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-semibold
                  "
                >
                  {col.label}
                </th>
              ))}

              {(editPath || onDeletePath) && (
                <th className="px-4 py-3 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>

            {rows.map(row => (

              <tr
                key={row.id}
                onClick={() => {
                  if (rowHref) {
                    router.push(
                      `${rowHref}/${row.id}`
                    )
                  }
                }}
                className={`
                  border-t
                  ${
                    rowHref
                      ? "cursor-pointer hover:bg-slate-50"
                      : ""
                  }
                `}
              >

                {columns.map(col => (
                  <td
                    key={col.key}
                    className="px-4 py-3"
                  >
                    {row[col.key]}
                  </td>
                ))}

                {(editPath || onDeletePath) && (
                  <td className="px-4 py-3">

                    <div className="flex justify-end gap-2">

                      {editPath && (
                        <Link
                          href={`${editPath}/${row.id}`}
                          onClick={e =>
                            e.stopPropagation()
                          }
                          className="
                            rounded
                            bg-amber-500
                            px-3
                            py-1
                            text-white
                          "
                        >
                          Edit
                        </Link>
                      )}

                      {onDeletePath && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleDelete(row.id)
                          }}
                          className="
                            rounded
                            bg-red-600
                            px-3
                            py-1
                            text-white
                          "
                        >
                          Delete
                        </button>
                      )}

                    </div>

                  </td>
                )}

              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </div>
  )
}