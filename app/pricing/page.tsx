"use client"

export default function PricingPage() {
  const handleUpgrade = async (plan: string) => {
    const res = await fetch("/api/paypal/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Payment failed ❌")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-10">Pricing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {/* FREE */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Free</h2>
          <p className="text-2xl mb-4">$0</p>
          <p>10 leads</p>
          <p>No email sending</p>

          <button
            className="mt-4 w-full bg-gray-300 py-2 rounded"
          >
            Start Free
          </button>
        </div>

        {/* PRO */}
        <div className="bg-white p-6 rounded shadow text-center border-2 border-black">
          <h2 className="text-xl font-bold mb-2">Pro</h2>
          <p className="text-2xl mb-4">$19/month</p>
          <p>1000 leads</p>
          <p>AI scoring</p>
          <p>Email sending</p>

          <button
            onClick={() => handleUpgrade("PRO")}
            className="mt-4 w-full bg-black text-white py-2 rounded"
          >
            Upgrade
          </button>
        </div>

        {/* AGENCY */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Agency</h2>
          <p className="text-2xl mb-4">$49/month</p>
          <p>Unlimited leads</p>
          <p>Automation</p>

          <button
            onClick={() => handleUpgrade("AGENCY")}
            className="mt-4 w-full bg-black text-white py-2 rounded"
          >
            Upgrade
          </button>
        </div>

      </div>
    </div>
  )
}