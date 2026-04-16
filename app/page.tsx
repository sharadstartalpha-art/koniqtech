"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, stagger } from "@/lib/animations";

export default function LandingPage() {
  const features = [
    "Smart Lead Generation",
    "Email Automation",
    "AI Personalization",
    "Reply Tracking",
  ];

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">

      {/* 🌌 BACKGROUND GRADIENT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent)]" />

      {/* 🚀 HERO */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative text-center py-24 px-6"
      >
        {/* glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/20 via-blue-500/10 to-transparent blur-3xl" />

        <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Generate Leads & Send Cold Emails Automatically
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Find verified leads, send smart sequences, and close deals —
          all from one platform.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register">
            <button className="relative overflow-hidden bg-blue-600 px-6 py-3 rounded-lg group">
              <span className="relative z-10">Start Free Trial 🚀</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="border border-gray-600 px-6 py-3 rounded-lg text-lg hover:bg-white/10 transition">
              View Demo
            </button>
          </Link>
        </div>

        {/* 📊 Dashboard Image */}
        <div className="mt-16 max-w-5xl mx-auto">
          <motion.img
            src="/dashboard.png"
            className="rounded-xl shadow-2xl border border-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.section>

      {/* ⚙️ HOW IT WORKS */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10 text-center"
      >
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
            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-gray-400">{item.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* ✨ FEATURES (STAGGER) */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-6"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={fadeUp}>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              ✔ {f}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ⭐ SOCIAL PROOF */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="text-center py-20"
      >
        <h2 className="text-3xl font-bold">
          Trusted by founders & agencies
        </h2>

        <div className="mt-8 space-y-4 text-gray-400">
          <p>★★★★★ “Saved me hours of manual outreach”</p>
          <p>★★★★★ “Better than Apollo for my workflow”</p>
        </div>
      </motion.div>

      {/* 💰 PRICING */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8"
      >
        {[
          { name: "Starter", price: "$19" },
          { name: "Growth", price: "$49", highlight: true },
          { name: "Pro", price: "$99" },
        ].map((plan, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
              plan.highlight
                ? "border-blue-500 bg-white/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-3xl mt-4">{plan.price}</p>

            <button className="mt-6 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition">
              Choose Plan
            </button>
          </div>
        ))}
      </motion.div>

      {/* 🚀 FINAL CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="text-center py-20"
      >
        <h2 className="text-3xl font-bold">
          Start generating leads in 60 seconds 🚀
        </h2>

        <Link href="/register">
          <button className="mt-6 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-lg transition">
            Get Started
          </button>
        </Link>
      </motion.div>

      {/* 🧾 FOOTER */}
      <footer className="text-center py-10 text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} KoniqTech. All rights reserved.
      </footer>
    </div>
  );
}