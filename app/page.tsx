"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Recover Unpaid Invoices Automatically
      </h1>

      <p className="mb-6">
        Stop chasing clients. Get paid faster with automated reminders.
      </p>

      {/* ✅ FIX: go to product page, not dashboard */}
      <Link
        href="/products/invoice-recovery"
        className="bg-black text-white px-6 py-3"
      >
        Get Started
      </Link>
    </div>
  );
}