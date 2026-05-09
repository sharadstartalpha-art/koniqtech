"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Download,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type BillingItem = {
  id: string;
  user?: {
    name?: string;
    email?: string;
  };
  plan?: {
    name?: string;
    price?: number;
  };
  status: string;
  createdAt: string;
  expiresAt?: string;
};

/* =========================
   PAGE
========================= */

export default function AdminBillingPage() {
  const [billing, setBilling] =
    useState<BillingItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  /* =========================
     LOAD BILLING
  ========================= */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/admin/billing"
        );

      setBilling(res.data || []);

    } catch (err) {
      console.error(
        "Billing load failed",
        err
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER
  ========================= */

  const filtered =
    billing.filter((b) => {
      const text = `
        ${b.user?.name || ""}
        ${b.user?.email || ""}
        ${b.plan?.name || ""}
      `.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  /* =========================
     STATS
  ========================= */

  const totalRevenue =
    billing.reduce(
      (sum, b) =>
        sum +
        Number(
          b.plan?.price || 0
        ),
      0
    );

  const activeSubs =
    billing.filter(
      (b) =>
        b.status === "active"
    ).length;

  const cancelled =
    billing.filter(
      (b) =>
        b.status === "cancelled"
    ).length;

  const monthlyRevenue =
    Math.round(totalRevenue * 0.7);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">

        <div className="h-10 w-64 bg-gray-200 rounded-xl" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map(
            (i) => (
              <div
                key={i}
                className="h-32 bg-white border rounded-3xl"
              />
            )
          )}

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-gray-900 to-black p-8 text-white">

        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-5">

              <CreditCard size={16} />

              Billing Management

            </div>

            <h1 className="text-4xl font-bold">
              Billing & Revenue
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl leading-7">
              Monitor subscriptions,
              payments, recurring
              revenue, and billing
              activity across your SaaS
              platform.
            </p>

          </div>

          <button className="bg-white text-black px-5 py-3 rounded-2xl font-medium hover:bg-gray-100 transition flex items-center gap-2 w-fit">

            <Download size={18} />

            Export Report

          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue}`}
          icon={DollarSign}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue}`}
          icon={TrendingUp}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Active Subs"
          value={activeSubs}
          icon={Users}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Cancelled"
          value={cancelled}
          icon={XCircle}
          color="bg-red-100 text-red-600"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Billing History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage all subscription
              payments and billing
              activity.
            </p>

          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search billing..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left">

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Plan
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Expires
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-20 text-gray-400"
                  >
                    No billing data found
                  </td>
                </tr>
              ) : (
                filtered.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >

                      {/* USER */}

                      <td className="px-6 py-5">

                        <div>

                          <p className="font-semibold text-gray-900">
                            {item.user
                              ?.name ||
                              "Unknown User"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {
                              item
                                .user
                                ?.email
                            }
                          </p>

                        </div>

                      </td>

                      {/* PLAN */}

                      <td className="px-6 py-5">

                        <div className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium">

                          {item.plan
                            ?.name ||
                            "Free"}

                        </div>

                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-5 font-semibold text-gray-900">

                        $
                        {item.plan
                          ?.price || 0}

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <StatusBadge
                          status={
                            item.status
                          }
                        />

                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-5 text-sm text-gray-600">

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </td>

                      {/* EXPIRES */}

                      <td className="px-6 py-5 text-sm text-gray-600">

                        {item.expiresAt
                          ? new Date(
                              item.expiresAt
                            ).toLocaleDateString()
                          : "—"}

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon size={24} />
        </div>

      </div>

    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "active") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">

        <CheckCircle2 size={15} />

        Active

      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium">

        <XCircle size={15} />

        Cancelled

      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-sm font-medium">

      <Clock3 size={15} />

      Pending

    </div>
  );
}