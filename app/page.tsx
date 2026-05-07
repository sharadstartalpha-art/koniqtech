
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-8">
            <a
              href="#pricing"
              className="text-sm text-gray-600 hover:text-black transition"
            >
              Pricing
            </a>

            <a
              href="/login"
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />

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
            with AI-powered follow-ups, intelligent escalation,
            and automated payment reminders.
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

          <div className="mt-24 relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />

            <div className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 border-b px-6 py-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>

              <div className="p-10 grid md:grid-cols-3 gap-6 text-left">
                <DashboardCard
                  title="$18,430"
                  label="Recovered This Month"
                />

                <DashboardCard
                  title="42"
                  label="Pending Invoices"
                />

                <DashboardCard
                  title="87%"
                  label="Recovery Rate"
                />
              </div>
            </div>
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
            Powerful automation tools designed for modern freelancers and agencies.
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
                <div
                  key={p.id}
                  className={`relative rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isPopular
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-black scale-105"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-full">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-2xl font-bold">{p.name}</h3>

                  <div className="my-8">
                    <span className="text-6xl font-bold tracking-tight">
                      ${p.price}
                    </span>

                    <span
                      className={`${
                        isPopular
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      /mo
                    </span>
                  </div>

                  <div className="space-y-4 mb-10">
                    <PricingFeature
                      text={
                        p.invoiceLimit === -1 ||
                        p.invoiceLimit === null
                          ? "Unlimited invoices"
                          : `${p.invoiceLimit} invoices`
                      }
                    />

                    <PricingFeature text="AI email reminders" />
                    <PricingFeature text="Invoice tracking" />
                    <PricingFeature text="Payment recovery dashboard" />
                  </div>

                  <a
                    href="/login"
                    className={`block text-center w-full py-4 rounded-2xl font-semibold transition ${
                      isPopular
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {p.price === 0 ? "Start Free" : "Get Started"}
                  </a>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            Pay securely via PayPal • Cancel anytime
          </p>
        </div>
      </section>

      {/* =========================
          FAQ SECTION
      ========================= */}

      <section className="py-28 bg-gray-50">
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
              answer="KoniqTech automatically sends intelligent follow-up emails to clients with unpaid invoices. The system escalates reminders professionally over time to improve payment recovery."
            />

            <FaqItem
              question="Can I use my own PayPal account?"
              answer="Yes. You can connect your own PayPal account and receive payments directly from clients."
            />

            <FaqItem
              question="Do clients know emails are automated?"
              answer="No. Emails are written naturally and professionally using AI, making them feel personal and human."
            />

            <FaqItem
              question="Can I cancel anytime?"
              answer="Absolutely. There are no contracts or hidden fees. You can cancel your subscription anytime."
            />

            <FaqItem
              question="Does KoniqTech work worldwide?"
              answer="Yes. KoniqTech works globally and supports freelancers, consultants, and agencies from any country."
            />
          </div>
        </div>
      </section>

      {/* =========================
          CONTACT SECTION
      ========================= */}

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
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
                Our team is here to help you recover payments faster
                and grow your business with confidence.
              </p>
            </div>

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

<input
  type="hidden"
  name="_next"
  value="https://koniqtech.com/thanks"
/>

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

      <section className="bg-orange-500 hover:bg-orange-600 text-white py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-6xl font-bold tracking-tight leading-tight mb-6">
            Stop losing money
            <br />
            to unpaid invoices.
          </h2>

          <p className="text-xl text-gray-300 mb-10">
            Start recovering payments automatically today.
          </p>

          <a
            href="/login"
            className="bg-white text-black px-10 py-5 rounded-2xl text-lg font-semibold inline-flex items-center gap-2 hover:bg-gray-200 transition"
          >
            Start Free Trial
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function DashboardCard({
  title,
  label,
}: {
  title: string;
  label: string;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
      <p className="text-4xl font-bold mb-2">{title}</p>

      <p className="text-gray-500">{label}</p>
    </div>
  );
}

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
    <div className="p-8 rounded-3xl border border-gray-200 bg-white hover:shadow-xl transition">
      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingFeature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Check size={18} />

      <span className="text-sm">{text}</span>
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
      <p className="text-6xl font-bold mb-3">{number}</p>

      <p className="text-gray-400 text-lg">{label}</p>
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
    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
      <p className="text-lg leading-relaxed mb-6">"{text}"</p>

      <p className="font-semibold">{name}</p>
    </div>
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
    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      <h3 className="text-xl font-bold mb-3">{question}</h3>

      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}

