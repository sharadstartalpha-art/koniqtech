"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-center px-6 py-16">

      {/* HERO */}
      <h1 className="text-5xl font-bold mb-4 leading-tight">
        Recover Unpaid Invoices Automatically
      </h1>

      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        Stop chasing clients. Get paid faster with smart automated reminders.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/login"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Get Started
        </Link>

        <Link
          href="/products/invoice-recovery"
          className="border px-6 py-3 rounded"
        >
          View Product
        </Link>
      </div>

      {/* SOCIAL PROOF */}
      <div className="mt-10 text-gray-500 text-sm">
        Trusted by freelancers, agencies & SaaS founders
      </div>

      {/* BENEFITS */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
        <div className="bg-white p-6 shadow rounded">
          💰 <h3 className="font-semibold mt-2">Recover More Revenue</h3>
          <p className="text-sm text-gray-500 mt-1">
            Increase your cash flow without extra effort.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          ⏱ <h3 className="font-semibold mt-2">Save Time</h3>
          <p className="text-sm text-gray-500 mt-1">
            No more manual follow-ups or awkward emails.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          🤖 <h3 className="font-semibold mt-2">Fully Automated</h3>
          <p className="text-sm text-gray-500 mt-1">
            Smart reminders sent at the right time automatically.
          </p>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="mt-16">
        <Link
          href="/login"
          className="bg-black text-white px-8 py-3 rounded text-lg"
        >
          Start Free Trial
        </Link>
      </div>
    </div>
  );
}