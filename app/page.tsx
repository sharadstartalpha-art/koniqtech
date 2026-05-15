"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Logo from "@/components/Logo";

import {
  ArrowRight,
  BellRing,
  ShieldCheck,
  BarChart3,
  Check,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Plan = {
  id: string;
  name: string;
  price: number;
  invoiceLimit: number | null;
};

/* =========================
   HOME
========================= */

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/plans/invoice-recovery");
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="bg-white text-gray-900 overflow-hidden pt-24">
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* LEFT */}

          <div className="flex items-center gap-12">
            <Logo />

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition"
              >
                Features
              </a>

              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition"
              >
                Pricing
              </a>

              <a
                href="#faq"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition"
              >
                FAQ
              </a>

              <a
                href="#contact"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Sign In
            </a>

            <a
              href="/login"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />

        {/* BLUR EFFECTS */}

        <div className="absolute top-40 left-20 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30" />

        <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-5 py-2 rounded-full text-sm font-semibold mb-8">
            💰 $127,430+ recovered by users
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-5xl mx-auto">
            Recover Unpaid
            <span className="block text-orange-500">
              Invoices Automatically
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed">
            KoniqTech helps freelancers and agencies recover unpaid invoices
            with AI-powered follow-ups, intelligent escalation, and automated
            payment reminders.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <a
              href="/login"
              className="bg-black hover:bg-gray-800 transition text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-2xl inline-flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight size={20} />
            </a>

            <a
              href="#features"
              className="border border-gray-300 hover:border-black transition px-8 py-4 rounded-2xl text-lg font-medium bg-white"
            >
              See How It Works
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-5">
            No credit card required • Cancel anytime • Works worldwide
          </p>

          {/* DASHBOARD */}

          <div className="mt-24 relative max-w-6xl mx-auto">
            <motion.div
              whileHover={{ y: -6 }}
              className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-2xl"
            >
              <img
                src="/dashboardn.png"
                alt="Dashboard Preview"
                className="w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================
          SOCIAL PROOF
      ========================= */}

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-gray-500 mb-8">
            Trusted by freelancers, consultants & agencies worldwide
          </p>

          <div className="flex flex-wrap justify-center gap-10 text-gray-400 font-medium">
            <span>Web Developers</span>
            <span>Marketing Agencies</span>
            <span>Consultants</span>
            <span>Freelancers</span>
            <span>Design Studios</span>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section
        id="features"
        className="py-28 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold tracking-tight mb-6">
            Everything you need
            <br />
            to recover payments faster
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful automation tools designed for modern freelancers and
            agencies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BellRing size={30} />}
            title="Smart Follow-ups"
            desc="Automatic reminders based on payment behavior and timing."
          />

          <FeatureCard
            icon={<ShieldCheck size={30} />}
            title="AI Escalation"
            desc="Friendly → firm → final reminders sent automatically."
          />

          <FeatureCard
            icon={<BarChart3 size={30} />}
            title="Advanced Tracking"
            desc="Track opens, replies, payments, and invoice recovery."
          />
        </div>
      </section>


{/* HOW IT WORKS */}

<section className="py-28 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-bold tracking-tight mb-6">
        Recover invoices in 3 simple steps
      </h2>

      <p className="text-xl text-gray-600">
        Fully automated collections for freelancers & agencies.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      <div className="p-8 rounded-3xl border border-gray-200">
        <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-bold mb-6">
          1
        </div>

        <h3 className="text-2xl font-bold mb-4">
          Create Invoice
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Add your invoice amount, client email, and due date in seconds.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-gray-200">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl font-bold mb-6">
          2
        </div>

        <h3 className="text-2xl font-bold mb-4">
          Enable Automation
        </h3>

        <p className="text-gray-600 leading-relaxed">
          KoniqTech automatically sends smart reminders and escalations.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-gray-200">
        <div className="w-14 h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center text-xl font-bold mb-6">
          3
        </div>

        <h3 className="text-2xl font-bold mb-4">
          Get Paid Faster
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Track opens, responses, and payments from your dashboard.
        </p>
      </div>
    </div>
  </div>
</section>


{/* INTEGRATIONS */}

<section className="py-24 border-y border-gray-100 bg-gray-50">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <p className="text-sm font-semibold uppercase tracking-wider text-orange-500 mb-6">
      Integrations
    </p>

    <h2 className="text-5xl font-bold tracking-tight mb-8">
      Works with your existing workflow
    </h2>

    <div className="flex flex-wrap justify-center gap-6">
      {[
        "PayPal",
        "Stripe",
        "Gmail",
        "Outlook",
        "Zapier",
        "Slack",
      ].map((item) => (
        <div
          key={item}
          className="px-8 py-5 bg-white border border-gray-200 rounded-2xl font-semibold shadow-sm"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
</section>


{/* ROI */}

<section className="py-28 bg-black text-white">
  <div className="max-w-5xl mx-auto px-6 text-center">
    <h2 className="text-5xl font-bold tracking-tight mb-8">
      One recovered invoice
      pays for your subscription.
    </h2>

    <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
      Most freelancers lose thousands every year from unpaid invoices.
      KoniqTech automates collections so you recover revenue without awkward follow-ups.
    </p>

    <div className="grid md:grid-cols-3 gap-8 mt-16">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <p className="text-5xl font-bold mb-3">$4,200</p>
        <p className="text-gray-400">
          Average recovered revenue
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <p className="text-5xl font-bold mb-3">8 hrs</p>
        <p className="text-gray-400">
          Saved every month
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <p className="text-5xl font-bold mb-3">70%</p>
        <p className="text-gray-400">
          Faster payment recovery
        </p>
      </div>
    </div>
  </div>
</section>

      {/* =========================
          STATS
      ========================= */}

      <section className="bg-black text-white py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <Stat number="70%" label="Invoices recovered" />

            <Stat number="3x" label="Faster payments" />

            <Stat number="10+ hrs" label="Saved every month" />
          </div>
        </div>
      </section>

      {/* =========================
          TESTIMONIALS
      ========================= */}

      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              Loved by freelancers
            </h2>

            <p className="text-gray-600 text-lg">
              Thousands of businesses use KoniqTech to recover revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              text="Recovered $4,200 in one week. Completely changed my cash flow."
              name="Alex — USA"
            />

            <Testimonial
              text="Clients actually respond now. The automation feels incredibly professional."
              name="Daniel — UK"
            />

            <Testimonial
              text="Feels like having an accounts receivable assistant working 24/7."
              name="Sophie — Germany"
            />
          </div>
        </div>
      </section>


      {/* TRUST */}

<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-3 gap-8">
      <div className="border border-gray-200 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-3">
          Secure Infrastructure
        </h3>

        <p className="text-gray-600">
          Your invoices and reminders are protected with enterprise-grade security.
        </p>
      </div>

      <div className="border border-gray-200 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-3">
          Global Payments
        </h3>

        <p className="text-gray-600">
          Accept payments from clients worldwide using PayPal and Stripe.
        </p>
      </div>

      <div className="border border-gray-200 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-3">
          AI-Powered Automation
        </h3>

        <p className="text-gray-600">
          Automated escalation sequences increase response and recovery rates.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* =========================
          PRICING
      ========================= */}

      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight mb-5">
              Simple pricing
            </h2>

            <p className="text-xl text-gray-600">
              Start free. Upgrade when you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {plans.map((p: Plan) => {
              const isPopular = p.name === "Growth";

              return (
                <motion.div
                  whileHover={{ y: -6 }}
                  key={p.id}
                  className={`relative rounded-3xl p-8 border transition-all duration-300 hover:shadow-2xl ${
                    isPopular
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-black scale-105"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-2xl font-bold">
                    {p.name}
                  </h3>

                  <div className="my-8">
                    <span className="text-6xl font-bold tracking-tight">
                      ${p.price}
                    </span>

                    <span
                      className={`${
                        isPopular
                          ? "text-orange-100"
                          : "text-gray-500"
                      }`}
                    >
                      /mo
                    </span>
                  </div>

                  <div className="space-y-4 mb-10">

  {p.name === "Free" && (
    <>
      <PricingFeature text="5 invoice recoveries" />
      <PricingFeature text="Basic reminders" />
      <PricingFeature text="Email support" />
      <PricingFeature text="Dashboard access" />
    </>
  )}

  {p.name === "Starter" && (
    <>
      <PricingFeature text="20 invoice recoveries" />
      <PricingFeature text="Automated reminders" />
      <PricingFeature text="AI escalation system" />
      <PricingFeature text="Payment tracking" />
      <PricingFeature text="Email support" />
    </>
  )}

  {p.name === "Growth" && (
    <>
      <PricingFeature text="100 invoice recoveries" />
      <PricingFeature text="Advanced AI escalation" />
      <PricingFeature text="Analytics dashboard" />
      <PricingFeature text="PayPal & Stripe integrations" />
      <PricingFeature text="Priority support" />
    </>
  )}

  {p.name === "Pro" && (
    <>
      <PricingFeature text="Unlimited invoice recoveries" />
      <PricingFeature text="Custom automation flows" />
      <PricingFeature text="Advanced analytics" />
      <PricingFeature text="Team access" />
      <PricingFeature text="Dedicated priority support" />
    </>
  )}

</div>

                  <a
                    href="/login"
                    className={`block text-center w-full py-4 rounded-2xl font-semibold transition ${
                      isPopular
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {p.price === 0
                      ? "Start Free"
                      : "Get Started"}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          FAQ
      ========================= */}

      <section id="faq" className="py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-5">
              Frequently Asked Questions
            </h2>

            <p className="text-xl text-gray-600">
              Everything you need to know about KoniqTech.
            </p>
          </div>

          <div className="space-y-6">
            <FaqItem
              question="How does KoniqTech recover unpaid invoices?"
              answer="KoniqTech automatically sends intelligent follow-up emails to clients with unpaid invoices."
            />

            <FaqItem
              question="Can I use my own PayPal account?"
              answer="Yes. You can connect your own PayPal account."
            />

            <FaqItem
              question="Can I cancel anytime?"
              answer="Absolutely. There are no contracts or hidden fees."
            />
          </div>
        </div>
      </section>

      {/* =========================
          CONTACT
      ========================= */}

      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Contact Us
              </div>

              <h2 className="text-5xl font-bold tracking-tight leading-tight mb-6">
                Need help or have
                <br />
                questions?
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mb-10">
                Our team is here to help you recover payments faster and grow
                your business with confidence.
              </p>
            </div>

            {/* RIGHT */}

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">
                Send us a message
              </h3>

              <form
                action="https://formsubmit.co/info@koniqtech.com"
                method="POST"
                className="space-y-5"
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="New Contact Form Message - KoniqTech"
                />

                <input
                  type="hidden"
                  name="_captcha"
                  value="false"
                />

                <input
                  type="hidden"
                  name="_template"
                  value="table"
                />

                <input
                  type="hidden"
                  name="_next"
                  value="https://koniqtech.com/thanks"
                />

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>

                  <textarea
                    rows={5}
                    name="message"
                    required
                    placeholder="Tell us how we can help..."
                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-orange-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-semibold transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="bg-orange-500 text-white py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-6xl font-bold tracking-tight leading-tight mb-6">
            Stop losing money
            <br />
            to unpaid invoices.
          </h2>

          <p className="text-xl text-orange-100 mb-10">
            Start recovering payments automatically today.
          </p>

          <a
            href="/login"
            className="bg-white text-black px-10 py-5 rounded-2xl text-lg font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition"
          >
            Start Free Trial
            <ArrowRight size={20} />
          </a>
        </div>
      </section>


<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
  <a
    href="/login"
    className="bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition inline-flex items-center gap-2"
  >
    Start Recovering Invoices
    <ArrowRight size={18} />
  </a>
</div>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Logo />

            <p className="text-gray-500 mt-4 max-w-sm">
              AI-powered invoice recovery for freelancers and agencies.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="font-semibold mb-4">
                Product
              </h4>

              <div className="space-y-3 text-gray-500 text-sm">
                <a
                  href="#features"
                  className="block hover:text-orange-500"
                >
                  Features
                </a>

                <a
                  href="#pricing"
                  className="block hover:text-orange-500"
                >
                  Pricing
                </a>

                <a
                  href="#faq"
                  className="block hover:text-orange-500"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">
                Company
              </h4>

              <div className="space-y-3 text-gray-500 text-sm">
                <a
                  href="#contact"
                  className="block hover:text-orange-500"
                >
                  Contact
                </a>

                <a
                  href="/privacy"
                  className="block hover:text-orange-500"
                >
                  Privacy
                </a>

                <a
                  href="/terms"
                  className="block hover:text-orange-500"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-8 rounded-3xl border border-gray-200 bg-white hover:shadow-xl transition"
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function PricingFeature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Check size={18} className="text-green-500" />

      <span className="text-sm font-medium">
        {text}
      </span>
    </div>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-6xl font-bold mb-3">
        {number}
      </p>

      <p className="text-gray-400 text-lg">
        {label}
      </p>
    </div>
  );
}

function Testimonial({
  text,
  name,
}: {
  text: string;
  name: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm"
    >
      <p className="text-lg leading-relaxed mb-6">
        "{text}"
      </p>

      <p className="font-semibold">
        {name}
      </p>
    </motion.div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white border border-gray-200 rounded-3xl p-8"
    >
      <h3 className="text-xl font-bold mb-3">
        {question}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {answer}
      </p>
    </motion.div>
  );
}