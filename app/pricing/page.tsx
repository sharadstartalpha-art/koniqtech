"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Upgrade Your Plan 🚀
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <Plan
          name="Starter"
          price="$9"
          credits="500"
        />
        <Plan
          name="Growth"
          price="$29"
          credits="2000"
        />
        <Plan
          name="Pro"
          price="$79"
          credits="10000"
        />
      </div>
    </div>
  )
}

function Plan({ name, price, credits }: any) {
  return (
    <div className="border p-6 rounded-xl text-center">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-3xl my-4">{price}</p>
      <p>{credits} credits</p>

      <button
  onClick={() => {
  window.location.href = `/api/paypal/checkout?plan=GROWTH`
}}
  className="mt-4 bg-black text-white px-4 py-2 rounded"
>
  Upgrade
</button>
    </div>
  )
}