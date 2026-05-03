"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";

type AccountData = {
  plan: string;
  expiresAt: string | null;
  invoiceLimit: number | null;
  used: number;
};

export default function AccountPage() {
  const [data, setData] = useState<AccountData | null>(null);

  const cancel = async () => {
  if (!confirm("Cancel subscription?")) return;

  await axios.post("/api/account/cancel");

  toast.success("Subscription cancelled");
  load();
};

const upgrade = async () => {
  // ⚠️ for now hardcode planId (replace later with UI)
  const planId = "YOUR_GROWTH_PLAN_ID";

  await axios.post("/api/account/upgrade", { planId });

  toast.success("Upgraded!");
  load();
};

  const load = async () => {
    try {
      const res = await axios.get("/api/account");
      setData(res.data);
    } catch {
      toast.error("Failed to load account");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="text-sm text-gray-500">Loading...</div>
      </Layout>
    );
  }

 const remaining =
  data.invoiceLimit === 0
    ? 0
    : data.invoiceLimit === null
    ? "Unlimited"
    : Math.max(0, data.invoiceLimit - data.used);

  return (
    <Layout>
      <div className="space-y-6">

        <h1 className="text-lg font-semibold">My Account</h1>

        {/* PLAN CARD */}
        <div className="bg-white border rounded-lg p-5 space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Plan</span>
            <span className="font-medium">{data.plan}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Expiry</span>
            <span>
              {data.expiresAt
                ? new Date(data.expiresAt).toLocaleDateString()
                : "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">
              Invoices Used
            </span>
            <span>{data.used}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">
              Remaining
            </span>
            <span>{remaining}</span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">

          <button
  onClick={upgrade}
  className="bg-black text-white px-4 py-2 text-sm rounded-md"
>
  Upgrade Plan
</button>

          <button
  onClick={cancel}
  className="border px-4 py-2 text-sm rounded-md text-red-600"
>
  Cancel Subscription
</button>

        </div>

      </div>
    </Layout>
  );
}