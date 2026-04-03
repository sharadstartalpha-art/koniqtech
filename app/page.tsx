import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      
      
      {/* HERO */}
<section className="text-center py-20 px-6 max-w-5xl mx-auto bg-gradient-to-b from-white to-gray-100 rounded-xl">
        
        <h1 className="text-5xl font-bold leading-tight mb-6">
  Find Leads.{" "}
  <span className="text-blue-600">Close Deals.</span>{" "}
  Faster.
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



{/* DASHBOARD PREVIEW */}
<section className="max-w-6xl mx-auto px-6 pb-20">

  <h2 className="text-2xl font-bold text-center mb-8">
    See KoniqTech in action
  </h2>

  <div className="bg-white border rounded-xl shadow-lg p-4">
    <img
      src="/dashboard-preview.png"
      alt="Dashboard Preview"
      className="rounded-lg w-full"
    />
  </div>

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


{/* TESTIMONIALS */}
<section className="bg-gray-50 py-16">
  <h2 className="text-center text-2xl font-bold mb-10">
    What users say
  </h2>

  <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6">

    {[
      {
        name: "John D.",
        text: "KoniqTech helped us generate 200+ leads in a week 🚀",
      },
      {
        name: "Sarah M.",
        text: "Cold email automation saved us hours daily.",
      },
      {
        name: "Agency Owner",
        text: "Best tool for scaling outreach. Worth every dollar.",
      },
    ].map((t, i) => (
      <div key={i} className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-700 mb-4">"{t.text}"</p>
        <p className="font-semibold">{t.name}</p>
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