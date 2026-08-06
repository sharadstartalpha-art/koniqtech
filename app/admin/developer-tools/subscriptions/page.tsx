"use client";

import { useState } from "react";
import {
  CreditCard,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
} from "lucide-react";

type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "PAST_DUE"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED";

type Plan =
  | "Starter"
  | "Professional"
  | "Enterprise";

interface OrganizationSubscription {
  id: string;
  organization: string;
  owner: string;
  plan: Plan;
  status: SubscriptionStatus;
  users: number;
  expires: string;
  payment: string;
}

const organizations: OrganizationSubscription[] = [
  {
    id: "1",
    organization: "Starter Demo Roofing",
    owner: "starter@koniqtech.com",
    plan: "Starter",
    status: "ACTIVE",
    users: 4,
    expires: "2026-09-01",
    payment: "$99",
  },
  {
    id: "2",
    organization: "Professional Demo HVAC",
    owner: "professional@koniqtech.com",
    plan: "Professional",
    status: "TRIAL",
    users: 18,
    expires: "2026-08-20",
    payment: "$199",
  },
  {
    id: "3",
    organization: "Enterprise Demo Plumbing",
    owner: "enterprise@koniqtech.com",
    plan: "Enterprise",
    status: "ACTIVE",
    users: 63,
    expires: "2026-09-01",
    payment: "$499",
  },
];

function statusColor(status: SubscriptionStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "TRIAL":
      return "bg-blue-100 text-blue-700";

    case "PAST_DUE":
      return "bg-orange-100 text-orange-700";

    case "SUSPENDED":
      return "bg-yellow-100 text-yellow-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "EXPIRED":
      return "bg-slate-200 text-slate-700";
  }
}

export default function SubscriptionSimulatorPage() {
  const [search, setSearch] = useState("");

  const filtered = organizations.filter((o) =>
    (
      o.organization +
      o.owner +
      o.plan
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-green-600 p-3 text-white">
            <CreditCard className="h-7 w-7" />
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              Subscription Simulator
            </h1>

            <p className="mt-2 text-slate-600">
              Instantly change customer subscriptions
              without touching PayPal.
            </p>

          </div>

        </div>

        <div className="relative mt-8">

          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search organization..."
            className="w-full rounded-xl border py-3 pl-12 pr-4"
          />

        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm text-slate-600">

              <th className="px-6 py-4">
                Organization
              </th>

              <th className="px-6 py-4">
                Plan
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Users
              </th>

              <th className="px-6 py-4">
                Renewal
              </th>

              <th className="px-6 py-4">
                Monthly
              </th>

              <th className="px-6 py-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-blue-100 p-2">

                      <Building2 className="h-5 w-5 text-blue-600" />

                    </div>

                    <div>

                      <p className="font-semibold">
                        {item.organization}
                      </p>

                      <p className="text-sm text-slate-500">
                        {item.owner}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <select
                    defaultValue={item.plan}
                    className="rounded-lg border px-3 py-2"
                  >
                    <option>Starter</option>
                    <option>Professional</option>
                    <option>Enterprise</option>
                  </select>

                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="px-6 py-5">
                  {item.users}
                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Calendar className="h-4 w-4 text-slate-400" />

                    {item.expires}

                  </div>

                </td>

                <td className="px-6 py-5 font-semibold">
                  {item.payment}
                </td>

                <td className="px-6 py-5">

                  <div className="flex flex-wrap gap-2">

                    <button className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700">
                      Activate
                    </button>

                    <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                      Trial
                    </button>

                    <button className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600">
                      Suspend
                    </button>

                    <button className="rounded-lg bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700">
                      Past Due
                    </button>

                    <button className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700">
                      Cancel
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-xl border bg-white p-6">

          <CheckCircle2 className="mb-3 h-8 w-8 text-green-600" />

          <p className="text-sm text-slate-500">
            Active
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            24
          </h2>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <Clock3 className="mb-3 h-8 w-8 text-blue-600" />

          <p className="text-sm text-slate-500">
            Trials
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            8
          </h2>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <AlertTriangle className="mb-3 h-8 w-8 text-orange-600" />

          <p className="text-sm text-slate-500">
            Past Due
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            2
          </h2>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <XCircle className="mb-3 h-8 w-8 text-red-600" />

          <p className="text-sm text-slate-500">
            Cancelled
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            5
          </h2>

        </div>

      </div>

    </div>
  );
}