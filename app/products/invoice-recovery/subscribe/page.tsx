"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Plan = {
  id: string;
  name: string;
  price: number;
  invoiceLimit: number | null;
  paypalPlanId: string;
};

export default function SubscribePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/plans/invoice-recovery");
        setPlans(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const subscribe = async (plan: Plan) => {
    try {
      setSubscribingId(plan.id);

      const res = await axios.post("/api/payments/create-subscription", {
        paypalPlanId: plan.paypalPlanId,
        planId: plan.id,
      });

      if (res.data?.approvalUrl) {
        // ✅ Redirect to PayPal
        window.location.href = res.data.approvalUrl;
      } else {
        alert("Failed to start subscription");
      }
    } catch (err: any) {
      console.error("SUBSCRIBE ERROR:", err?.response?.data || err);
      alert("Subscription failed");
    } finally {
      setSubscribingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Choose a plan
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">{p.name}</h3>

            <p className="text-2xl font-bold mb-2">${p.price}/mo</p>

            <p className="text-sm text-gray-500 mb-4">
              {p.invoiceLimit ?? "Unlimited"} invoices
            </p>

            <button
              onClick={() => subscribe(p)}
              disabled={subscribingId === p.id}
              className="w-full bg-black text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {subscribingId === p.id ? "Redirecting..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}