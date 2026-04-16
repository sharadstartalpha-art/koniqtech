"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold leading-tight"
        >
          Generate Leads & Send Cold Emails Automatically
        </motion.h1>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          Find verified leads, send smart sequences, and close deals —
          all from one platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg">
              Start Free Trial 🚀
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="border border-gray-600 px-6 py-3 rounded-lg text-lg">
              View Demo
            </button>
          </Link>
        </div>

        {/* DASHBOARD MOCK */}
        <div className="mt-16 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
          <img
            src="/dashboard.png"
            alt="Dashboard"
            className="w-full"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10 text-center">
        {[
          {
            title: "Find Leads",
            desc: "Search targeted leads using LinkedIn + AI",
          },
          {
            title: "Send Campaigns",
            desc: "Automated multi-step email sequences",
          },
          {
            title: "Close Deals",
            desc: "Track replies and convert faster",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-gray-900 rounded-xl border border-gray-800"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
        {[
          "Smart Lead Generation",
          "Email Automation",
          "AI Personalization",
          "Reply Tracking",
        ].map((feature, i) => (
          <div
            key={i}
            className="p-6 bg-gray-900 rounded-xl border border-gray-800"
          >
            <p className="text-lg">✔ {feature}</p>
          </div>
        ))}
      </section>

      {/* SOCIAL PROOF */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold">
          Trusted by founders & agencies
        </h2>

        <div className="mt-8 space-y-4 text-gray-400">
          <p>★★★★★ “Saved me hours of manual outreach”</p>
          <p>★★★★★ “Better than Apollo for my workflow”</p>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
          { name: "Starter", price: "$19" },
          { name: "Growth", price: "$49", highlight: true },
          { name: "Pro", price: "$99" },
        ].map((plan, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border ${
              plan.highlight
                ? "border-blue-500 bg-gray-900"
                : "border-gray-800"
            }`}
          >
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-3xl mt-4">{plan.price}</p>

            <button className="mt-6 w-full bg-blue-600 py-2 rounded-lg">
              Choose Plan
            </button>
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold">
          Start generating leads in 60 seconds 🚀
        </h2>

        <Link href="/register">
          <button className="mt-6 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-lg">
            Get Started
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} KoniqTech. All rights reserved.
      </footer>
    </div>
  );
}