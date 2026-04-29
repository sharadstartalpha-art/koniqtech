"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export default function Home() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">

      {/* HERO */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="text-center py-24 px-6 max-w-4xl mx-auto"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl font-bold leading-tight mb-6"
        >
          Recover Unpaid Invoices
          <br />
          <span className="text-blue-600">
            Automatically
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg text-gray-600 mb-8"
        >
          Stop chasing clients. Let automation do it for you.
        </motion.p>

        <motion.div variants={fadeUp}>
          <a
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg"
          >
            Start Free Trial
          </a>
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto py-20 px-6"
      >
        <Feature title="Auto Reminders" />
        <Feature title="AI Emails" />
        <Feature title="Payment Tracking" />
      </motion.section>

    </div>
  );
}

/* FEATURE CARD */
function Feature({ title }: { title: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
    >
      <h3 className="font-semibold text-lg">
        {title}
      </h3>
    </motion.div>
  );
}