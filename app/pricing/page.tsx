"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PricingPage() {
  return (
    <div className="p-10 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-center mb-10">
        Pricing
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* FREE */}
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-gray-500">₹0</p>

          <ul className="mt-4 text-sm">
            <li>10 leads</li>
            <li>No email sending</li>
          </ul>

          <a href="/register" className="block mt-6 bg-gray-200 p-2 text-center rounded">
            Start Free
          </a>
        </div>

        {/* PRO */}
        <div className="border p-6 rounded border-black">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-gray-500">₹999/month</p>

          <ul className="mt-4 text-sm">
            <li>1000 leads</li>
            <li>AI scoring</li>
            <li>Email sending</li>
          </ul>

          <button
            onClick={() => fetch("/api/stripe/checkout")}
            className="block mt-6 bg-black text-white p-2 w-full rounded"
          >
            Upgrade
          </button>
        </div>

        {/* AGENCY */}
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">Agency</h2>
          <p className="text-gray-500">₹2999/month</p>

          <ul className="mt-4 text-sm">
            <li>Unlimited leads</li>
            <li>Automation</li>
          </ul>

          <button
            onClick={() => fetch("/api/paypal/checkout")}
            className="block mt-6 bg-black text-white p-2 w-full rounded"
          >
            Upgrade
          </button>
        </div>

      </div>
    </div>
  )
}