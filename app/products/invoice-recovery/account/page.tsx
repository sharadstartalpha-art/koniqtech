"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

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
    useState(true);

  const [cancelLoading, setCancelLoading] =
    useState(false);

  /* =========================
     LOAD ACCOUNT
  ========================= */

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/account"
        );

      console.log(
        "ACCOUNT:",
        res.data
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

  /* =========================
     CANCEL
  ========================= */

  const cancel =
    async () => {
      if (
        !confirm(
          "Cancel subscription?"
        )
      ) {
        return;
      }

      try {
        setCancelLoading(true);

        await axios.post(
          "/api/cancel"
        );

        toast.success(
          "Subscription cancelled"
        );

        await load();

      } catch (err) {
        console.error(err);

        toast.error(
          "Cancel failed"
        );

      } finally {
        setCancelLoading(false);
      }
    };

  /* =========================
     CHECKOUT
  ========================= */

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

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          Loading account...
        </div>
      </Layout>
    );
  }

  /* =========================
     NO DATA
  ========================= */

  if (!data) {
    return (
      <Layout>
        <div className="p-8 text-red-500">
          Failed to load account
        </div>
      </Layout>
    );
  }

  /* =========================
     REMAINING
  ========================= */

  let remaining:
    | string
    | number = 0;

  if (
    data.invoiceLimit ===
    null
  ) {
    remaining =
      "Unlimited";

  } else {
    remaining = Math.max(
      0,
      data.invoiceLimit -
        data.used
    );
  }

  /* =========================
     NEXT PLAN
  ========================= */

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
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold">
            Account
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your billing,
            plan and usage.
          </p>
        </div>

        {/* PLAN CARD */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <p className="text-sm text-gray-500">
                Current Plan
              </p>

              <h2 className="text-2xl font-bold">
                {data.plan}
              </h2>
            </div>

            <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Active
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Card
              label="Invoices Used"
              value={String(
                data.used
              )}
            />

            <Card
              label="Remaining"
              value={String(
                remaining
              )}
            />

            <Card
              label="Renewal"
              value={
                data.expiresAt
                  ? new Date(
                      data.expiresAt
                    ).toLocaleDateString()
                  : "—"
              }
            />

          </div>

        </div>

        {/* UPGRADE */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h3 className="text-xl font-semibold mb-4">
            Subscription
          </h3>

          <div className="flex gap-3 flex-wrap">

            {nextUpgrade ? (
              <button
                onClick={() =>
                  startCheckout(
                    nextUpgrade
                  )
                }
                className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90"
              >
                Upgrade to{" "}
                {
                  nextUpgrade.name
                } (
                $
                {
                  nextUpgrade.price
                }
                )
              </button>

            ) : (
              <div className="text-sm text-gray-500">
                You are already on the highest plan.
              </div>
            )}

            <button
              onClick={cancel}
              disabled={
                cancelLoading
              }
              className="border border-red-200 text-red-600 px-5 py-3 rounded-xl hover:bg-red-50"
            >
              {cancelLoading
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
   CARD
========================= */

function Card({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="border rounded-xl p-5">

      <p className="text-sm text-gray-500 mb-2">
        {label}
      </p>

      <h3 className="text-2xl font-bold">
        {value}
      </h3>

    </div>
  );
}