"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="font-semibold">KoniqTech</h1>

        <a
          href="/login"
          className="text-sm bg-black text-white px-4 py-2 rounded-md"
        >
          Login
        </a>
      </div>

      {/* HERO */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Stop Chasing Clients.
          <br />
          <span className="text-blue-600">
            Get Paid Automatically.
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Smart reminders. AI follow-ups. Faster payments.
        </p>

        <a
          href="/login"
          className="bg-black text-white px-6 py-3 rounded-lg text-lg"
        >
          Start Free Trial
        </a>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 py-16">
        <Feature title="Auto Reminders" desc="We follow up for you" />
        <Feature title="AI Emails" desc="Human-like follow-ups" />
        <Feature title="Payment Tracking" desc="Know when paid instantly" />
      </section>

      {/* PRICING */}
      <section className="bg-gray-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Simple Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">

          <Plan name="Starter" price="$19" limit="20 invoices" />
          <Plan name="Growth" price="$39" limit="100 invoices" />
          <Plan name="Pro" price="$79" limit="Unlimited" />

        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold mb-6">
          Start Recovering Payments Today
        </h2>

        <a
          href="/login"
          className="bg-black text-white px-8 py-4 rounded-lg text-lg"
        >
          Get Started
        </a>
      </section>

    </div>
  );
}

/* FEATURE */
function Feature({ title, desc }: any) {
  return (
    <div className="bg-white p-6 border rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

/* PLAN */
function Plan({ name, price, limit }: any) {
  return (
    <div className="bg-white p-6 border rounded-lg">

      <h3 className="font-semibold">{name}</h3>

      <p className="text-2xl my-4">{price}</p>

      <p className="text-sm text-gray-500">{limit}</p>

      <a
        href="/login"
        className="block mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Choose
      </a>
    </div>
  );
}