"use client";
export const dynamic = "force-dynamic";

export default function PricingPage() {
  const plans = [
    { id: "starter", name: "Starter", price: 10, credits: 1000 },
    { id: "pro", name: "Pro", price: 29, credits: 5000 },
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
    <div className="max-w-5xl mx-auto py-20 grid md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <div key={plan.id} className="bg-white border p-6 rounded-xl">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="text-3xl font-bold mt-2">${plan.price}</p>
          <p className="text-gray-500 mt-2">
            {plan.credits} credits
          </p>

          <button
            onClick={() => handleBuy(plan.id)}
            className="mt-6 w-full bg-black text-white py-2 rounded-lg"
          >
            Upgrade
          </button>
        </div>
      ))}
    </div>
  );
}