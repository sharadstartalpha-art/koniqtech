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
  price: number; // ⚠️ required now
};

/* =========================
   PLAN ORDER
========================= */
const PLAN_ORDER: Record<string, number> = {
  Free: 0,
  Starter: 1,
  Growth: 2,
  Pro: 3,
};

export default function AccountPage() {
  const [data, setData] = useState<AccountData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  /* LOAD ACCOUNT */
  const load = async () => {
    try {
      const res = await axios.get("/api/account");
      setData(res.data);
    } catch {
      toast.error("Failed to load account");
    }
  };

  /* LOAD PLANS */
  const loadPlans = async () => {
    try {
      const res = await axios.get("/api/plans/invoice-recovery");
      setPlans(res.data);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  useEffect(() => {
    load();
    loadPlans();
  }, []);

  /* CANCEL */
  const cancel = async () => {
    if (!confirm("Cancel subscription?")) return;

    try {
      setLoading(true);
      await axios.post("/api/cancel");

      toast.success("Subscription cancelled");
      load();
    } catch {
      toast.error("Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PAYPAL CHECKOUT
  ========================= */
  const startCheckout = async (plan: Plan) => {
    try {
      const res = await axios.post("/api/checkout", {
        planId: plan.id,
        amount: plan.price,
      });

      // 🔥 get approval link
      const approvalUrl = res.data.links.find(
        (l: any) => l.rel === "approve"
      )?.href;

      if (!approvalUrl) {
        throw new Error("No approval URL");
      }

      window.location.href = approvalUrl;

    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Payment failed");
    }
  };

  if (!data) {
    return (
      <Layout>
        <div className="text-sm text-gray-500">Loading...</div>
      </Layout>
    );
  }

  /* REMAINING */
  let remaining: string | number;

  if (data.invoiceLimit === 0) {
    remaining = 0;
  } else if (data.invoiceLimit === null) {
    remaining = "Unlimited";
  } else {
    remaining = Math.max(0, data.invoiceLimit - data.used);
  }

  /* ONLY UPGRADES */
  const upgradePlans = plans.filter(
    (p) => PLAN_ORDER[p.name] > PLAN_ORDER[data.plan]
  );

  return (
    <Layout>
      <div className="space-y-6">

        <h1 className="text-lg font-semibold">My Account</h1>

        <div className="bg-white border rounded-lg p-5 space-y-3">
          <Row label="Plan" value={data.plan} />
          <Row
            label="Expiry"
            value={
              data.expiresAt
                ? new Date(data.expiresAt).toLocaleDateString()
                : "—"
            }
          />
          <Row label="Invoices Used" value={data.used} />
          <Row label="Remaining" value={remaining} />
        </div>

        <div className="flex gap-3 flex-wrap">

          {/* UPGRADE */}
          {upgradePlans.length > 0 ? (
            upgradePlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => startCheckout(plan)}
                className="bg-black text-white px-4 py-2 rounded-md text-sm"
              >
                Upgrade to {plan.name} (${plan.price})
              </button>
            ))
          ) : (
            <div className="text-sm text-gray-400">
              You are on highest plan
            </div>
          )}

          {/* CANCEL */}
          <button
            onClick={cancel}
            disabled={loading}
            className="border px-4 py-2 text-sm rounded-md text-red-600"
          >
            Cancel Subscription
          </button>

        </div>

      </div>
    </Layout>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}