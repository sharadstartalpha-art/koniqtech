"use client";

export const dynamic = "force-dynamic"; // ✅ FIX

const plans = [
  { name: "Starter", price: 10, credits: 1000 },
  { name: "Pro", price: 29, credits: 5000 },
  { name: "Enterprise", price: 99, credits: 20000 },
];

export default function PricingPage() {
  const handleBuy = (plan: string) => {
    window.location.href = `/api/paypal/checkout?plan=${plan}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-16 text-center">

      <h1 className="text-4xl font-bold mb-10">
        Simple Pricing 💎
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {plans.map((plan, i) => (
  <div
    key={plan.name}
    className={`p-6 rounded-2xl border ${
      i === 1 ? "border-black scale-105 shadow-lg" : ""
    }`}
  >
            <h2 className="text-xl font-semibold">{plan.name}</h2>

            <p className="text-4xl font-bold mt-4">
              ${plan.price}
            </p>

            <p className="text-gray-500 mt-2">
              {plan.credits} credits
            </p>

            <button
              onClick={() => handleBuy(plan.name)}
              className="mt-6 w-full bg-black text-white py-3 rounded-lg"
            >
              Upgrade 🚀
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}