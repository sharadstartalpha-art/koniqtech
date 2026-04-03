import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 border-b sticky top-0 bg-white z-50">
        <Logo />

        <div className="flex gap-4 items-center">
          <a href="/login" className="text-sm border px-4 py-2 rounded">
            Login
          </a>

          <a
            href="/register"
            className="bg-primary text-white px-5 py-2 rounded-lg shadow"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6 max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Find Leads. <span className="text-primary">Close Deals.</span> Faster.
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          AI-powered lead generation, scoring, and outreach platform  
          built for agencies & founders.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-primary text-white px-6 py-3 rounded-lg text-lg shadow"
          >
            Start Free Trial 🚀
          </a>

          <a
            href="/pricing"
            className="border px-6 py-3 rounded-lg text-lg"
          >
            View Pricing
          </a>
        </div>

        {/* TRUST BADGE */}
        <p className="text-sm text-gray-500 mt-6">
          No credit card required • Cancel anytime
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-2xl font-bold text-center mb-10">
          Everything you need to scale outreach
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            "Find real business leads",
            "AI scoring & insights",
            "Auto cold email generator",
            "Send emails in 1 click",
            "Follow-up sequences",
            "CRM pipeline tracking",
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 border rounded-xl hover:shadow-md transition"
            >
              <p className="font-medium">{item}</p>
            </div>
          ))}

        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-gray-50 py-16 text-center">
        <h2 className="text-xl font-semibold mb-6">
          Trusted by founders & agencies worldwide 🌍
        </h2>

        <p className="text-gray-600">
          Generate leads, automate outreach, and close deals — all in one place.
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Start getting clients today
        </h2>

        <p className="text-gray-600 mb-6">
          Join KoniqTech and scale your outreach instantly.
        </p>

        <a
          href="/register"
          className="bg-accent text-white px-8 py-3 rounded-lg text-lg shadow"
        >
          Get Started Free
        </a>

      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KoniqTech. All rights reserved.
      </footer>

    </div>
  );
}