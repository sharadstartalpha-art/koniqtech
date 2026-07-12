import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  User,
  Building2,
  Hash,
  FileText,
} from "lucide-react"

import prisma from "@/shared/lib/prisma"
import SmsQueueActions from "../components/EmailQueueActions"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EmailQueueDetailsPage({
  params,
}: PageProps) {
  const { id } = await params

  const email = await prisma.emailQueue.findUnique({
    where: {
      id,
    },
  })

  if (!email) {
    notFound()
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/admin/marketing/email-queue"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Email Queue
          </Link>

          <h1 className="text-3xl font-bold">
            Email Queue Details
          </h1>

          <p className="mt-2 text-slate-500">
            Review queued email information and manage delivery.
          </p>

        </div>

        <SmsQueueActions email={email} />

      </div>

      {/* STATUS */}

      <div className="grid gap-6 lg:grid-cols-4">

        <Card
          title="Status"
          value={email.status}
          icon={getStatusIcon(email.status)}
        />

        <Card
          title="Attempts"
          value={String(email.attempts)}
          icon={<RefreshCw className="h-6 w-6 text-blue-600" />}
        />

        <Card
          title="Provider"
          value={email.provider || "System"}
          icon={<Server className="h-6 w-6 text-indigo-600" />}
        />

        <Card
          title="Created"
          value={formatDate(email.createdAt)}
          icon={<Calendar className="h-6 w-6 text-orange-600" />}
        />

      </div>

      {/* DETAILS */}

      <div className="grid gap-8 lg:grid-cols-2">

        <section className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-xl font-semibold">
            Email Information
          </h2>

          <Detail
            label="Recipient"
            value={email.to}
            icon={<Mail className="h-5 w-5" />}
          />

          <Detail
            label="Subject"
            value={email.subject}
            icon={<FileText className="h-5 w-5" />}
          />

          <Detail
            label="Provider"
            value={email.provider || "-"}
            icon={<Building2 className="h-5 w-5" />}
          />

          <Detail
            label="Provider Message ID"
            value={email.providerMessageId || "-"}
            icon={<Hash className="h-5 w-5" />}
          />

          <Detail
            label="Scheduled"
            value={formatDate(email.scheduledAt)}
            icon={<Clock className="h-5 w-5" />}
          />

          <Detail
            label="Sent"
            value={formatDate(email.sentAt)}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

        </section>

        <section className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-xl font-semibold">
            Delivery Details
          </h2>

          <Detail
            label="Attempts"
            value={String(email.attempts)}
            icon={<RefreshCw className="h-5 w-5" />}
          />

          <Detail
            label="Status"
            value={email.status}
            icon={getStatusIcon(email.status)}
          />

          <Detail
            label="Created"
            value={formatDate(email.createdAt)}
            icon={<Calendar className="h-5 w-5" />}
          />

          <Detail
            label="Updated"
            value={formatDate(email.updatedAt)}
            icon={<Calendar className="h-5 w-5" />}
          />

          <Detail
            label="Error"
            value={email.errorMessage || "None"}
            icon={<AlertTriangle className="h-5 w-5" />}
          />

        </section>

      </div>

      {/* HTML */}

      <section className="rounded-3xl border bg-white p-8">

        <h2 className="mb-5 text-xl font-semibold">
          HTML Content
        </h2>

        <div className="rounded-xl border bg-slate-50 p-6 text-sm whitespace-pre-wrap break-words overflow-auto max-h-[700px]">
          {email.html}
        </div>

      </section>

    </div>
  )
}

function Card({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold break-all">
            {value}
          </h3>
        </div>

        {icon}
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 border-b py-4 last:border-none">

      <div className="rounded-xl bg-slate-100 p-2">
        {icon}
      </div>

      <div className="flex-1">

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-all font-medium text-slate-800">
          {value}
        </p>

      </div>

    </div>
  )
}

function formatDate(date: Date | null) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getStatusIcon(status: string) {
  switch (status) {
    case "sent":
    case "delivered":
      return (
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      )

    case "failed":
      return (
        <XCircle className="h-6 w-6 text-red-600" />
      )

    case "queued":
    case "pending":
    case "processing":
    case "sending":
      return (
        <Clock className="h-6 w-6 text-orange-600" />
      )

    default:
      return (
        <Mail className="h-6 w-6 text-blue-600" />
      )
  }
}