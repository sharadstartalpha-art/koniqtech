"use client";

import { useSession } from "next-auth/react";

const plans = [
  { name: "STARTER", price: 10, credits: 1000 },
  { name: "PRO", price: 29, credits: 5000 },
  { name: "ENTERPRISE", price: 99, credits: 20000 },
];

export default function PricingPage() {
  const { data: session } = useSession();

  const buy = async (plan: string) => {
    if (!session) {
      window.location.href = "/register";
      return;
    }

    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();

    window.location.href = data.approveUrl;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10">Pricing 💎</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`p-6 rounded-2xl border ${
              i === 1 ? "border-black scale-105 shadow-lg" : ""
            }`}
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>

            <p className="text-4xl font-bold mt-4">${plan.price}</p>

            <p className="text-gray-500 mt-2">
              {plan.credits} credits
            </p>

            <button
              onClick={() => buy(plan.name)}
              className="mt-6 w-full bg-black text-white px-6 py-3 rounded-xl"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}