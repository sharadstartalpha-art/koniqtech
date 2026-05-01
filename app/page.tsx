"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="font-semibold text-lg">KoniqTech</h1>

        <a
          href="/login"
          className="text-sm bg-black text-white px-4 py-2 rounded-md"
        >
          Login
        </a>
      </div>

      {/* HERO */}
      <section className="text-center py-28 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Stop Chasing Clients.
          <br />
          <span className="text-blue-600">
            Get Paid Automatically.
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          KoniqTech sends smart reminders, escalates follow-ups, and helps you
          recover unpaid invoices — without awkward conversations.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg"
          >
            Start Free Trial
          </a>

          <a
            href="#pricing"
            className="border px-6 py-3 rounded-lg text-lg"
          >
            View Pricing
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          No credit card required
        </p>
      </section>

      {/* TRUST BAR */}
      <section className="text-center py-10 border-t border-b">
        <p className="text-gray-500 text-sm">
          Trusted by freelancers & agencies worldwide
        </p>

        <div className="flex justify-center gap-10 mt-4 text-gray-400 text-sm">
          <span>Designers</span>
          <span>Developers</span>
          <span>Agencies</span>
          <span>Consultants</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Step number="1" title="Create Invoice" desc="Add your invoice in seconds" />
          <Step number="2" title="Auto Follow-ups" desc="We send reminders for you" />
          <Step number="3" title="Get Paid" desc="Recover payments faster" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Feature title="Automated Reminders" desc="Never manually follow up again" />
            <Feature title="AI Email Generation" desc="Friendly → firm → final emails" />
            <Feature title="Smart Escalation" desc="Day 1, 3, 7 follow-ups automatically" />
            <Feature title="Email Tracking" desc="See opens and engagement" />
            <Feature title="Duplicate Prevention" desc="No accidental spam" />
            <Feature title="Dashboard Insights" desc="Track recovery performance" />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose KoniqTech?
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <Benefit text="Recover up to 70% of overdue invoices" />
          <Benefit text="Save hours every week" />
          <Benefit text="Avoid awkward client conversations" />
          <Benefit text="Look professional & consistent" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          <Testimonial
            name="Rahul S"
            text="Recovered $2,300 in 5 days. This tool is insane."
          />
          <Testimonial
            name="Ankit Verma"
            text="No more chasing clients. It just works."
          />
          <Testimonial
            name="Sarah M"
            text="Feels like having a billing assistant."
          />
        </div>
      </section>

      {/* PRICING */}
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

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <FAQ q="Do clients see automated emails?" a="Yes, but they feel human and professional." />
        <FAQ q="Can I stop reminders anytime?" a="Yes, you have full control." />
        <FAQ q="Does it work globally?" a="Yes, works for US, EU, and worldwide clients." />
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-24 bg-black text-white">
        <h2 className="text-3xl font-bold mb-6">
          Start Recovering Payments Today
        </h2>

        <p className="text-gray-300 mb-8">
          Join freelancers getting paid faster with KoniqTech
        </p>

        <a
          href="/login"
          className="bg-white text-black px-8 py-4 rounded-lg text-lg"
        >
          Start Free Trial
        </a>
      </section>

    </div>
  );
}

/* COMPONENTS */

function Feature({ title, desc }: any) {
  return (
    <div className="bg-white p-6 border rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }: any) {
  return (
    <div>
      <div className="text-blue-600 font-bold text-xl mb-2">{number}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function Benefit({ text }: any) {
  return <p className="text-gray-700">✔ {text}</p>;
}

function Testimonial({ name, text }: any) {
  return (
    <div className="bg-white p-6 border rounded-lg">
      <p className="text-gray-700 mb-4">"{text}"</p>
      <p className="text-sm font-semibold">{name}</p>
    </div>
  );
}

function FAQ({ q, a }: any) {
  return (
    <div className="mb-6">
      <h4 className="font-semibold">{q}</h4>
      <p className="text-gray-600 text-sm">{a}</p>
    </div>
  );
}

function Plan({ name, price, limit, highlight }: any) {
  return (
    <div className={`p-6 border rounded-lg ${highlight ? "border-black" : ""}`}>
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