"use client";

import { useMemo, useState } from "react";

import {
  Mail,
  Send,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  Settings,
  FileText,
  Shield,
  User,
  KeyRound,
  Receipt,
  Bell,
  ExternalLink,
} from "lucide-react";

type EmailProvider =
  | "Resend"
  | "SMTP";

type ProviderStatus =
  | "Connected"
  | "Disconnected"
  | "Error";

interface EmailTemplate {
  id: string;

  name: string;

  subject: string;

  type:
    | "Welcome"
    | "OTP"
    | "Invoice"
    | "Password Reset";

  enabled: boolean;
}

interface EmailLog {
  id: string;

  recipient: string;

  subject: string;

  status:
    | "Delivered"
    | "Queued"
    | "Failed";

  sentAt: string;
}

const templates: EmailTemplate[] = [
  {
    id: "welcome",

    name: "Welcome Email",

    subject:
      "Welcome to KoniqTech",

    type: "Welcome",

    enabled: true,
  },

  {
    id: "otp",

    name: "OTP Verification",

    subject:
      "Verify your email",

    type: "OTP",

    enabled: true,
  },

  {
    id: "reset",

    name: "Password Reset",

    subject:
      "Reset your password",

    type: "Password Reset",

    enabled: true,
  },

  {
    id: "invoice",

    name: "Invoice Email",

    subject:
      "Invoice from KoniqTech",

    type: "Invoice",

    enabled: true,
  },
];

const emailLogs: EmailLog[] = [
  {
    id: "1",

    recipient:
      "john@example.com",

    subject:
      "Welcome to KoniqTech",

    status: "Delivered",

    sentAt:
      "2026-08-05 14:05",
  },

  {
    id: "2",

    recipient:
      "alex@example.com",

    subject:
      "Password Reset",

    status: "Delivered",

    sentAt:
      "2026-08-05 14:42",
  },

  {
    id: "3",

    recipient:
      "demo@example.com",

    subject:
      "Invoice Email",

    status: "Queued",

    sentAt:
      "2026-08-05 15:10",
  },

  {
    id: "4",

    recipient:
      "user@test.com",

    subject:
      "OTP Verification",

    status: "Failed",

    sentAt:
      "2026-08-05 15:31",
  },
];

export default function EmailTestingPage() {

    const [provider, setProvider] =
  useState<EmailProvider>(
    "Resend"
  );

const [providerStatus] =
  useState<ProviderStatus>(
    "Connected"
  );

const [loading, setLoading] =
  useState(false);

const [success, setSuccess] =
  useState("");

const [error, setError] =
  useState("");

const [actionLoading, setActionLoading] =
  useState(false);

const [selectedTemplate, setSelectedTemplate] =
  useState<EmailTemplate | null>(
    null
  );

const [testEmail, setTestEmail] =
  useState(
    "demo@example.com"
  );

  const [showPreview, setShowPreview] =
  useState(false);

const [sending, setSending] =
  useState(false);

  const stats = useMemo(
  () => ({
    templates:
      templates.length,

    enabledTemplates:
      templates.filter(
        (template) =>
          template.enabled
      ).length,

    sentEmails:
      emailLogs.length,

    delivered:
      emailLogs.filter(
        (log) =>
          log.status ===
          "Delivered"
      ).length,
  }),
  []
);

async function sendTestEmail() {
  try {
    setSending(true);

    // TODO:
    // POST /api/admin/developer-tools/email/test

    setSuccess(
      `Test email sent to ${testEmail}.`
    );
  } catch {
    setError(
      "Unable to send test email."
    );
  } finally {
    setSending(false);
  }
}

async function sendTemplateEmail(
  template: EmailTemplate
) {
  try {
    setSending(true);

    // TODO:
    // POST /api/admin/developer-tools/email/template

    setSuccess(
      `${template.name} sent successfully.`
    );
  } catch {
    setError(
      `Unable to send ${template.name}.`
    );
  } finally {
    setSending(false);
  }
}

async function testProvider() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/email/provider

    setSuccess(
      `${provider} connection verified.`
    );
  } catch {
    setError(
      `${provider} connection failed.`
    );
  } finally {
    setActionLoading(false);
  }
}

async function clearQueue() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/email/queue

    setSuccess(
      "Email queue cleared."
    );
  } catch {
    setError(
      "Unable to clear queue."
    );
  } finally {
    setActionLoading(false);
  }
}


const activityLog = [
  {
    id: 1,
    action: "Welcome Email",
    recipient: "john@example.com",
    status: "Delivered",
    time: "2 minutes ago",
  },
  {
    id: 2,
    action: "OTP Email",
    recipient: "demo@example.com",
    status: "Delivered",
    time: "7 minutes ago",
  },
  {
    id: 3,
    action: "Invoice Email",
    recipient: "billing@example.com",
    status: "Queued",
    time: "15 minutes ago",
  },
  {
    id: 4,
    action: "Password Reset",
    recipient: "support@example.com",
    status: "Failed",
    time: "22 minutes ago",
  },
];


function refreshStatus() {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
  }, 1000);
}

function getStatusColor(
  status: ProviderStatus
) {
  switch (status) {
    case "Connected":
      return "bg-green-100 text-green-700";

    case "Disconnected":
      return "bg-slate-100 text-slate-700";

    case "Error":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}


return (
  <div className="space-y-8">

    {success && (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
        {success}
      </div>
    )}

    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )}

    {/* Header */}

    <section className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-8 text-white shadow-xl">

      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

        <div>

          <div className="mb-4 flex items-center gap-4">

            <div className="rounded-2xl bg-white/10 p-4">

              <Mail className="h-8 w-8" />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                Email Testing
              </h1>

              <p className="mt-2 text-blue-100">
                Test Resend, SMTP, templates and email delivery.
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={refreshStatus}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-medium transition hover:bg-white/20"
          >

            <RefreshCw
              className={`h-5 w-5 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh

          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700"
          >

            <ExternalLink className="h-5 w-5" />

            Open Resend

          </button>

        </div>

      </div>

    </section>

    {/* Statistics */}

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <FileText className="mb-4 h-8 w-8 text-blue-600" />

        <p className="text-sm text-slate-500">
          Templates
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.templates}
        </h3>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

        <p className="text-sm text-slate-500">
          Enabled
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.enabledTemplates}
        </h3>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <Send className="mb-4 h-8 w-8 text-indigo-600" />

        <p className="text-sm text-slate-500">
          Emails
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.sentEmails}
        </h3>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <Shield className="mb-4 h-8 w-8 text-emerald-600" />

        <p className="text-sm text-slate-500">
          Delivered
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {stats.delivered}
        </h3>

      </div>

    </section>

    {/* Configuration */}

    <section className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <div className="flex items-center gap-3">

          <Settings className="h-6 w-6 text-blue-600" />

          <h2 className="text-2xl font-bold">
            Email Configuration
          </h2>

        </div>

      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Provider
            </label>

            <select
              value={provider}
              onChange={(e) =>
                setProvider(
                  e.target
                    .value as EmailProvider
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >

              <option>
                Resend
              </option>

              <option>
                SMTP
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Status
            </label>

            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                providerStatus
              )}`}
            >
              {providerStatus}
            </span>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              API Key
            </label>

            <input
              disabled
              value="re_xxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />

          </div>

        </div>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Sender Email
            </label>

            <input
              disabled
              value="info@koniqtech.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Last Email
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

              <Clock3 className="h-5 w-5 text-slate-400" />

              <span>
                Today • 03:15 PM
              </span>

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Test Email
            </label>

            <input
              value={testEmail}
              onChange={(e) =>
                setTestEmail(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

          </div>

        </div>

      </div>

    </section>

    {/* Email Templates */}


<section className="space-y-8">

  {/* Email Templates */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">
        Email Templates
      </h2>

      <p className="mt-2 text-slate-500">
        Test all transactional email templates.
      </p>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Template
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Subject
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Type
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {templates.map((template) => (

            <tr
              key={template.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5 font-semibold">

                {template.name}

              </td>

              <td className="px-6 py-5">

                {template.subject}

              </td>

              <td className="px-6 py-5 text-center">

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">

                  {template.type}

                </span>

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    template.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {template.enabled
                    ? "Enabled"
                    : "Disabled"}

                </span>

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-2">

                  <button
                    onClick={() => {
  setSelectedTemplate(template);
  sendTemplateEmail(template);
}}
                    className="rounded-lg border px-3 py-2 hover:bg-slate-100"
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => {
  setSelectedTemplate(template);
  setShowPreview(true);
}}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    Send Test
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* Recent Emails */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Recent Email Activity
          </h2>

          <p className="mt-2 text-slate-500">
            Latest email delivery history.
          </p>

        </div>

        <button
          className="rounded-xl border px-4 py-2 hover:bg-slate-100"
        >
          Refresh Logs
        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Recipient
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Subject
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Sent
            </th>

          </tr>

        </thead>

        <tbody>

          {emailLogs.map((log) => (

            <tr
              key={log.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                {log.recipient}

              </td>

              <td className="px-6 py-5">

                {log.subject}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    log.status ===
                    "Delivered"
                      ? "bg-green-100 text-green-700"
                      : log.status ===
                        "Queued"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {log.status}

                </span>

              </td>

              <td className="px-6 py-5 text-right text-slate-500">

                {log.sentAt}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

</section>



<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Email Testing
    </h2>

    <p className="mt-2 text-slate-500">
      Verify provider configuration and transactional emails.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={sendTestEmail}
      disabled={sending}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      Send Test Email
    </button>

    <button
      onClick={testProvider}
      disabled={actionLoading}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      Test Provider
    </button>

    <button
      onClick={refreshStatus}
      disabled={loading}
      className="rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      Refresh Status
    </button>

    <button
      onClick={clearQueue}
      disabled={actionLoading}
      className="rounded-xl bg-red-600 px-5 py-4 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      Clear Queue
    </button>

    <button
      onClick={() => {
        setSuccess("");
        setError("");
      }}
      className="rounded-xl border px-5 py-4 hover:bg-slate-100"
    >
      Clear Messages
    </button>

    <button
      onClick={() => setShowPreview(true)}
      disabled={!selectedTemplate}
      className="rounded-xl border px-5 py-4 hover:bg-slate-100 disabled:opacity-50"
    >
      Preview Template
    </button>

  </div>

</section>

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Activity Log
    </h2>

    <p className="mt-2 text-slate-500">
      Recent email testing activity.
    </p>

  </div>

  <div className="divide-y">

    {activityLog.map((item) => (

      <div
        key={item.id}
        className="flex items-center justify-between p-5 hover:bg-slate-50"
      >

        <div>

          <p className="font-semibold">

            {item.action}

          </p>

          <p className="mt-1 text-sm text-slate-500">

            {item.recipient}

          </p>

          <p className="text-xs text-slate-400">

            {item.time}

          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : item.status === "Queued"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >

          {item.status}

        </span>

      </div>

    ))}

  </div>

</section>

{showPreview &&
  selectedTemplate && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">
        {selectedTemplate.name}
      </h2>

      <p className="mt-2 text-slate-500">
        Email Template Preview
      </p>

    </div>

    <div className="space-y-5 p-6">

      <div>

        <label className="text-sm font-semibold text-slate-500">
          Subject
        </label>

        <div className="mt-2 rounded-xl border bg-slate-50 p-4">

          {selectedTemplate.subject}

        </div>

      </div>

      <div>

        <label className="text-sm font-semibold text-slate-500">
          Preview
        </label>

        <div className="mt-2 rounded-xl border bg-slate-50 p-6">

          <p>Hello Customer,</p>

          <p className="mt-4">
            This is a preview of the
            <strong>
              {" "}
              {selectedTemplate.name}
            </strong>
            {" "}template.
          </p>

          <p className="mt-4">
            Your production email content will be rendered here.
          </p>

          <p className="mt-8">
            Thanks,
          </p>

          <p>KoniqTech Team</p>

        </div>

      </div>

    </div>

    <div className="flex justify-end gap-3 border-t p-6">

      <button
        onClick={() =>
          setShowPreview(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Close
      </button>

      <button
        onClick={() => {

          sendTemplateEmail(
            selectedTemplate
          );

          setShowPreview(false);

        }}
        className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Send Test
      </button>

    </div>

  </div>

</div>

)}


  </div>
);
}


