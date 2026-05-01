"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* =========================
         NAVBAR
      ========================= */}
      <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-50">
        <h1 className="font-semibold text-lg">KoniqTech</h1>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600">
            Login
          </Link>

          <Link
            href="/login"
            className="text-sm bg-black text-white px-4 py-2 rounded-md"
          >
            Start Free
          </Link>
        </div>
      </div>

      {/* =========================
         HERO
      ========================= */}
      <section className="text-center py-28 px-6 max-w-4xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Stop Chasing Clients.
          <br />
          <span className="text-green-600">
            Get Paid Automatically.
          </span>
        </motion.h1>

        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
          Automatically send reminders, track payments, and recover unpaid invoices — without awkward follow-ups.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-black text-white px-8 py-3 rounded-lg text-lg"
          >
            Start Free Trial
          </Link>

          <a
            href="#pricing"
            className="border px-8 py-3 rounded-lg text-lg"
          >
            View Pricing
          </a>
        </div>

        {/* SOCIAL PROOF */}
        <p className="text-sm text-gray-500 mt-6">
          💰 $24,530 recovered this month by users
        </p>
      </section>

      {/* =========================
         PROBLEM SECTION
      ========================= */}
      <section className="bg-gray-50 py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">
          Late payments are killing your cash flow
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          You send invoices. Clients delay. You follow up manually. It’s awkward, time-consuming, and inconsistent.
        </p>
      </section>

      {/* =========================
         SOLUTION
      ========================= */}
      <section className="py-20 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">

        <Feature
          title="Auto Reminders"
          desc="Day 1, Day 3, Day 7 follow-ups automatically."
        />

        <Feature
          title="AI Emails"
          desc="Perfect tone — friendly to firm."
        />

        <Feature
          title="1-Click Payments"
          desc="Clients pay instantly via PayPal."
        />

      </section>

      {/* =========================
         HOW IT WORKS
      ========================= */}
      <section className="bg-gray-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">

          <Step n="1" text="Create invoice" />
          <Step n="2" text="We follow up automatically" />
          <Step n="3" text="Get paid faster 💸" />

        </div>
      </section>

      {/* =========================
         PRICING
      ========================= */}
      <section id="pricing" className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Simple Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">

          <Plan name="Starter" price="$19" limit="20 invoices" />
          <Plan name="Growth" price="$39" limit="100 invoices" highlight />
          <Plan name="Pro" price="$79" limit="Unlimited" />

        </div>
      </section>

      {/* =========================
         FINAL CTA
      ========================= */}
      <section className="bg-black text-white text-center py-20">
        <h2 className="text-3xl font-bold mb-6">
          Start recovering your money today
        </h2>

        <Link
          href="/login"
          className="bg-white text-black px-8 py-4 rounded-lg text-lg"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function Feature({ title, desc }: any) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function Step({ n, text }: any) {
  return (
    <div>
      <div className="text-2xl font-bold mb-2">{n}</div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function Plan({ name, price, limit, highlight }: any) {
  return (
    <div
      className={`bg-white p-6 border rounded-xl ${
        highlight ? "border-black scale-105 shadow-lg" : ""
      }`}
    >
      <h3 className="font-semibold">{name}</h3>

      <p className="text-3xl font-bold my-4">{price}</p>

      <p className="text-sm text-gray-500">{limit}</p>

      {/* 🔥 PAYPAL BUTTON */}
      <a
        href="/api/paypal/checkout" // connect your PayPal plan here
        className="block mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Subscribe
      </a>
    </div>
  );
}