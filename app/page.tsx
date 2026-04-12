"use client";

export default function HomePage() {
  const plans = [
    { id: "starter", name: "Starter", price: 10, credits: 1000 },
    { id: "pro", name: "Pro", price: 29, credits: 5000 },
    { id: "enterprise", name: "Enterprise", price: 99, credits: 20000 },
  ];

  const handleBuy = async (planId: string) => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();
    window.location.href = data.approveUrl;
  };

  return (
    <div className="max-w-6xl mx-auto py-20">

      <h1 className="text-3xl font-bold text-center mb-10">
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
            <h2 className="text-lg font-semibold">
              {plan.name}
            </h2>

            <p className="text-3xl font-bold mt-4">
              ${plan.price}
            </p>

            <p className="text-gray-500 mt-2">
              {plan.credits} credits
            </p>

            <button
  onClick={() => handleBuy(plan.name)}
  className="bg-black text-white px-6 py-3 rounded-xl"
>
  Get Started
</button>
          </div>
        ))}
      </div>
    </div>
  );
}