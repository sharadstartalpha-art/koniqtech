"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const plans = [
  { name: "Starter", price: 10, credits: 1000 },
  { name: "Pro", price: 29, credits: 5000 },
  { name: "Enterprise", price: 99, credits: 20000 },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

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
              onClick={handleClick}
              className="mt-6 w-full bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
            >
              Get Started
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}