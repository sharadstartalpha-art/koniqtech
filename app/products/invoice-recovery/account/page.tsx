"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Crown,
  CreditCard,
  Calendar,
  FileText,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type AccountData = {
  plan: string;

  expiresAt: string | null;

  invoiceLimit: number | null;

  used: number;
};

type Plan = {
  id: string;

  name: string;

  price: number;
};

/* =========================
   PLAN ORDER
========================= */

const PLAN_ORDER: Record<
  string,
  number
> = {
  Free: 0,
  Starter: 1,
  Growth: 2,
  Pro: 3,
};

export default function AccountPage() {
  const [data, setData] =
    useState<AccountData | null>(
      null
    );

  const [plans, setPlans] =
    useState<Plan[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    checkoutLoading,
    setCheckoutLoading,
  ] = useState<string | null>(
    null
  );

  /* =========================
     LOAD ACCOUNT
  ========================= */

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/account"
        );

      setData(res.data);

    } catch {
      toast.error(
        "Failed to load account"
      );
    }
  };

  /* =========================
     LOAD PLANS
  ========================= */

  const loadPlans =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/plans/invoice-recovery"
          );

        setPlans(res.data);

      } catch {
        toast.error(
          "Failed to load plans"
        );
      }
    };

  useEffect(() => {
    load();

    loadPlans();
  }, []);

  /* =========================
     CANCEL SUBSCRIPTION
  ========================= */

  const cancel = async () => {
    if (
      !confirm(
        "Cancel your subscription?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/api/cancel"
      );

      toast.success(
        "Subscription cancelled"
      );

      load();

    } catch {
      toast.error(
        "Cancel failed"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CHECKOUT
  ========================= */

  const startCheckout =
    async (plan: Plan) => {
      try {
        setCheckoutLoading(
          plan.id
        );

        const res =
          await axios.post(
            "/api/checkout",
            {
              planId: plan.id,
              amount:
                plan.price,
            }
          );

        const approvalUrl =
          res.data.links.find(
            (l: any) =>
              l.rel ===
              "approve"
          )?.href;

        if (!approvalUrl) {
          throw new Error(
            "No approval URL"
          );
        }

        window.location.href =
          approvalUrl;

      } catch (
        err: any
      ) {
        toast.error(
          err?.response?.data
            ?.error ||
            "Payment failed"
        );

      } finally {
        setCheckoutLoading(
          null
        );
      }
    };

  /* =========================
     LOADING
  ========================= */

  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-gray-500 text-sm">
            Loading account...
          </div>
        </div>
      </Layout>
    );
  }

  /* =========================
     STATS
  ========================= */

  const remaining =
    data.invoiceLimit === null
      ? "Unlimited"
      : Math.max(
          0,
          data.invoiceLimit -
            data.used
        );

  const usagePercentage =
    data.invoiceLimit &&
    data.invoiceLimit > 0
      ? Math.min(
          100,
          (data.used /
            data.invoiceLimit) *
            100
        )
      : 0;

  /* =========================
     NEXT UPGRADE
  ========================= */

  const sortedPlans =
    [...plans].sort(
      (a, b) =>
        PLAN_ORDER[a.name] -
        PLAN_ORDER[b.name]
    );

  const currentLevel =
    PLAN_ORDER[data.plan];

  const nextUpgrade =
    sortedPlans.find(
      (p) =>
        PLAN_ORDER[p.name] >
        currentLevel
    );

  /* =========================
     PLAN COLOR
  ========================= */

  const planStyle =
    useMemo(() => {
      switch (data.plan) {
        case "Starter":
          return "from-blue-500 to-indigo-600";

        case "Growth":
          return "from-orange-500 to-red-500";

        case "Pro":
          return "from-purple-600 to-pink-600";

        default:
          return "from-gray-700 to-gray-900";
      }
    }, [data.plan]);

  return (
    <Layout>
      <div className="space-y-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Sparkles
                size={14}
              />
              Billing & Subscription
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Account Settings
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Manage your subscription, invoices, and billing usage.
            </p>
          </div>

        </div>

        {/* =========================
            PLAN CARD
        ========================= */}

        <div
          className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${planStyle} p-8 text-white shadow-2xl`}
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium">
                <Crown size={16} />
                Current Plan
              </div>

              <h2 className="text-5xl font-bold mt-6">
                {data.plan}
              </h2>

              <p className="text-white/80 mt-3 text-lg">
                {data.plan ===
                "Free"
                  ? "Perfect for getting started."
                  : "Advanced tools for growing businesses."}
              </p>

              <div className="flex flex-wrap gap-6 mt-8">

                <div>
                  <p className="text-white/70 text-sm">
                    Renewal Date
                  </p>

                  <p className="font-semibold mt-1">
                    {data.expiresAt
                      ? new Date(
                          data.expiresAt
                        ).toLocaleDateString()
                      : "No expiry"}
                  </p>
                </div>

                <div>
                  <p className="text-white/70 text-sm">
                    Invoice Limit
                  </p>

                  <p className="font-semibold mt-1">
                    {data.invoiceLimit ===
                    null
                      ? "Unlimited"
                      : data.invoiceLimit}
                  </p>
                </div>

              </div>
            </div>

            {/* RIGHT */}

            <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-full max-w-sm">

              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm">
                  Invoice Usage
                </span>

                <span className="font-semibold">
                  {data.used}
                  {data.invoiceLimit !==
                    null &&
                    ` / ${data.invoiceLimit}`}
                </span>
              </div>

              {/* PROGRESS */}

              <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{
                    width:
                      data.invoiceLimit ===
                      null
                        ? "100%"
                        : `${usagePercentage}%`,
                  }}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white/70 text-xs">
                    Used
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {data.used}
                  </h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white/70 text-xs">
                    Remaining
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {remaining}
                  </h3>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =========================
            GRID
        ========================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* =========================
              BILLING INFO
          ========================= */}

          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-[28px] p-8 shadow-sm">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                <CreditCard size={20} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Billing Overview
                </h3>

                <p className="text-sm text-gray-500">
                  Your subscription and invoice activity
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <InfoCard
                icon={
                  <Crown size={20} />
                }
                title="Current Plan"
                value={data.plan}
                color="bg-orange-100 text-orange-600"
              />

              <InfoCard
                icon={
                  <Calendar size={20} />
                }
                title="Plan Expiry"
                value={
                  data.expiresAt
                    ? new Date(
                        data.expiresAt
                      ).toLocaleDateString()
                    : "No expiry"
                }
                color="bg-blue-100 text-blue-600"
              />

              <InfoCard
                icon={
                  <FileText size={20} />
                }
                title="Invoices Used"
                value={String(
                  data.used
                )}
                color="bg-green-100 text-green-600"
              />

              <InfoCard
                icon={
                  <ShieldCheck size={20} />
                }
                title="Remaining Limit"
                value={String(
                  remaining
                )}
                color="bg-purple-100 text-purple-600"
              />

            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="bg-white border border-gray-200 rounded-[28px] p-8 shadow-sm space-y-6">

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Subscription Actions
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Upgrade or manage your plan
              </p>
            </div>

            {/* UPGRADE */}

            {nextUpgrade ? (
              <div className="border border-gray-200 rounded-3xl p-6 bg-gradient-to-br from-orange-50 to-white">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Recommended Upgrade
                    </p>

                    <h4 className="text-2xl font-bold mt-1">
                      {
                        nextUpgrade.name
                      }
                    </h4>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                    <ArrowUpRight
                      size={20}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-4xl font-bold">
                    $
                    {
                      nextUpgrade.price
                    }

                    <span className="text-lg text-gray-500 font-medium">
                      /month
                    </span>
                  </p>
                </div>

                <div className="space-y-3 mt-6">

                  <Feature text="Unlimited automated reminders" />

                  <Feature text="Advanced recovery analytics" />

                  <Feature text="Priority support access" />

                </div>

                <button
                  onClick={() =>
                    startCheckout(
                      nextUpgrade
                    )
                  }
                  disabled={
                    checkoutLoading ===
                    nextUpgrade.id
                  }
                  className="w-full h-12 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold transition mt-6"
                >
                  {checkoutLoading ===
                  nextUpgrade.id
                    ? "Redirecting..."
                    : `Upgrade to ${nextUpgrade.name}`}
                </button>

              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" />

                  <div>
                    <h4 className="font-semibold text-green-700">
                      Highest Plan Active
                    </h4>

                    <p className="text-sm text-green-600 mt-1">
                      You already have full platform access.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CANCEL */}

            <button
              onClick={cancel}
              disabled={loading}
              className="w-full h-12 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition"
            >
              {loading
                ? "Cancelling..."
                : "Cancel Subscription"}
            </button>

          </div>
        </div>
      </div>
    </Layout>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({
  icon,
  title,
  value,
  color,
}: any) {
  return (
    <div className="border border-gray-200 rounded-3xl p-5 hover:shadow-md transition">

      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <p className="text-sm text-gray-500 mt-5">
        {title}
      </p>

      <h4 className="text-2xl font-bold text-gray-900 mt-1">
        {value}
      </h4>

    </div>
  );
}

/* =========================
   FEATURE
========================= */

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <CheckCircle2
        size={16}
        className="text-green-500"
      />

      <span>{text}</span>
    </div>
  );
}