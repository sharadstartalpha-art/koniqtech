"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-center p-10">

      {/* HERO */}
      <h1 className="text-5xl font-bold mb-4">
        Stop Chasing Clients for Payments
      </h1>

      <p className="text-lg mb-6">
        Automatically recover unpaid invoices with smart follow-ups.
      </p>

      <a
        href="/login"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Start Free Trial
      </a>

      {/* PROOF */}
      <div className="mt-8 text-gray-600">
        Users recover $500–$3000/month extra
      </div>

      {/* BENEFITS */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">

        <div className="bg-white p-6 shadow rounded">
          💰 Recover lost money automatically
        </div>

        <div className="bg-white p-6 shadow rounded">
          ⏱ Save hours chasing clients
        </div>

        <div className="bg-white p-6 shadow rounded">
          🤖 AI-powered follow-ups
        </div>

      </div>

      {/* CTA */}
      <div className="mt-12">
        <a
          href="/login"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Get Started Free
        </a>
      </div>
    </div>
  );
}