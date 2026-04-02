export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">

      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find Leads. Score Them. Close Deals.
        </h1>

        <p className="text-gray-600 mb-6">
          AI-powered lead generation + outreach system for agencies & founders
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-black text-white px-6 py-3 rounded"
          >
            Get Started Free
          </a>

          <a
            href="/pricing"
            className="border px-6 py-3 rounded"
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
        {[
          "🔍 Find real business leads",
          "🧠 AI scoring & insights",
          "✉️ Auto cold email generator",
          "📤 Send emails in 1 click",
          "🔁 Follow-up sequences",
          "📊 CRM pipeline tracking",
        ].map((item, i) => (
          <div key={i} className="border p-4 rounded">
            {item}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">
          Start getting clients today
        </h2>

        <a
          href="/register"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Create Free Account
        </a>
      </section>
    </div>
  )
}