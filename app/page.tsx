"use client";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Stop Chasing Clients for Payments.
          <br />
          <span className="text-blue-600">
            Recover Your Money Automatically.
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          KoniqTech sends smart follow-ups and helps you recover unpaid invoices —
          without awkward conversations.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg"
          >
            Start Free Trial
          </a>

          <a
            href="#demo"
            className="border px-6 py-3 rounded-lg text-lg"
          >
            See Demo
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          No credit card required
        </p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="text-center py-10 bg-gray-50">
        <p className="text-gray-500 mb-2">
          Freelancers & agencies are recovering:
        </p>
        <h2 className="text-3xl font-bold">
          $500 – $3,000/month extra
        </h2>
      </section>

      {/* PAIN SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

        <Card text="You send invoices… clients ignore them" />
        <Card text="You follow up… feels awkward" />
        <Card text="You lose money… every month" />

      </section>

      {/* SOLUTION */}
      <section className="text-center py-20 bg-gray-50 px-6">

        <h2 className="text-3xl font-bold mb-6">
          We Handle Follow-Ups For You
        </h2>

        <p className="text-gray-600 mb-10">
          Automatically send reminders, track payments,
          and get paid faster.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <Feature title="Auto Reminders" desc="Emails sent automatically" />
          <Feature title="AI Follow-ups" desc="Human-like messages" />
          <Feature title="Payment Tracking" desc="Know instantly when paid" />

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 text-center">

        <h2 className="text-3xl font-bold mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <Step step="1" text="Create invoice" />
          <Step step="2" text="We follow up automatically" />
          <Step step="3" text="You get paid" />

        </div>

      </section>

      {/* PRICING */}
      <section className="py-20 bg-gray-50 text-center">

        <h2 className="text-3xl font-bold mb-10">
          Simple Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <Pricing name="Starter" price="$19" features="20 invoices" />
          <Pricing name="Growth" price="$39" features="100 invoices" />
          <Pricing name="Pro" price="$79" features="Unlimited" />

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center">

        <h2 className="text-3xl font-bold mb-6">
          Stop Losing Money Today
        </h2>

        <a
          href="/login"
          className="bg-black text-white px-8 py-4 rounded-lg text-lg"
        >
          Start Free Trial
        </a>

      </section>

    </div>
  );
}

function Card({ text }: any) {
  return (
    <div className="bg-white p-6 shadow rounded">
      {text}
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <h3 className="font-bold">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}

function Step({ step, text }: any) {
  return (
    <div>
      <h3 className="text-xl font-bold">{step}</h3>
      <p>{text}</p>
    </div>
  );
}

function Pricing({ name, price, features }: any) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <h3 className="font-bold">{name}</h3>
      <p className="text-2xl my-4">{price}</p>
      <p>{features}</p>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded">
        Choose
      </button>
    </div>
  );
}