// app/products/invoice-recovery/account/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  BadgeCheck,
  CreditCard,
  Sparkles,
  TrendingUp,
  FileText,
  Clock3,
  Crown,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

/* =========================================
   TYPES
========================================= */

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

/* =========================================
   PLAN ORDER
========================================= */

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

  /* =========================================
     STATE
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [cancelLoading, setCancelLoading] =
    useState(false);

  const [data, setData] =
    useState<AccountData | null>(
      null
    );

  const [plans, setPlans] =
    useState<Plan[]>([]);

  /* =========================================
     LOAD ACCOUNT
  ========================================= */

  const load =
    async () => {
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

      } finally {

        setLoading(false);
      }
    };

  /* =========================================
     LOAD PLANS
  ========================================= */

  const loadPlans =
    async () => {
      try {

        const res =
          await axios.get(
            "/api/plans/invoice-recovery"
          );

        setPlans(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );

      } catch (err) {

        console.error(err);
      }
    };

  useEffect(() => {
    load();

    loadPlans();
  }, []);

  /* =========================================
     CANCEL
  ========================================= */

  const cancel =
    async () => {

      const ok =
        confirm(
          "Cancel your subscription?"
        );

      if (!ok) return;

      try {

        setCancelLoading(true);

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
          "Failed to cancel subscription"
        );

      } finally {

        setCancelLoading(false);
      }
    };

  /* =========================================
     CHECKOUT
  ========================================= */

  const startCheckout =
    async (plan: Plan) => {
      try {

        const res =
          await axios.post(
            "/api/checkout",
            {
              planId:
                plan.id,

              amount:
                plan.price,
            }
          );

        const approvalUrl =
          res.data.links?.find(
            (l: any) =>
              l.rel ===
              "approve"
          )?.href;

        if (
          !approvalUrl
        ) {
          throw new Error(
            "No approval URL"
          );
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
      }
    };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <Layout>

        <div className="space-y-6">

          <div className="h-10 w-60 bg-gray-200 rounded animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {[1, 2, 3].map(
              (i) => (
                <div
                  key={i}
                  className="h-36 bg-white rounded-3xl border border-gray-200 animate-pulse"
                />
              )
            )}

          </div>

        </div>

      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>

        <div className="text-red-500">
          Failed to load account
        </div>

      </Layout>
    );
  }

  /* =========================================
     COMPUTED
  ========================================= */

  const remaining =
    data.invoiceLimit ===
    null
      ? "Unlimited"
      : Math.max(
          0,
          data.invoiceLimit -
            data.used
        );

  const usagePercentage =
    data.invoiceLimit ===
    null
      ? 0
      : Math.min(
          100,
          (data.used /
            data.invoiceLimit) *
            100
        );

  const sortedPlans =
    [...plans].sort(
      (a, b) =>
        PLAN_ORDER[
          a.name
        ] -
        PLAN_ORDER[
          b.name
        ]
    );

  const currentLevel =
    PLAN_ORDER[
      data.plan
    ] || 0;

  const nextUpgrade =
    sortedPlans.find(
      (p) =>
        PLAN_ORDER[
          p.name
        ] > currentLevel
    );

  return (
    <Layout>

      <div className="space-y-8">

        {/* =========================================
           HEADER
        ========================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-3">

              <Sparkles
                size={18}
                className="text-orange-500"
              />

              <span className="text-sm font-medium text-orange-600">
                Billing & Subscription
              </span>

            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Account
            </h1>

            <p className="text-gray-500 mt-2 text-base">
              Manage your subscription, usage,
              billing, and plan upgrades.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="
              h-12 px-5 rounded-2xl
              bg-black text-white
              flex items-center gap-2
              font-semibold
            ">

              <BadgeCheck size={18} />

              {data.plan} Plan

            </div>

          </div>

        </div>

        {/* =========================================
           PLAN OVERVIEW
        ========================================= */}

        <div className="
          bg-gradient-to-br
          from-black to-gray-900
          rounded-3xl
          p-7 text-white
          overflow-hidden
          relative
        ">

          <div className="
            absolute top-0 right-0
            w-64 h-64
            bg-white/5
            rounded-full
            blur-3xl
          " />

          <div className="relative z-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3">

                  <div className="
                    w-14 h-14 rounded-2xl
                    bg-white/10
                    flex items-center justify-center
                  ">

                    <Crown className="w-7 h-7 text-yellow-300" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-300">
                      Current Subscription
                    </p>

                    <h2 className="text-4xl font-bold mt-1">
                      {data.plan}
                    </h2>

                  </div>

                </div>

                <div className="mt-6 text-gray-300 leading-7">

                  {data.expiresAt
                    ? `Your subscription renews on ${new Date(
                        data.expiresAt
                      ).toLocaleDateString()}.`
                    : "No renewal date available."}

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[320px]">

                <HeroCard
                  title="Invoices Used"
                  value={String(
                    data.used
                  )}
                  icon={FileText}
                />

                <HeroCard
                  title="Remaining"
                  value={String(
                    remaining
                  )}
                  icon={TrendingUp}
                />

                <HeroCard
                  title="Limit"
                  value={
                    data.invoiceLimit ===
                    null
                      ? "∞"
                      : String(
                          data.invoiceLimit
                        )
                  }
                  icon={CreditCard}
                />

                <HeroCard
                  title="Renewal"
                  value={
                    data.expiresAt
                      ? new Date(
                          data.expiresAt
                        ).toLocaleDateString()
                      : "—"
                  }
                  icon={Clock3}
                />

              </div>

            </div>

          </div>

        </div>

        {/* =========================================
           USAGE
        ========================================= */}

        <div className="
          bg-white border border-gray-200
          rounded-3xl p-6 shadow-sm
        ">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-xl font-semibold">
                Usage Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Invoice usage for current billing cycle
              </p>

            </div>

            <div className="
              px-4 py-2 rounded-full
              bg-orange-100 text-orange-700
              text-sm font-medium
            ">

              {usagePercentage.toFixed(
                0
              )}
              % Used

            </div>

          </div>

          <div className="
            h-4 rounded-full
            bg-gray-100 overflow-hidden
          ">

            <div
              className="
                h-full rounded-full
                bg-gradient-to-r
                from-orange-500 to-orange-600
              "
              style={{
                width: `${usagePercentage}%`,
              }}
            />

          </div>

        </div>

        {/* =========================================
           UPGRADE
        ========================================= */}

        <div className="
          bg-white border border-gray-200
          rounded-3xl p-6 shadow-sm
        ">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Upgrade Subscription
              </h2>

              <p className="text-gray-500 mt-2">
                Unlock higher invoice limits,
                automation, analytics, and AI recovery.
              </p>

            </div>

            <div className="flex gap-3 flex-wrap">

              {nextUpgrade ? (

                <button
                  onClick={() =>
                    startCheckout(
                      nextUpgrade
                    )
                  }
                  className="
                    h-12 px-5 rounded-2xl
                    bg-black text-white
                    flex items-center gap-2
                    font-semibold
                    hover:bg-gray-900
                    transition
                  "
                >

                  <ArrowUpRight size={18} />

                  Upgrade to{" "}
                  {nextUpgrade.name}

                </button>

              ) : (

                <div className="
                  px-5 py-3 rounded-2xl
                  bg-green-100 text-green-700
                  font-medium
                ">

                  Highest plan active

                </div>

              )}

              <button
                onClick={cancel}
                disabled={
                  cancelLoading
                }
                className="
                  h-12 px-5 rounded-2xl
                  border border-red-200
                  text-red-600
                  hover:bg-red-50
                  transition
                "
              >

                {cancelLoading
                  ? "Cancelling..."
                  : "Cancel Subscription"}

              </button>

            </div>

          </div>

        </div>

        {/* =========================================
           SECURITY
        ========================================= */}

        <div className="
          bg-white border border-gray-200
          rounded-3xl p-6 shadow-sm
        ">

          <div className="flex items-start gap-4">

            <div className="
              w-14 h-14 rounded-2xl
              bg-green-100
              text-green-600
              flex items-center justify-center
            ">

              <ShieldCheck size={26} />

            </div>

            <div>

              <h3 className="text-xl font-semibold">
                Secure Billing
              </h3>

              <p className="text-gray-500 mt-2 leading-7 max-w-2xl">
                Your subscription and billing
                information are protected with
                secure payment infrastructure and
                encrypted authentication systems.
              </p>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

/* =========================================
   HERO CARD
========================================= */

function HeroCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="
      bg-white/5 backdrop-blur
      border border-white/10
      rounded-2xl p-5
    ">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {value}
          </h3>

        </div>

        <div className="
          w-11 h-11 rounded-xl
          bg-white/10
          flex items-center justify-center
        ">

          <Icon size={18} />

        </div>

      </div>

    </div>
  );
}