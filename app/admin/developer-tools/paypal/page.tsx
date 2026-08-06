"use client";

import { useMemo, useState } from "react";

import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Globe,
  Webhook,
  Receipt,
  Shield,
  Clock3,
  Settings,
} from "lucide-react";

type PayPalEnvironment =
  | "Sandbox"
  | "Production";

type PayPalStatus =
  | "Connected"
  | "Disconnected"
  | "Error";

interface WebhookEvent {
  id: string;

  event: string;

  status: "Success" | "Failed";

  receivedAt: string;
}

interface Plan {
  id: string;

  name: string;

  paypalPlanId: string;

  price: number;

  status: "Active" | "Inactive";
}

const plans: Plan[] = [
  {
    id: "starter",

    name: "Starter",

    paypalPlanId:
      "P-STARTER-XXXXXXXX",

    price: 99,

    status: "Active",
  },

  {
    id: "professional",

    name: "Professional",

    paypalPlanId:
      "P-PRO-XXXXXXXX",

    price: 249,

    status: "Active",
  },

  {
    id: "enterprise",

    name: "Enterprise",

    paypalPlanId:
      "P-ENTERPRISE-XXXX",

    price: 599,

    status: "Active",
  },
];

const webhookEvents: WebhookEvent[] =
  [
    {
      id: "1",

      event:
        "BILLING.SUBSCRIPTION.CREATED",

      status: "Success",

      receivedAt:
        "2026-08-05 14:30",
    },

    {
      id: "2",

      event:
        "PAYMENT.SALE.COMPLETED",

      status: "Success",

      receivedAt:
        "2026-08-05 14:42",
    },

    {
      id: "3",

      event:
        "BILLING.SUBSCRIPTION.CANCELLED",

      status: "Failed",

      receivedAt:
        "2026-08-05 15:01",
    },
  ];

  export default function PayPalTestingPage() {
    const [environment, setEnvironment] =
  useState<PayPalEnvironment>(
    "Sandbox"
  );

const [connectionStatus] =
  useState<PayPalStatus>(
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

const [selectedPlan, setSelectedPlan] =
  useState<Plan | null>(null);

  const [confirmOpen, setConfirmOpen] =
  useState(false);

const [confirmTitle, setConfirmTitle] =
  useState("");

const [confirmMessage, setConfirmMessage] =
  useState("");

 

const [confirmAction, setConfirmAction] =
  useState<(() => Promise<void>) | null>(null);

const [showTestModal, setShowTestModal] =
  useState(false);
  const stats = useMemo(
  () => ({
    plans: plans.length,

    activePlans:
      plans.filter(
        (plan) =>
          plan.status ===
          "Active"
      ).length,

    webhookEvents:
      webhookEvents.length,

    successfulEvents:
      webhookEvents.filter(
        (event) =>
          event.status ===
          "Success"
      ).length,
  }),
  []
);

async function testConnection() {
  try {
    setActionLoading(true);

    // TODO:
    // GET /api/admin/developer-tools/paypal/test

    setSuccess(
      "PayPal API connection successful."
    );
  } catch {
    setError(
      "Unable to connect to PayPal."
    );
  } finally {
    setActionLoading(false);
  }
}

async function syncPlans() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/paypal/sync

    setSuccess(
      "Plans synchronized successfully."
    );
  } catch {
    setError(
      "Unable to sync plans."
    );
  } finally {
    setActionLoading(false);
  }
}

async function createSandboxSubscription(
  plan: Plan
) {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/paypal/subscription

    setSuccess(
      `Sandbox subscription created for ${plan.name}.`
    );
  } catch {
    setError(
      "Unable to create sandbox subscription."
    );
  } finally {
    setActionLoading(false);
  }
}


async function cancelSandboxSubscription() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/paypal/cancel

    setSuccess(
      "Sandbox subscription cancelled."
    );
  } catch {
    setError(
      "Unable to cancel subscription."
    );
  } finally {
    setActionLoading(false);
  }
}

async function triggerWebhook() {
  try {
    setActionLoading(true);

    // TODO:
    // POST /api/admin/developer-tools/paypal/webhook

    setSuccess(
      "Webhook triggered successfully."
    );
  } catch {
    setError(
      "Webhook trigger failed."
    );
  } finally {
    setActionLoading(false);
  }
}


function refreshStatus() {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
  }, 1000);
}

function getStatusColor(
  status: PayPalStatus
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

function openConfirmation(
  title: string,
  message: string,
  action: () => Promise<void>
) {
  setConfirmTitle(title);

  setConfirmMessage(message);

  setConfirmAction(() => action);

  setConfirmOpen(true);
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

      <section className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <CreditCard className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  PayPal Testing
                </h1>

                <p className="mt-2 text-blue-100">
                  Verify plans, subscriptions, webhooks and API connectivity.
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

            <button className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700">

              <ExternalLink className="h-5 w-5" />

              Open PayPal

            </button>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Receipt className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Plans
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.plans}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <CheckCircle2 className="mb-4 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Active Plans
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.activePlans}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Webhook className="mb-4 h-8 w-8 text-indigo-600" />

          <p className="text-sm text-slate-500">
            Webhooks
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.webhookEvents}
          </h3>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <Shield className="mb-4 h-8 w-8 text-emerald-600" />

          <p className="text-sm text-slate-500">
            Successful
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.successfulEvents}
          </h3>

        </div>

      </section>

      {/* Configuration */}

      <section className="rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <div className="flex items-center gap-3">

            <Settings className="h-6 w-6 text-blue-600" />

            <h2 className="text-2xl font-bold">
              Configuration
            </h2>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Environment
              </label>

              <select
                value={environment}
                onChange={(e) =>
                  setEnvironment(
                    e.target
                      .value as PayPalEnvironment
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >

                <option>
                  Sandbox
                </option>

                <option>
                  Production
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Connection
              </label>

              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                  connectionStatus
                )}`}
              >
                {connectionStatus}
              </span>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Client ID
              </label>

              <input
                disabled
                value="Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Webhook URL
              </label>

              <input
                disabled
                value="https://koniqtech.com/api/paypal/webhook"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Last Sync
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <Clock3 className="h-5 w-5 text-slate-400" />

                <span>
                  Today • 02:35 PM
                </span>

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold">
                API Endpoint
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <Globe className="h-5 w-5 text-slate-500" />

                <span>
                  api-m.paypal.com
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Subscription Plans */}

     <section className="space-y-8">

  {/* Subscription Plans */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <h2 className="text-2xl font-bold">
        Subscription Plans
      </h2>

      <p className="mt-2 text-slate-500">
        Verify PayPal plan IDs and pricing.
      </p>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Plan
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              PayPal Plan ID
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Price
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

          {plans.map((plan) => (

            <tr
              key={plan.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5 font-semibold">

                {plan.name}

              </td>

              <td className="px-6 py-5 font-mono text-sm">

                {plan.paypalPlanId}

              </td>

              <td className="px-6 py-5 text-center">

                ${plan.price}/month

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    plan.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {plan.status}
                </span>

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-2">

                  <button
                    className="rounded-lg border px-3 py-2 hover:bg-slate-100"
                  >
                    View
                  </button>

                  <button
  onClick={() =>
    createSandboxSubscription(
      plan
    )
  }
  disabled={actionLoading}
  className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
>
  Test
</button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* Webhook Events */}

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

    <div className="border-b p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Recent Webhook Events
          </h2>

          <p className="mt-2 text-slate-500">
            Latest PayPal webhook activity.
          </p>

        </div>

        <button
          className="rounded-xl border px-4 py-2 hover:bg-slate-100"
        >
          Verify Webhook
        </button>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Event
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Received
            </th>

          </tr>

        </thead>

        <tbody>

          {webhookEvents.map((event) => (

            <tr
              key={event.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-5">

                {event.event}

              </td>

              <td className="px-6 py-5 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    event.status === "Success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {event.status}
                </span>

              </td>

              <td className="px-6 py-5 text-right text-slate-500">

                {event.receivedAt}

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
      Testing Actions
    </h2>

    <p className="mt-2 text-slate-500">
      Execute sandbox testing utilities.
    </p>

  </div>

  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

    <button
      onClick={testConnection}
      disabled={actionLoading}
      className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      Test API Connection
    </button>

    <button
      onClick={syncPlans}
      disabled={actionLoading}
      className="rounded-xl bg-green-600 px-5 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      Sync Plans
    </button>

    <button
      onClick={triggerWebhook}
      disabled={actionLoading}
      className="rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      Trigger Test Webhook
    </button>

    <button
     onClick={() =>
  openConfirmation(
    "Cancel Sandbox Subscription",
    "Cancel the active sandbox subscription?",
    cancelSandboxSubscription
  )
}
      disabled={actionLoading}
      className="rounded-xl bg-red-600 px-5 py-4 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      Cancel Sandbox Subscription
    </button>

    <button
      onClick={refreshStatus}
      disabled={loading}
      className="rounded-xl border px-5 py-4 hover:bg-slate-100"
    >
      Refresh Status
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

  </div>

</section>

{/* Activity Log */}

<section className="rounded-2xl border bg-white shadow-sm">

  <div className="border-b p-6">

    <h2 className="text-2xl font-bold">
      Activity Log
    </h2>

    <p className="mt-2 text-slate-500">
      Recent PayPal testing activity.
    </p>

  </div>

  <div className="divide-y">

    {[
      {
        action: "API Connection Test",
        result: "Success",
        time: "2 minutes ago",
      },
      {
        action: "Webhook Trigger",
        result: "Success",
        time: "5 minutes ago",
      },
      {
        action: "Plan Synchronization",
        result: "Success",
        time: "12 minutes ago",
      },
      {
        action: "Sandbox Subscription",
        result: "Failed",
        time: "18 minutes ago",
      },
    ].map((log, index) => (

      <div
        key={index}
        className="flex items-center justify-between p-5 hover:bg-slate-50"
      >

        <div>

          <p className="font-medium">

            {log.action}

          </p>

          <p className="mt-1 text-sm text-slate-500">

            {log.time}

          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            log.result === "Success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {log.result}
        </span>

      </div>

    ))}

  </div>

</section>



{confirmOpen && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

  <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

    <div className="border-b p-6">

      <h2 className="text-xl font-bold">

        {confirmTitle}

      </h2>

      <p className="mt-3 text-slate-600">

        {confirmMessage}

      </p>

    </div>

    <div className="flex justify-end gap-3 p-6">

      <button
        onClick={() =>
          setConfirmOpen(false)
        }
        className="rounded-xl border px-5 py-2"
      >
        Cancel
      </button>

      <button
        onClick={async () => {

          if (confirmAction) {

            await confirmAction();

          }

          setConfirmOpen(false);

        }}
        className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
      >
        Confirm
      </button>

    </div>

  </div>

</div>

)}



 </div>

         );
         }






