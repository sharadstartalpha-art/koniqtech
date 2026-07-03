import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ReceiptText,
  TrendingUp,
  WalletCards
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function formatCurrency(
  value: unknown
) {
  const amount = Number(value)

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(
    Number.isFinite(amount) ? amount : 0
  )
}

function formatDate(
  value: Date | null
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

function getMonthName(month: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long"
  }).format(
    new Date(2026, month - 1, 1)
  )
}

export default async function EmployeePayrollPage({
  params
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  if (
    ![
      "super_admin",
      "accountant"
    ].includes(currentRole)
  ) {
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

        salaries: {
          orderBy: [
            {
              payYear: "desc"
            },
            {
              payMonth: "desc"
            }
          ]
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const totalPayrollRecords =
    employee.salaries.length

  const paidRecords =
    employee.salaries.filter(
      (salary) => salary.status === "paid"
    ).length

  const pendingRecords =
    employee.salaries.filter(
      (salary) => salary.status === "pending"
    ).length

  const totalNetPaid =
    employee.salaries
      .filter(
        (salary) => salary.status === "paid"
      )
      .reduce(
        (total, salary) =>
          total + Number(salary.netSalary),
        0
      )

  const totalBonus =
    employee.salaries.reduce(
      (total, salary) =>
        total + Number(salary.bonus),
      0
    )

  const totalIncentive =
    employee.salaries.reduce(
      (total, salary) =>
        total + Number(salary.incentive),
      0
    )

  const latestSalary =
    employee.salaries[0] ?? null

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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <WalletCards size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Payroll
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Salary and payment history for{" "}
              <span className="font-medium text-slate-700">
                {fullName}
              </span>
              {" "}({employee.employeeCode})
            </p>

            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.department.name}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.role.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <PayrollStatCard
          label="Payroll Records"
          value={String(totalPayrollRecords)}
          icon={<ReceiptText size={19} />}
          variant="blue"
        />

        <PayrollStatCard
          label="Paid Records"
          value={String(paidRecords)}
          icon={<CheckCircle2 size={19} />}
          variant="green"
        />

        <PayrollStatCard
          label="Pending"
          value={String(pendingRecords)}
          icon={<Clock3 size={19} />}
          variant="orange"
        />

        <PayrollStatCard
          label="Total Net Paid"
          value={formatCurrency(totalNetPaid)}
          icon={<Banknote size={19} />}
          variant="green"
        />

        <PayrollStatCard
          label="Total Bonus"
          value={formatCurrency(totalBonus)}
          icon={<CircleDollarSign size={19} />}
          variant="blue"
        />

        <PayrollStatCard
          label="Incentives"
          value={formatCurrency(totalIncentive)}
          icon={<TrendingUp size={19} />}
          variant="orange"
        />
      </div>

      {/* CURRENT SALARY SNAPSHOT */}

      {latestSalary && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-950">
              Latest Payroll Snapshot
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {getMonthName(
                latestSalary.payMonth
              )}{" "}
              {latestSalary.payYear}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <MoneyItem
              label="Basic Salary"
              value={formatCurrency(
                latestSalary.basicSalary
              )}
            />

            <MoneyItem
              label="HRA"
              value={formatCurrency(
                latestSalary.hra
              )}
            />

            <MoneyItem
              label="Allowance"
              value={formatCurrency(
                latestSalary.allowance
              )}
            />

            <MoneyItem
              label="Bonus"
              value={formatCurrency(
                latestSalary.bonus
              )}
            />

            <MoneyItem
              label="Deductions"
              value={formatCurrency(
                latestSalary.deductions
              )}
            />

            <MoneyItem
              label="Net Salary"
              value={formatCurrency(
                latestSalary.netSalary
              )}
              highlight
            />
          </div>
        </div>
      )}

      {/* PAYROLL TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Salary History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete salary processing and payment
            history.
          </p>
        </div>

        {employee.salaries.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <WalletCards
              size={28}
              className="text-slate-400"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No payroll records
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No salary records have been created for
              this employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <TableHeading>
                    Period
                  </TableHeading>

                  <TableHeading>
                    Salary Type
                  </TableHeading>

                  <TableHeading>
                    Basic
                  </TableHeading>

                  <TableHeading>
                    HRA
                  </TableHeading>

                  <TableHeading>
                    Allowance
                  </TableHeading>

                  <TableHeading>
                    Bonus
                  </TableHeading>

                  <TableHeading>
                    Incentive
                  </TableHeading>

                  <TableHeading>
                    Overtime
                  </TableHeading>

                  <TableHeading>
                    Deductions
                  </TableHeading>

                  <TableHeading>
                    Tax
                  </TableHeading>

                  <TableHeading>
                    Net Salary
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Payment Date
                  </TableHeading>

                  <TableHeading>
                    Payment Method
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {employee.salaries.map(
                  (salary) => (
                    <tr
                      key={salary.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        <span className="font-medium text-slate-900">
                          {getMonthName(
                            salary.payMonth
                          )}{" "}
                          {salary.payYear}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="capitalize">
                          {salary.salaryType}
                        </span>
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.basicSalary
                        )}
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.hra
                        )}
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.allowance
                        )}
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.bonus
                        )}
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.incentive
                        )}
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.overtime
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-red-600">
                          {formatCurrency(
                            salary.deductions
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        {formatCurrency(
                          salary.tax
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(
                            salary.netSalary
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        <SalaryStatusBadge
                          status={salary.status}
                        />
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          salary.paymentDate
                        )}
                      </TableCell>

                      <TableCell>
                        {salary.paymentMethod ||
                          "—"}
                      </TableCell>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function SalaryStatusBadge({
  status
}: {
  status:
    | "pending"
    | "processed"
    | "paid"
    | "failed"
}) {
  const styles = {
    pending:
      "border-orange-200 bg-orange-50 text-orange-700",

    processed:
      "border-blue-200 bg-blue-50 text-blue-700",

    paid:
      "border-green-200 bg-green-50 text-green-700",

    failed:
      "border-red-200 bg-red-50 text-red-700"
  }

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  )
}

function PayrollStatCard({
  label,
  value,
  icon,
  variant
}: {
  label: string
  value: string
  icon: React.ReactNode
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold text-slate-950">
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

function MoneyItem({
  label,
  value,
  highlight = false
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-bold ${
          highlight
            ? "text-green-700"
            : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

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