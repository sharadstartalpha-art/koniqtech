"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SubscribePage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/api/plans/invoice-recovery")
      .then((res) => setPlans(res.data))
      .catch(() => alert("Failed to load plans"));
  }, []);

  const subscribe = async (plan: any) => {
    try {
      const res = await axios.post("/api/payments/create-subscription", {
        paypalPlanId: plan.paypalPlanId,
        planId: plan.id,
      });

      window.location.href = res.data.approvalUrl;
    } catch (err) {
      alert("Subscription failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">Choose a plan</h1>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="border p-6 rounded-lg">
            <h3 className="font-semibold">{p.name}</h3>

            <p className="text-xl">${p.price}/mo</p>

            <p className="text-sm text-gray-500">
              {p.invoiceLimit ?? "Unlimited"} invoices
            </p>

            <button
              onClick={() => subscribe(p)}
              className="mt-4 w-full bg-black text-white py-2 rounded"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}