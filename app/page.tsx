"use client";
import Logo from "@/components/Logo";



export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-5 border-b">
        <Logo />

        <div className="flex gap-4 items-center">
          <a href="#pricing" className="text-sm text-gray-600">
            Pricing
          </a>

          <a
            href="/login"
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="text-center py-32 px-6 max-w-5xl mx-auto">
        <p className="text-green-600 font-semibold mb-4">
  💰 $127,430+ recovered by users
</p>
        <h1 className="text-6xl font-bold leading-tight mb-6">
          Get Paid Without
          <br />
          Chasing Clients.
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          KoniqTech automatically follows up on unpaid invoices,
          escalates emails intelligently, and helps you recover money
          faster — without awkward conversations.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-black text-white px-8 py-4 rounded-lg text-lg"
          >
            Start Free Trial
          </a>

          <a
            href="#demo"
            className="border px-8 py-4 rounded-lg text-lg"
          >
            See How It Works
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          No credit card required • Works worldwide • Pay via PayPal
        </p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="text-center py-10 border-t border-b">
        <p className="text-gray-500 text-sm mb-4">
          Freelancers & agencies use KoniqTech to recover payments faster
        </p>

        <div className="flex justify-center gap-12 text-gray-400 text-sm">
          <span>Web Developers</span>
          <span>Design Agencies</span>
          <span>Consultants</span>
          <span>Freelancers</span>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Unpaid invoices kill your cash flow.
        </h2>

        <p className="text-gray-600 text-lg">
          Clients forget. Emails get ignored. Follow-ups feel awkward.
          Most freelancers lose thousands every year just because they
          don’t follow up consistently.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            We fix that automatically.
          </h2>

          <p className="text-gray-600 mb-12">
            KoniqTech follows up for you — politely, professionally,
            and persistently.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              title="Add Invoice"
              desc="Create or import your invoice in seconds"
            />
            <Step
              title="Auto Follow-ups"
              desc="AI sends reminders (friendly → firm → final)"
            />
            <Step
              title="Get Paid"
              desc="Recover payments faster without effort"
            />
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">
          Real Results
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Stat number="70%" label="Invoices recovered" />
          <Stat number="3x" label="Faster payments" />
          <Stat number="10+ hrs" label="Saved monthly" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 py-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          Loved by freelancers
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          <Testimonial
            text="Recovered $4,200 in one week. Worth every dollar."
            name="Alex — USA"
          />
          <Testimonial
            text="Clients actually respond now. No more ghosting."
            name="Daniel — UK"
          />
          <Testimonial
            text="Feels like having a full-time assistant."
            name="Sophie — Germany"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything you need to get paid
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature title="Smart Reminders" desc="Automatic follow-ups based on timing" />
          <Feature title="AI Emails" desc="Human-like email generation" />
          <Feature title="Tracking" desc="See who opens your emails" />
          <Feature title="Escalation" desc="Friendly → firm → final reminders" />
          <Feature title="Dashboard" desc="Track recovery & revenue" />
          <Feature title="No Spam" desc="Prevents duplicate emails" />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-gray-50 py-24 text-center">
        <h2 className="text-4xl font-bold mb-12">
          Simple pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          <Plan name="Starter" price="$19" desc="For freelancers" />
          <Plan name="Growth" price="$39" desc="For growing businesses" highlight />
          <Plan name="Pro" price="$79" desc="For agencies" />
        </div>

        <p className="text-gray-500 mt-6 text-sm">
          Pay securely via PayPal • Cancel anytime
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-28 bg-black text-white">
        <h2 className="text-4xl font-bold mb-6">
          Stop losing money to unpaid invoices.
        </h2>

        <p className="text-gray-300 mb-8">
          Start recovering payments today.
        </p>

        <a
          href="/login"
          className="bg-white text-black px-10 py-4 rounded-lg text-lg"
        >
          Start Free Trial
        </a>
      </section>

    </div>
  );
}

/* COMPONENTS */

function Step({ title, desc }: any) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="border p-6 rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function Stat({ number, label }: any) {
  return (
    <div>
      <p className="text-3xl font-bold">{number}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

function Testimonial({ text, name }: any) {
  return (
    <div className="bg-white p-6 border rounded-lg">
      <p className="mb-4">"{text}"</p>
      <p className="text-sm font-semibold">{name}</p>
    </div>
  );
}

function Plan({ name, price, desc, highlight }: any) {
  return (
    <div className={`p-6 border rounded-lg ${highlight ? "border-black" : ""}`}>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-3xl my-4">{price}</p>
      <p className="text-gray-500 text-sm">{desc}</p>

      <a
        href="/login"
        className="block mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Get Started
      </a>
    </div>
  );
}