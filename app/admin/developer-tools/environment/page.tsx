"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  FileCode2,
  Globe,
  Info,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";

type EnvironmentType =
  | "Production"
  | "Development"
  | "Preview";

type VariableStatus =
  | "Configured"
  | "Missing"
  | "Invalid";

interface EnvironmentVariable {
  id: string;

  key: string;

  value: string;

  status: VariableStatus;

  secret: boolean;
}

const environmentVariables: EnvironmentVariable[] = [
  {
    id: "1",

    key: "DATABASE_URL",

    value: "postgresql://********",

    status: "Configured",

    secret: true,
  },

  {
    id: "2",

    key: "NEXTAUTH_SECRET",

    value: "****************",

    status: "Configured",

    secret: true,
  },

  {
    id: "3",

    key: "AWS_BUCKET_NAME",

    value: "koniqtech-storage",

    status: "Configured",

    secret: false,
  },

  {
    id: "4",

    key: "AWS_REGION",

    value: "us-east-1",

    status: "Configured",

    secret: false,
  },

  {
    id: "5",

    key: "RESEND_API_KEY",

    value: "re****************",

    status: "Configured",

    secret: true,
  },

  {
    id: "6",

    key: "PAYPAL_CLIENT_ID",

    value: "Ae****************",

    status: "Configured",

    secret: true,
  },

  {
    id: "7",

    key: "OPENAI_API_KEY",

    value: "",

    status: "Missing",

    secret: true,
  },
];

export default function EnvironmentPage() {

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [environment] =
    useState<EnvironmentType>(
      "Production"
    );

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [showSecrets, setShowSecrets] =
    useState(false);

    const [showReloadModal, setShowReloadModal] =
  useState(false);

const [showValidateModal, setShowValidateModal] =
  useState(false);

  const [selectedVariable, setSelectedVariable] =
    useState<EnvironmentVariable | null>(
      null
    );

  const stats = useMemo(
    () => ({
      total:
        environmentVariables.length,

      configured:
        environmentVariables.filter(
          (item) =>
            item.status ===
            "Configured"
        ).length,

      missing:
        environmentVariables.filter(
          (item) =>
            item.status ===
            "Missing"
        ).length,

      invalid:
        environmentVariables.filter(
          (item) =>
            item.status ===
            "Invalid"
        ).length,
    }),
    []
  );

  function refreshEnvironment() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function getStatusColor(
    status: VariableStatus
  ) {
    switch (status) {

      case "Configured":
        return "bg-green-100 text-green-700";

      case "Missing":
        return "bg-yellow-100 text-yellow-700";

      case "Invalid":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }



  async function reloadEnvironment() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/environment/reload

    setSuccess(
      "Environment reloaded successfully."
    );
  } catch {
    setError(
      "Unable to reload environment."
    );
  } finally {
    setActionLoading(false);
  }
}





async function validateEnvironment() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/environment/validate

    setSuccess(
      "Environment validation completed."
    );
  } catch {
    setError(
      "Environment validation failed."
    );
  } finally {
    setActionLoading(false);
  }
}


async function copyVariable(
  variable: EnvironmentVariable
) {
  try {
    await navigator.clipboard.writeText(
      variable.value
    );

    setSuccess(
      `${variable.key} copied to clipboard.`
    );
  } catch {
    setError(
      "Unable to copy variable."
    );
  }
}

async function exportConfiguration() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/environment/export

    setSuccess(
      "Environment configuration exported."
    );
  } catch {
    setError(
      "Unable to export configuration."
    );
  } finally {
    setActionLoading(false);
  }
}


const environmentActivity = [
  {
    id: 1,
    title: "Environment Reloaded",
    description: "Application configuration reloaded successfully.",
    time: "2 minutes ago",
  },
  {
    id: 2,
    title: "Variables Validated",
    description: "All required environment variables verified.",
    time: "10 minutes ago",
  },
  {
    id: 3,
    title: "Configuration Exported",
    description: "Environment configuration downloaded.",
    time: "18 minutes ago",
  },
  {
    id: 4,
    title: "Runtime Refreshed",
    description: "Latest runtime information synchronized.",
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

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <Settings className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  Environment Configuration
                </h1>

                <p className="mt-2 text-slate-200">
                  Monitor application environment variables and runtime configuration.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={refreshEnvironment}
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

      {/* Environment Summary */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <FileCode2 className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Total Variables
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.total}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Configured
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.configured}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <AlertTriangle className="mb-4 h-8 w-8 text-yellow-600" />

          <p className="text-sm text-slate-500">
            Missing
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.missing}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Shield className="mb-4 h-8 w-8 text-indigo-600" />

          <p className="text-sm text-slate-500">
            Environment
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {environment}
          </h3>

        </div>

      </section>

      {/* Runtime Information */}

      <section className="rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <div className="flex items-center gap-3">

            <Server className="h-6 w-6 text-blue-600" />

            <h2 className="text-2xl font-bold">
              Runtime Information
            </h2>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Environment
              </label>

              <input
                disabled
                value={environment}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Next.js Version
              </label>

              <input
                disabled
                value="16.x"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Node.js Runtime
              </label>

              <input
                disabled
                value="Node.js 22"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Time Zone
              </label>

              <input
                disabled
                value="UTC"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Deployment
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <Globe className="h-5 w-5 text-green-600" />

                <span>
                  Production Deployment
                </span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Build Status
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <span>
                  Build Successful
                </span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Last Deployment
              </label>

              <div className="flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-3">

                <Clock3 className="h-5 w-5 text-slate-500" />

                <span>
                  Today • 03:40 PM
                </span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Configuration
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <Info className="h-5 w-5 text-green-600" />

                <span>
                  All Required Variables Loaded
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Environment Variables */}

      <section className="space-y-8">

  {/* Environment Variables */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Environment Variables
          </h2>

          <p className="mt-2 text-slate-500">
            Review configured application variables.
          </p>

        </div>

        <button
          onClick={() =>
            setShowSecrets(!showSecrets)
          }
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-100"
        >

          {showSecrets ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}

          {showSecrets
            ? "Hide Secrets"
            : "Show Secrets"}

        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Variable
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Value
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

          {environmentVariables.map((variable) => (

            <tr
              key={variable.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                <p className="font-semibold">

                  {variable.key}

                </p>

              </td>

              <td className="px-6 py-5 font-mono text-sm">

                {variable.secret &&
                !showSecrets
                  ? "••••••••••••••••"
                  : variable.value || "-"}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    variable.status
                  )}`}
                >

                  {variable.status}

                </span>

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-2">

                  <button
                    onClick={() =>
                      setSelectedVariable(
                        variable
                      )
                    }
                    className="rounded-lg border p-2 hover:bg-blue-50"
                    title="Details"
                  >

                    <Eye className="h-4 w-4 text-blue-600" />

                  </button>

                  <button
  onClick={() =>
    copyVariable(variable)
  }
  className="rounded-lg border p-2 hover:bg-green-50"
  title="Copy"
>

                    <Copy className="h-4 w-4 text-green-600" />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* Feature Flags */}

  <div className="rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">
        Feature Flags
      </h2>

      <p className="mt-2 text-slate-500">
        Current application feature configuration.
      </p>

    </div>

    <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

      {[
        {
          name: "AI Assistant",
          enabled: true,
        },
        {
          name: "Voice Agent",
          enabled: true,
        },
        {
          name: "Public API",
          enabled: false,
        },
        {
          name: "SMS Notifications",
          enabled: true,
        },
        {
          name: "Background Queue",
          enabled: true,
        },
        {
          name: "Maintenance Mode",
          enabled: false,
        },
      ].map((feature) => (

        <div
          key={feature.name}
          className="rounded-xl border p-5"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="font-semibold">

                {feature.name}

              </p>

              <p className="mt-1 text-sm text-slate-500">

                Feature availability

              </p>

            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                feature.enabled
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >

              {feature.enabled
                ? "Enabled"
                : "Disabled"}

            </span>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>


<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Environment Actions
    </h2>

    <p className="mt-2 text-slate-500">
      Validate, reload and export runtime configuration.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={() =>
        setShowReloadModal(true)
      }
      disabled={actionLoading}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      Reload Environment
    </button>

    <button
      onClick={() =>
        setShowValidateModal(true)
      }
      disabled={actionLoading}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
    >
      Validate Variables
    </button>

    <button
      onClick={exportConfiguration}
      disabled={actionLoading}
      className="rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
    >
      Export Configuration
    </button>

    <button
      onClick={refreshEnvironment}
      disabled={loading}
      className="rounded-xl border px-5 py-4 transition hover:bg-slate-100"
    >
      Refresh
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

{selectedVariable && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Environment Variable
        </h2>

        <button
          onClick={() =>
            setSelectedVariable(null)
          }
          className="rounded-lg border px-3 py-2 hover:bg-slate-100"
        >
          Close
        </button>

      </div>

    </div>

    <div className="grid gap-6 p-6">

      <div>

        <p className="text-sm text-slate-500">
          Variable
        </p>

        <p className="mt-2 font-semibold">
          {selectedVariable.key}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Current Value
        </p>

        <div className="mt-2 rounded-xl border bg-slate-50 p-4 font-mono text-sm break-all">

          {selectedVariable.secret &&
          !showSecrets
            ? "••••••••••••••••••••"
            : selectedVariable.value || "-"}

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <p className="text-sm text-slate-500">
            Status
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
              selectedVariable.status
            )}`}
          >
            {selectedVariable.status}
          </span>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Secret
          </p>

          <p className="mt-2 font-semibold">
            {selectedVariable.secret
              ? "Yes"
              : "No"}
          </p>

        </div>

      </div>

    </div>

  </div>

</div>

)}


{showReloadModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold">
        Reload Environment
      </h2>

      <p className="mt-3 text-slate-600">

        Reload all environment variables from
        the server configuration?

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setShowReloadModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={async () => {

          await reloadEnvironment();

          setShowReloadModal(false);

        }}
        className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Reload
      </button>

    </div>

  </div>

</div>

)}


{showValidateModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold">
        Validate Configuration
      </h2>

      <p className="mt-3 text-slate-600">

        Validate every required environment
        variable before continuing?

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setShowValidateModal(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={async () => {

          await validateEnvironment();

          setShowValidateModal(false);

        }}
        className="rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
      >
        Validate
      </button>

    </div>

  </div>

</div>

)}

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Environment Activity
    </h2>

    <p className="mt-2 text-slate-500">
      Recent environment management operations.
    </p>

  </div>

  <div className="divide-y">

    {environmentActivity.map((item) => (

      <div
        key={item.id}
        className="flex items-start gap-4 p-6 hover:bg-slate-50"
      >

        <div className="rounded-full bg-blue-100 p-2">

          <Activity className="h-4 w-4 text-blue-600" />

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