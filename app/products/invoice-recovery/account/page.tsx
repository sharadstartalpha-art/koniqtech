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
  free: 0,
  starter: 1,
  growth: 2,
  pro: 3,
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

    } catch (err) {
      console.error(err);

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

        setPlans(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (err) {
        console.error(err);

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
        "Cancel subscription?"
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

    } catch (err) {
      console.error(err);

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
          res.data?.links?.find(
            (l: any) =>
              l.rel ===
              "approve"
          )?.href;

        if (!approvalUrl) {
          toast.error(
            "Payment link missing"
          );

          return;
        }

        window.location.href =
          approvalUrl;

      } catch (err: any) {
        console.error(err);

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
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-gray-500">
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
     SAFE PLAN SORTING
  ========================= */

  const sortedPlans =
    [...plans].sort(
      (a, b) =>
        (PLAN_ORDER[
          a.name?.toLowerCase()
        ] ?? 999) -
        (PLAN_ORDER[
          b.name?.toLowerCase()
        ] ?? 999)
    );

  const currentLevel =
    PLAN_ORDER[
      data.plan?.toLowerCase()
    ] ?? 0;

  const nextUpgrade =
    sortedPlans.find(
      (p) =>
        (PLAN_ORDER[
          p.name?.toLowerCase()
        ] ?? 0) >
        currentLevel
    );

  /* =========================
     PLAN STYLE
  ========================= */

  const planStyle =
    useMemo(() => {
      switch (
        data.plan?.toLowerCase()
      ) {
        case "starter":
          return "from-blue-500 to-indigo-600";

        case "growth":
          return "from-orange-500 to-red-500";

        case "pro":
          return "from-purple-600 to-pink-600";

        default:
          return "from-gray-800 to-black";
      }
    }, [data.plan]);

  return (
    <Layout>
      <div className="space-y-8">

        {/* HEADER */}

        <div>
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} />
            Account & Billing
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            My Account
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Manage your subscription and invoice recovery usage.
          </p>
        </div>

        {/* HERO */}

        <div
          className={`rounded-[30px] bg-gradient-to-br ${planStyle} p-8 text-white shadow-xl`}
        >
          <div className="grid lg:grid-cols-2 gap-10">

            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm">
                <Crown size={16} />
                Active Plan
              </div>

              <h2 className="text-5xl font-bold mt-6">
                {data.plan}
              </h2>

              <p className="text-white/80 mt-4">
                Professional invoice recovery tools for modern businesses.
              </p>

              <div className="flex gap-10 mt-10">

                <div>
                  <p className="text-sm text-white/70">
                    Expiry
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
                  <p className="text-sm text-white/70">
                    Limit
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

            <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">

              <div className="flex justify-between mb-4">
                <span className="text-white/70 text-sm">
                  Usage
                </span>

                <span className="font-semibold">
                  {data.used}
                  {data.invoiceLimit !==
                    null &&
                    ` / ${data.invoiceLimit}`}
                </span>
              </div>

              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">

                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width:
                      data.invoiceLimit ===
                      null
                        ? "100%"
                        : `${usagePercentage}%`,
                  }}
                />

              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">

                <StatCard
                  title="Used"
                  value={String(
                    data.used
                  )}
                />

                <StatCard
                  title="Remaining"
                  value={String(
                    remaining
                  )}
                />

              </div>
            </div>

          </div>
        </div>

        {/* CONTENT */}

        <div className="grid xl:grid-cols-3 gap-6">

          {/* LEFT */}

          <div className="xl:col-span-2 bg-white border rounded-3xl p-8">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                <CreditCard size={20} />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  Billing Overview
                </h3>

                <p className="text-sm text-gray-500">
                  Subscription details
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
                title="Expiry"
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
                title="Remaining"
                value={String(
                  remaining
                )}
                color="bg-purple-100 text-purple-600"
              />

            </div>
          </div>

          {/* RIGHT */}

          <div className="bg-white border rounded-3xl p-8 space-y-6">

            <div>
              <h3 className="text-xl font-bold">
                Subscription
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Upgrade or manage your plan
              </p>
            </div>

            {nextUpgrade ? (
              <div className="border rounded-3xl p-6 bg-gradient-to-br from-orange-50 to-white">

                <div className="flex justify-between items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      Next Plan
                    </p>

                    <h4 className="text-2xl font-bold mt-1">
                      {nextUpgrade.name}
                    </h4>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                    <ArrowUpRight size={20} />
                  </div>

                </div>

                <p className="text-4xl font-bold mt-5">
                  $
                  {nextUpgrade.price}

                  <span className="text-lg text-gray-500">
                    /month
                  </span>
                </p>

                <div className="space-y-3 mt-6">

                  <Feature text="Unlimited reminders" />

                  <Feature text="Analytics dashboard" />

                  <Feature text="Priority support" />

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
                  className="w-full mt-6 h-12 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold"
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

                    <p className="text-sm text-green-600">
                      You already have full access.
                    </p>
                  </div>

                </div>
              </div>
            )}

            <button
              onClick={cancel}
              disabled={loading}
              className="w-full h-12 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50"
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
    <div className="border rounded-3xl p-5">

      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <p className="text-sm text-gray-500 mt-5">
        {title}
      </p>

      <h4 className="text-2xl font-bold mt-1">
        {value}
      </h4>

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-sm text-white/70">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>
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