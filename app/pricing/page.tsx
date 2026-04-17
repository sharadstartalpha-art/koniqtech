"use client";

import { useSession } from "next-auth/react";

const plans = [
  { name: "Starter", price: 10, credits: 1000 },
  { name: "Pro", price: 29, credits: 5000 },
  { name: "Enterprise", price: 99, credits: 20000 },
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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-20">

      <h1 className="text-4xl font-bold text-center mb-12">
        Pricing 💎
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:-translate-y-1 hover:shadow-xl transition ${
              i === 1 ? "scale-105 border-blue-500" : ""
            }`}
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>

            <p className="text-4xl font-bold mt-4">
              ${plan.price}
            </p>

            <p className="text-gray-400 mt-2">
              {plan.credits} credits
            </p>

            <button
              onClick={() => buy(plan.name)}
              className="mt-6 w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700"
            >
              Buy Now
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}