"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  HardDrive,
  HeartPulse,
  Mail,
  MemoryStick,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Wifi,
  XCircle,
} from "lucide-react";

type HealthStatus =
  | "Healthy"
  | "Warning"
  | "Critical";

interface HealthService {
  id: string;

  name: string;

  category: string;

  status: HealthStatus;

  responseTime: number;

  uptime: string;

  lastChecked: string;
}

const services: HealthService[] = [
  {
    id: "database",

    name: "PostgreSQL",

    category: "Database",

    status: "Healthy",

    responseTime: 18,

    uptime: "99.99%",

    lastChecked: "2026-08-06 16:20",
  },

  {
    id: "storage",

    name: "AWS S3",

    category: "Storage",

    status: "Healthy",

    responseTime: 31,

    uptime: "99.99%",

    lastChecked: "2026-08-06 16:20",
  },

  {
    id: "email",

    name: "Resend",

    category: "Email",

    status: "Healthy",

    responseTime: 26,

    uptime: "99.98%",

    lastChecked: "2026-08-06 16:20",
  },

  {
    id: "paypal",

    name: "PayPal API",

    category: "Payments",

    status: "Warning",

    responseTime: 244,

    uptime: "99.70%",

    lastChecked: "2026-08-06 16:20",
  },

  {
    id: "queue",

    name: "Queue Worker",

    category: "Background Jobs",

    status: "Healthy",

    responseTime: 11,

    uptime: "100%",

    lastChecked: "2026-08-06 16:20",
  },

  {
    id: "auth",

    name: "Authentication",

    category: "Security",

    status: "Healthy",

    responseTime: 15,

    uptime: "100%",

    lastChecked: "2026-08-06 16:20",
  },
];

export default function HealthPage() {

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

    const [showRunModal, setShowRunModal] =
  useState(false);

const [runningChecks, setRunningChecks] =
  useState(false);

  const [selectedService, setSelectedService] =
    useState<HealthService | null>(
      null
    );

  const stats = useMemo(
    () => ({
      total:
        services.length,

      healthy:
        services.filter(
          (service) =>
            service.status ===
            "Healthy"
        ).length,

      warning:
        services.filter(
          (service) =>
            service.status ===
            "Warning"
        ).length,

      critical:
        services.filter(
          (service) =>
            service.status ===
            "Critical"
        ).length,
    }),
    []
  );

  function refreshHealth() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getStatusColor(
    status: HealthStatus
  ) {
    switch (status) {

      case "Healthy":
        return "bg-green-100 text-green-700";

      case "Warning":
        return "bg-yellow-100 text-yellow-700";

      case "Critical":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }


  async function runHealthCheck() {
  try {
    setRunningChecks(true);

    // TODO:
    // POST /api/admin/developer-tools/health/run

    setSuccess(
      "Health check completed successfully."
    );
  } catch {
    setError(
      "Unable to run health check."
    );
  } finally {
    setRunningChecks(false);
  }
}

async function testDatabase() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/health/database

    setSuccess(
      "Database connection successful."
    );
  } catch {
    setError(
      "Database connection failed."
    );
  } finally {
    setActionLoading(false);
  }
}

async function testStorage() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/health/storage

    setSuccess(
      "AWS S3 is healthy."
    );
  } catch {
    setError(
      "Storage test failed."
    );
  } finally {
    setActionLoading(false);
  }
}

async function testEmail() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/health/email

    setSuccess(
      "Email service is operational."
    );
  } catch {
    setError(
      "Email service unavailable."
    );
  } finally {
    setActionLoading(false);
  }
}

async function testQueue() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/health/queue

    setSuccess(
      "Queue worker is healthy."
    );
  } catch {
    setError(
      "Queue worker failed."
    );
  } finally {
    setActionLoading(false);
  }
}

async function testPayPal() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/health/paypal

    setSuccess(
      "PayPal API reachable."
    );
  } catch {
    setError(
      "PayPal API unavailable."
    );
  } finally {
    setActionLoading(false);
  }
}


const healthActivity = [
  {
    id: 1,
    title: "Health Check Completed",
    description: "All critical services responded successfully.",
    time: "2 minutes ago",
  },
  {
    id: 2,
    title: "Database Connected",
    description: "PostgreSQL health verification passed.",
    time: "8 minutes ago",
  },
  {
    id: 3,
    title: "Storage Verified",
    description: "AWS S3 bucket connection succeeded.",
    time: "15 minutes ago",
  },
  {
    id: 4,
    title: "PayPal Warning",
    description: "Response time exceeded configured threshold.",
    time: "30 minutes ago",
  },
];


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

      <section className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <HeartPulse className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  System Health
                </h1>

                <p className="mt-2 text-emerald-100">
                  Monitor services, infrastructure and application health.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={refreshHealth}
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

          </div>

        </div>

      </section>

      {/* Health Summary */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Server className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Total Services
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.total}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Healthy
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.healthy}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <AlertTriangle className="mb-4 h-8 w-8 text-yellow-600" />

          <p className="text-sm text-slate-500">
            Warnings
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.warning}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <XCircle className="mb-4 h-8 w-8 text-red-600" />

          <p className="text-sm text-slate-500">
            Critical
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.critical}
          </h3>

        </div>

      </section>

      {/* Overall Status */}

      <section className="rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <div className="flex items-center gap-3">

            <Settings className="h-6 w-6 text-emerald-600" />

            <h2 className="text-2xl font-bold">
              Overall Health
            </h2>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Platform Status
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <span className="font-semibold text-green-700">
                  Operational
                </span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Environment
              </label>

              <input
                disabled
                value="Production"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Version
              </label>

              <input
                disabled
                value="v1.0.0"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Last Health Check
              </label>

              <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-4 py-3">

                <Clock3 className="h-5 w-5 text-slate-500" />

                <span>
                  Today • 04:20 PM
                </span>

              </div>

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Database
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <Database className="h-5 w-5 text-green-600" />

                <span>Connected</span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Email Service
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <Mail className="h-5 w-5 text-green-600" />

                <span>Operational</span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Network
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <Wifi className="h-5 w-5 text-green-600" />

                <span>Connected</span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Security
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <Shield className="h-5 w-5 text-green-600" />

                <span>Secure</span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Services */}

      <section className="space-y-8">

  {/* Services */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Service Status
          </h2>

          <p className="mt-2 text-slate-500">
            Monitor all connected platform services.
          </p>

        </div>

        <button
          onClick={refreshHealth}
          className="rounded-xl border px-4 py-2 hover:bg-slate-100"
        >
          Refresh
        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Service
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Response
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Uptime
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {services.map((service) => (

            <tr
              key={service.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                <div>

                  <p className="font-semibold">

                    {service.name}

                  </p>

                  <p className="text-sm text-slate-500">

                    {service.lastChecked}

                  </p>

                </div>

              </td>

              <td className="px-6 py-5">

                {service.category}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    service.status
                  )}`}
                >

                  {service.status}

                </span>

              </td>

              <td className="px-6 py-5 text-center">

                {service.responseTime} ms

              </td>

              <td className="px-6 py-5 text-center">

                {service.uptime}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end">

                  <button
                   onClick={() => {
  setSelectedService(service);
}}
                    className="rounded-lg border px-3 py-2 hover:bg-slate-100"
                  >
                    Details
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* System Resources */}

  <div className="grid gap-6 lg:grid-cols-2">

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Cpu className="h-6 w-6 text-blue-600" />

        <h2 className="text-xl font-bold">
          CPU Usage
        </h2>

      </div>

      <div className="mb-2 flex justify-between">

        <span className="text-slate-500">
          Current Usage
        </span>

        <span className="font-semibold">
          32%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">

        <div className="h-full w-[32%] rounded-full bg-blue-600" />

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-slate-500">
            Load Average
          </span>

          <span className="font-semibold">
            0.81
          </span>

        </div>

        <div className="mb-2 flex justify-between">

          <span className="text-slate-500">
            Threads
          </span>

          <span className="font-semibold">
            64
          </span>

        </div>

      </div>

    </div>

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <MemoryStick className="h-6 w-6 text-green-600" />

        <h2 className="text-xl font-bold">
          Memory & Disk
        </h2>

      </div>

      <div className="space-y-6">

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-slate-500">
              Memory
            </span>

            <span className="font-semibold">
              58%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div className="h-full w-[58%] rounded-full bg-green-600" />

          </div>

        </div>

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-slate-500">
              Disk Usage
            </span>

            <span className="font-semibold">
              44%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div className="h-full w-[44%] rounded-full bg-indigo-600" />

          </div>

        </div>

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-slate-500">
              Free Space
            </span>

            <span className="font-semibold">
              112 GB
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="space-y-8">

  {/* Services */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Service Status
          </h2>

          <p className="mt-2 text-slate-500">
            Monitor all connected platform services.
          </p>

        </div>

        <button
          onClick={refreshHealth}
          className="rounded-xl border px-4 py-2 hover:bg-slate-100"
        >
          Refresh
        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Service
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Response
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Uptime
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {services.map((service) => (

            <tr
              key={service.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                <div>

                  <p className="font-semibold">

                    {service.name}

                  </p>

                  <p className="text-sm text-slate-500">

                    {service.lastChecked}

                  </p>

                </div>

              </td>

              <td className="px-6 py-5">

                {service.category}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    service.status
                  )}`}
                >

                  {service.status}

                </span>

              </td>

              <td className="px-6 py-5 text-center">

                {service.responseTime} ms

              </td>

              <td className="px-6 py-5 text-center">

                {service.uptime}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end">

                  <button
                   onClick={() => {
  setSelectedService(service);
}}
                    className="rounded-lg border px-3 py-2 hover:bg-slate-100"
                  >
                    Details
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* System Resources */}

  <div className="grid gap-6 lg:grid-cols-2">

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Cpu className="h-6 w-6 text-blue-600" />

        <h2 className="text-xl font-bold">
          CPU Usage
        </h2>

      </div>

      <div className="mb-2 flex justify-between">

        <span className="text-slate-500">
          Current Usage
        </span>

        <span className="font-semibold">
          32%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">

        <div className="h-full w-[32%] rounded-full bg-blue-600" />

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-slate-500">
            Load Average
          </span>

          <span className="font-semibold">
            0.81
          </span>

        </div>

        <div className="mb-2 flex justify-between">

          <span className="text-slate-500">
            Threads
          </span>

          <span className="font-semibold">
            64
          </span>

        </div>

      </div>

    </div>

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <MemoryStick className="h-6 w-6 text-green-600" />

        <h2 className="text-xl font-bold">
          Memory & Disk
        </h2>

      </div>

      <div className="space-y-6">

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-slate-500">
              Memory
            </span>

            <span className="font-semibold">
              58%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div className="h-full w-[58%] rounded-full bg-green-600" />

          </div>

        </div>

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-slate-500">
              Disk Usage
            </span>

            <span className="font-semibold">
              44%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div className="h-full w-[44%] rounded-full bg-indigo-600" />

          </div>

        </div>

        <div>

          <div className="mb-2 flex justify-between">

            <span className="text-slate-500">
              Free Space
            </span>

            <span className="font-semibold">
              112 GB
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Health Actions
    </h2>

    <p className="mt-2 text-slate-500">
      Run diagnostic tests against platform services.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={() =>
        setShowRunModal(true)
      }
      disabled={runningChecks}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
    >
      Run Full Health Check
    </button>

    <button
      onClick={testDatabase}
      disabled={actionLoading}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      Test Database
    </button>

    <button
      onClick={testStorage}
      disabled={actionLoading}
      className="rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
    >
      Test AWS S3
    </button>

    <button
      onClick={testEmail}
      disabled={actionLoading}
      className="rounded-xl bg-orange-600 px-5 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
    >
      Test Email
    </button>

    <button
      onClick={testQueue}
      disabled={actionLoading}
      className="rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
    >
      Test Queue
    </button>

    <button
      onClick={testPayPal}
      disabled={actionLoading}
      className="rounded-xl bg-cyan-600 px-5 py-4 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
    >
      Test PayPal
    </button>

    <button
      onClick={refreshHealth}
      disabled={loading}
      className="rounded-xl border px-5 py-4 transition hover:bg-slate-100"
    >
      Refresh Status
    </button>

    <button
      onClick={() => {
        setSuccess("");
        setError("");
      }}
      className="rounded-xl border px-5 py-4 transition hover:bg-slate-100"
    >
      Clear Messages
    </button>

  </div>

</section>

{selectedService && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Service Details
        </h2>

        <button
          onClick={() =>
            setSelectedService(null)
          }
          className="rounded-lg border px-3 py-2 hover:bg-slate-100"
        >
          Close
        </button>

      </div>

    </div>

    <div className="grid gap-6 p-6 md:grid-cols-2">

      <div>

        <p className="text-sm text-slate-500">
          Service
        </p>

        <p className="mt-2 font-semibold">
          {selectedService.name}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Category
        </p>

        <p className="mt-2 font-semibold">
          {selectedService.category}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Status
        </p>

        <span
          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
            selectedService.status
          )}`}
        >
          {selectedService.status}
        </span>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Response Time
        </p>

        <p className="mt-2 font-semibold">
          {selectedService.responseTime} ms
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Uptime
        </p>

        <p className="mt-2 font-semibold">
          {selectedService.uptime}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Last Checked
        </p>

        <p className="mt-2 font-semibold">
          {selectedService.lastChecked}
        </p>

      </div>

    </div>

  </div>

</div>

)}

{showRunModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold">
        Run Full Health Check
      </h2>

      <p className="mt-3 text-slate-600">

        This will test every configured service,
        database connection, storage, email,
        queue workers and payment gateway.

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setShowRunModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={async () => {

          await runHealthCheck();

          setShowRunModal(false);

        }}
        className="rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
      >
        Run Check
      </button>

    </div>

  </div>

</div>

)}


<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Health Activity
    </h2>

    <p className="mt-2 text-slate-500">
      Recent health monitoring events.
    </p>

  </div>

  <div className="divide-y">

    {healthActivity.map((item) => (

      <div
        key={item.id}
        className="flex items-start gap-4 p-6 hover:bg-slate-50"
      >

        <div className="rounded-full bg-green-100 p-2">

          <Activity className="h-4 w-4 text-green-600" />

        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between">

            <h3 className="font-semibold">

              {item.title}

            </h3>

            <span className="text-sm text-slate-400">

              {item.time}

            </span>

          </div>

          <p className="mt-2 text-sm text-slate-500">

            {item.description}

          </p>

        </div>

      </div>

    ))}

  </div>

</section>

    </div>
  );
}