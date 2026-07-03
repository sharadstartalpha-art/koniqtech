import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Download,
  FileCheck2,
  FileText,
  FolderOpen,
  ShieldCheck
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDate(
  value: Date | null | undefined
) {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value)
}

function formatCategory(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

function formatFileSize(
  bytes: number | null
) {
  if (!bytes) {
    return "—"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

function getExpiryState(
  expiryDate: Date | null
) {
  if (!expiryDate) {
    return "none"
  }

  const now = new Date()

  const warningDate = new Date()
  warningDate.setDate(
    warningDate.getDate() + 30
  )

  if (expiryDate < now) {
    return "expired"
  }

  if (expiryDate <= warningDate) {
    return "expiring"
  }

  return "valid"
}

export default async function EmployeeDocumentsPage({
  params
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  const allowedRoles = [
    "super_admin",
    "manager"
  ]

  if (!allowedRoles.includes(currentRole)) {
    redirect("/admin/dashboard")
  }

  const { id } = await params

  const employee =
    await prisma.employee.findUnique({
      where: {
        id
      },

      select: {
        id: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        designation: true,

        department: {
          select: {
            name: true
          }
        },

        role: {
          select: {
            name: true
          }
        },

        documents: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const totalDocuments =
    employee.documents.length

  const verifiedDocuments =
    employee.documents.filter(
      (document) => document.verified
    ).length

  const pendingVerification =
    employee.documents.filter(
      (document) => !document.verified
    ).length

  const expiringDocuments =
    employee.documents.filter(
      (document) =>
        getExpiryState(
          document.expiryDate
        ) === "expiring"
    ).length

  const expiredDocuments =
    employee.documents.filter(
      (document) =>
        getExpiryState(
          document.expiryDate
        ) === "expired"
    ).length

  const fullName =
    `${employee.firstName} ${employee.lastName}`

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <Link
          href={`/admin/employees/${employee.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Employee Profile
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FolderOpen size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Employee Documents
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Documents and verification records for{" "}
              <span className="font-medium text-slate-700">
                {fullName}
              </span>
              {" "}({employee.employeeCode})
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.department.name}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.role.name}
              </span>

              {employee.designation && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {employee.designation}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DocumentStatCard
          label="Total Documents"
          value={totalDocuments}
          icon={<FileText size={19} />}
          variant="blue"
        />

        <DocumentStatCard
          label="Verified"
          value={verifiedDocuments}
          icon={<BadgeCheck size={19} />}
          variant="green"
        />

        <DocumentStatCard
          label="Pending Verification"
          value={pendingVerification}
          icon={<ShieldCheck size={19} />}
          variant="orange"
        />

        <DocumentStatCard
          label="Expiring Soon"
          value={expiringDocuments}
          icon={<CalendarClock size={19} />}
          variant="orange"
        />

        <DocumentStatCard
          label="Expired"
          value={expiredDocuments}
          icon={<AlertTriangle size={19} />}
          variant="red"
        />
      </div>

      {/* DOCUMENT TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Document Library
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Employee identity, employment, compliance
            and certification documents.
          </p>
        </div>

        {employee.documents.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FolderOpen size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No documents found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              No internal documents have been uploaded
              for this employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <TableHeading>
                    Document
                  </TableHeading>

                  <TableHeading>
                    Category
                  </TableHeading>

                  <TableHeading>
                    File
                  </TableHeading>

                  <TableHeading>
                    Size
                  </TableHeading>

                  <TableHeading>
                    Verification
                  </TableHeading>

                  <TableHeading>
                    Expiry Date
                  </TableHeading>

                  <TableHeading>
                    Uploaded By
                  </TableHeading>

                  <TableHeading>
                    Uploaded
                  </TableHeading>

                  <TableHeading>
                    Notes
                  </TableHeading>

                  <TableHeading>
                    Action
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {employee.documents.map(
                  (document) => {
                    const expiryState =
                      getExpiryState(
                        document.expiryDate
                      )

                    return (
                      <tr
                        key={document.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <FileText size={17} />
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {document.title}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {document.mimeType ||
                                  "Unknown file type"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {formatCategory(
                              document.category
                            )}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span
                            className="block max-w-52 truncate"
                            title={
                              document.fileName
                            }
                          >
                            {document.fileName}
                          </span>
                        </TableCell>

                        <TableCell>
                          {formatFileSize(
                            document.fileSize
                          )}
                        </TableCell>

                        <TableCell>
                          {document.verified ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              <FileCheck2
                                size={13}
                              />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                              Pending
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <ExpiryBadge
                            state={expiryState}
                            expiryDate={
                              document.expiryDate
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {document.uploadedBy ||
                            "—"}
                        </TableCell>

                        <TableCell>
                          {formatDate(
                            document.createdAt
                          )}
                        </TableCell>

                        <TableCell>
                          <span
                            className="block max-w-64 truncate"
                            title={
                              document.notes ?? ""
                            }
                          >
                            {document.notes || "—"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Download size={14} />
                            Open
                          </a>
                        </TableCell>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   EXPIRY BADGE
========================================================= */

function ExpiryBadge({
  state,
  expiryDate
}: {
  state:
    | "none"
    | "valid"
    | "expiring"
    | "expired"

  expiryDate: Date | null
}) {
  if (state === "none") {
    return (
      <span className="text-slate-400">
        No expiry
      </span>
    )
  }

  const styles = {
    valid:
      "border-green-200 bg-green-50 text-green-700",

    expiring:
      "border-orange-200 bg-orange-50 text-orange-700",

    expired:
      "border-red-200 bg-red-50 text-red-700"
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[state]}`}
    >
      {formatDate(expiryDate)}
    </span>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function DocumentStatCard({
  label,
  value,
  icon,
  variant
}: {
  label: string
  value: number
  icon: React.ReactNode
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600",

    green:
      "bg-green-50 text-green-600",

    orange:
      "bg-orange-50 text-orange-600",

    red:
      "bg-red-50 text-red-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   TABLE HELPERS
========================================================= */

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  )
}

function TableCell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
      {children}
    </td>
  )
}