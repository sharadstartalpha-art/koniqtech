import prisma from "@/shared/lib/prisma"

export type CrmContext = {
  generatedAt: string
  organization: {
    customerCount: number
    leadCount: number
    jobCount: number
    invoiceCount: number
    overdueInvoiceCount: number
  }
  leads: Array<{
    name: string
    companyName: string | null
    status: string
    priority: string | null
    budget: number | null
    source: string | null
    createdAt: string
  }>
  recentInvoices: Array<{
    invoiceNumber: string
    customer: string
    subtotal: number
    tax: number
    total: number
    status: string
    dueDate: string | null
    createdAt: string
  }>
  overdueInvoices: Array<{
    invoiceNumber: string
    customer: string
    total: number
    dueDate: string
    status: string
  }>
}

function customerName(customer: {
  companyName: string | null
  firstName: string
  lastName: string | null
}): string {
  return (
    customer.companyName ||
    [customer.firstName, customer.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Customer"
  )
}

function toNumber(
  value: unknown
): number {
  if (typeof value === "number") {
    return value
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (
      value as { toNumber?: unknown }
    ).toNumber === "function"
  ) {
    return (
      value as {
        toNumber: () => number
      }
    ).toNumber()
  }

  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : 0
}

function toIsoDate(
  value: Date | null | undefined
): string | null {
  return value
    ? value.toISOString()
    : null
}

/**
 * Builds a strictly organization-scoped snapshot of CRM information
 * that can safely be supplied to the AI layer.
 *
 * IMPORTANT:
 * - Every CRM query is restricted by orgId.
 * - Internal database IDs are intentionally excluded.
 * - Sensitive authentication information is never included.
 * - Archived invoices are excluded.
 * - Only the minimum useful fields are exposed to the model.
 */
export async function buildCrmContext(
  orgId: string
): Promise<CrmContext> {
  if (!orgId) {
    throw new Error(
      "Organization ID is required."
    )
  }

  const now = new Date()

  const [
    customerCount,
    leadCount,
    jobCount,
    invoiceCount,
    overdueInvoiceCount,
    leads,
    recentInvoices,
    overdueInvoices,
  ] = await Promise.all([
    // ----------------------------------------------
    // COUNTS
    // ----------------------------------------------

    prisma.customer.count({
      where: {
        orgId,
      },
    }),

    prisma.lead.count({
      where: {
        orgId,
      },
    }),

    prisma.job.count({
      where: {
        orgId,
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        archivedAt: null,
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        archivedAt: null,
        dueDate: {
          lt: now,
        },
        status: {
          notIn: ["paid", "cancelled"],
        },
      },
    }),

    // ----------------------------------------------
    // RECENT LEADS
    // ----------------------------------------------

    prisma.lead.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        firstName: true,
        lastName: true,
        companyName: true,
        status: true,
        priority: true,
        budget: true,
        source: true,
        createdAt: true,
      },
    }),

    // ----------------------------------------------
    // RECENT INVOICES
    // ----------------------------------------------

    prisma.invoice.findMany({
      where: {
        orgId,
        archivedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        invoiceNumber: true,
        subtotal: true,
        tax: true,
        total: true,
        status: true,
        dueDate: true,
        createdAt: true,
        customer: {
          select: {
            companyName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    // ----------------------------------------------
    // OVERDUE INVOICES
    // ----------------------------------------------

    prisma.invoice.findMany({
      where: {
        orgId,
        archivedAt: null,
        dueDate: {
          lt: now,
        },
        status: {
          notIn: ["paid", "cancelled"],
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 20,
      select: {
        invoiceNumber: true,
        total: true,
        status: true,
        dueDate: true,
        customer: {
          select: {
            companyName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ])

  return {
    generatedAt: now.toISOString(),

    organization: {
      customerCount,
      leadCount,
      jobCount,
      invoiceCount,
      overdueInvoiceCount,
    },

    leads: leads.map((lead) => ({
      name:
        [
          lead.firstName,
          lead.lastName,
        ]
          .filter(Boolean)
          .join(" ") ||
        lead.companyName ||
        "Lead",

      companyName:
        lead.companyName,

      status:
        String(lead.status),

      priority:
        lead.priority,

      budget:
        lead.budget === null
          ? null
          : Number(lead.budget),

      source:
        lead.source,

      createdAt:
        lead.createdAt.toISOString(),
    })),

    recentInvoices:
      recentInvoices.map(
        (invoice) => ({
          invoiceNumber:
            invoice.invoiceNumber,

          customer:
            customerName(
              invoice.customer
            ),

          subtotal:
            toNumber(
              invoice.subtotal
            ),

          tax:
            toNumber(invoice.tax),

          total:
            toNumber(invoice.total),

          status:
            String(invoice.status),

          dueDate:
            toIsoDate(
              invoice.dueDate
            ),

          createdAt:
            invoice.createdAt.toISOString(),
        })
      ),

    overdueInvoices:
      overdueInvoices.map(
        (invoice) => ({
          invoiceNumber:
            invoice.invoiceNumber,

          customer:
            customerName(
              invoice.customer
            ),

          total:
            toNumber(invoice.total),

          dueDate:
            invoice.dueDate!.toISOString(),

          status:
            String(invoice.status),
        })
      ),
  }
}

/**
 * Converts the structured CRM context into a compact,
 * model-readable prompt section.
 */
export function formatCrmContext(
  context: CrmContext
): string {
  return `
CRM DATA
========

Snapshot generated:
${context.generatedAt}

ORGANIZATION SUMMARY
--------------------
Customers: ${context.organization.customerCount}
Leads: ${context.organization.leadCount}
Jobs: ${context.organization.jobCount}
Active invoices: ${context.organization.invoiceCount}
Overdue invoices: ${context.organization.overdueInvoiceCount}

RECENT LEADS
------------
${
  context.leads.length === 0
    ? "No leads found."
    : context.leads
        .map(
          (lead, index) =>
            `${index + 1}. ${lead.name}` +
            ` | Company: ${lead.companyName || "—"}` +
            ` | Status: ${lead.status}` +
            ` | Priority: ${lead.priority || "—"}` +
            ` | Budget: ${
              lead.budget === null
                ? "—"
                : `$${lead.budget.toFixed(2)}`
            }` +
            ` | Source: ${lead.source || "—"}` +
            ` | Created: ${lead.createdAt}`
        )
        .join("\n")
}

RECENT INVOICES
---------------
${
  context.recentInvoices.length === 0
    ? "No invoices found."
    : context.recentInvoices
        .map(
          (invoice, index) =>
            `${index + 1}. ${invoice.invoiceNumber}` +
            ` | Customer: ${invoice.customer}` +
            ` | Total: $${invoice.total.toFixed(2)}` +
            ` | Status: ${invoice.status}` +
            ` | Due: ${invoice.dueDate || "—"}`
        )
        .join("\n")
}

OVERDUE INVOICES
----------------
${
  context.overdueInvoices.length === 0
    ? "No overdue invoices found."
    : context.overdueInvoices
        .map(
          (invoice, index) =>
            `${index + 1}. ${invoice.invoiceNumber}` +
            ` | Customer: ${invoice.customer}` +
            ` | Amount: $${invoice.total.toFixed(2)}` +
            ` | Due: ${invoice.dueDate}` +
            ` | Status: ${invoice.status}`
        )
        .join("\n")
}
`.trim()
}